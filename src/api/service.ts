import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from "@firebase/firestore";
import { db } from "./firebase";
import { serverTimestamp } from "@firebase/firestore";
import { v4 } from 'uuid';

export const addVideo = (video: any, userId: string) => {
  const newVideoId = v4();

  return writeBatch(db)
    .set(doc(db, 'videos', newVideoId), {
      ...video,
      viewsCount: 0,
      likesCount: 0,
      dislikesCount: 0,
      createdAt: serverTimestamp()
    })
    .commit()
    .then(() => ({
      ...video,
      id: newVideoId
    }));
}

export const addComment = (videoId: string, comment: any) => {
  return addDoc(collection(db, 'videos', videoId, 'comments'), {
    ...comment,
    createdAt: serverTimestamp()
  });
}

export const getVideoComments = (videoId: string) => {
  return getDocs(collection(db, 'videos', videoId, 'comments'))
    .then(result => result.docs.map(comment => ({
      id: comment.id,
      ...comment.data()
    })));
}

export const getUserById = (userId: string) => {
  return getDoc(doc(db, 'users', userId))
    .then(result => {
      if (!result.exists()) {
        return null;
      }

      return {
        id: result.id,
        ...result.data()
      };
    });
}

export const addUser = (userId: string, user: any) => {
  return setDoc(doc(db, 'users', userId), {
    ...user,
    subscribersCount: 0,
    subscriptionsCount: 0,
    createdAt: serverTimestamp()
  })
    .then(() => ({ ...user }));
}

export const hasLiked = (userId: string, videoId: string) => {
  return getDocs(query(
    collection(db, 'videoLikes'),
    where('userId', '==', userId),
    where('videoId', '==', videoId))
  )
    .then(result => !result.empty);
};

export const hasViewed = (userId: string, videoId: string) => {
  return getDocs(query(
    collection(db, 'videoViews'),
    where('userId', '==', userId),
    where('videoId', '==', videoId))
  )
    .then(result => !result.empty);
};

export const hasDisliked = (userId: string, videoId: string) => {
  return getDocs(query(
    collection(db, 'videoDislikes'),
    where('userId', '==', userId),
    where('videoId', '==', videoId))
  )
    .then(result => !result.empty);
};

export const likeVideo = (video: any, user: any) => {
  return Promise.all([
    hasLiked(user.id, video.id),
    hasDisliked(user.id, video.id)
  ])
    .then(likes => {
      if (likes[0]) {
        return getDocs(query(
          collection(db, 'videoLikes'),
          where('userId', '==', user.id),
          where('videoId', '==', video.id))
        )
          .then(result => result.empty ? null : result.docs[0])
          .then(like => {
            if (!like) {
              return false;
            }

            return writeBatch(db)
              .update(doc(db, 'videos', video.id), {
                likesCount: increment(-1),
              })
              .delete(like.ref)
              .commit()
              .then(() => false);
          });
      } else if (likes[1]) {
        return false;
      }

      return writeBatch(db)
        .update(doc(db, 'videos', video.id), {
          likesCount: increment(1),
        })
        .set(doc(db, 'videoLikes', v4()), {
          userId: user.id,
          userName: user.name,
          userImageUrl: user.imageUrl,
          videoId: video.id,
          videoUrl: video.url,
          videoTitle: video.title,
          videoUserId: video.userId,
          videoUserName: video.userName,
          videoUserImageUrl: video.userImageUrl,
          likedAt: serverTimestamp()
        })
        .commit()
        .then(() => true);
    });
}

export const dislikeVideo = (video: any, user: any) => {
  return Promise.all([
    hasLiked(user.id, video.id),
    hasDisliked(user.id, video.id)
  ])
    .then(likes => {
      if (likes[1]) {
        return getDocs(query(
          collection(db, 'videoDislikes'),
          where('userId', '==', user.id),
          where('videoId', '==', video.id))
        )
          .then(result => result.empty ? null : result.docs[0])
          .then(like => {
            if (!like) {
              return false;
            }

            return writeBatch(db)
              .update(doc(db, 'videos', video.id), {
                likesCount: increment(-1),
              })
              .delete(like.ref)
              .commit()
              .then(() => false);
          });
      } else if (likes[0]) {
        return false;
      }

      const userData = { ...user };
      delete userData.id;

      const videoData = { ...user };
      delete videoData.id;

      return writeBatch(db)
        .update(doc(db, 'videos', video.id), {
          dislikesCount: increment(1),
        })
        .set(doc(db, 'videoDislikes', v4()), {
          userId: user.id,
          userName: user.name,
          userImageUrl: user.imageUrl,
          videoId: video.id,
          videoUrl: video.url,
          videoTitle: video.title,
          videoUserId: video.userId,
          videoUserName: video.userName,
          videoUserImageUrl: video.userImageUrl,
          likedAt: serverTimestamp()
        })
        .commit()
        .then(() => true);
    });
}

export const viewVideo = (video: any, user: any) => {
  hasViewed(user.id, video.id)
    .then(hasViewed => {
      if (hasViewed) {
        return updateDoc(doc(db, 'videos', video.id), {
          viewsCount: increment(1),
        });
      }

      return writeBatch(db)
        .update(doc(db, 'videos', video.id), {
          viewsCount: increment(1),
        })
        .set(doc(db, 'videoViews', v4()), {
          userId: user.id,
          userName: user.name,
          userImageUrl: user.imageUrl,
          videoId: video.id,
          videoUrl: video.url,
          videoTitle: video.title,
          videoUserId: video.userId,
          videoUserName: video.userName,
          videoUserImageUrl: video.userImageUrl,
          viewedAt: serverTimestamp()
        })
        .commit();
    });
}

export const subscribe = (subscriber: any, subscribed: any) => {
  return hasSubscribed(subscribed.id, subscriber.id)
    .then(hasSubscribed => {
      if (hasSubscribed) {
        return false;
      }

      return writeBatch(db)
        .update(doc(db, 'users', subscribed.id), {
          subscribersCount: increment(1),
        })
        .update(doc(db, 'users', subscriber.id), {
          subscriptionsCount: increment(1),
        })
        .set(doc(db, 'subscriptions', v4()), {
          subscriberId: subscriber.id,
          subscriberName: subscriber.name,
          subscriberImageUrl: subscriber.imageUrl,
          subscribedId: subscribed.id,
          subscribedName: subscribed.name,
          subscribedImageUrl: subscribed.imageUrl,
          subscribedAt: serverTimestamp()
        })
        .commit()
        .then(() => true);
    });
}

export const unsubscribe = (subscriberId: string, subscribedId: string) => {
  return hasSubscribed(subscribedId, subscriberId)
    .then(hasSubscribed => {
      if (!hasSubscribed) {
        return false;
      }

      return getDocs(query(
        collection(db, 'subscriptions'),
        where('subscriberId', '==', subscriberId),
        where('subscribedId', '==', subscribedId))
      )
        .then(result => result.empty ? null : result.docs[0])
        .then(subscription => {
          if (!subscription) {
            return false;
          }

          return writeBatch(db)
            .update(doc(db, 'users', subscribedId), {
              subscribersCount: increment(-1),
            })
            .update(doc(db, 'users', subscriberId), {
              subscriptionsCount: increment(-1),
            })
            .delete(subscription.ref)
            .commit()
            .then(() => true);
        });
    })
}

export const hasSubscribed = (subscribedToUserId: string, subscriberUserId: string) => {
  return getDocs(query(
    collection(db, 'subscriptions'),
    where('subscriberId', '==', subscriberUserId),
    where('subscribedId', '==', subscribedToUserId))
  )
    .then(result => !result.empty);
};

export const getSubscribers = (userId: string) => {
  return getDocs(collection(db, 'users', userId, 'subscribers'))
    .then(result => result.docs.map(comment => ({
      id: comment.id,
      ...comment.data()
    })));
}

export const getVideos = () => {
  return getDocs(query(collection(db, 'videos'), orderBy('createdAt')))
    .then(result => result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
}

export const getUserVideos = (userId: string) => {
  return getDocs(query(
    collection(db, 'videos'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'))
  )
    .then(result => result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
}

export const getUserLikedVideos = (userId: string) => {
  return getDocs(query(
    collection(db, 'likedVideos'),
    where('userId', '==', userId),
    orderBy('likedAt', 'desc'))
  )
    .then(result => result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
}

export const getUserWatchedVideos = (userId: string) => {
  return getDocs(query(
    collection(db, 'videoViews'),
    where('userId', '==', userId),
    orderBy('viewedAt', 'desc'))
  )
    .then(result => result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
}

export const getUserRecentSubscribers = (userId: string) => {
  return getDocs(query(
    collection(db, 'subscriptions'),
    where('subscribedId', '==', userId),
    orderBy('subscribedAt', 'desc'),
    limit(10))
  )
    .then(result => result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
}

export const getUserRecentSubscriptions = (userId: string) => {
  return getDocs(query(
    collection(db, 'subscriptions'),
    where('subscriberId', '==', userId),
    orderBy('subscribedAt', 'desc'),
    limit(10))
  )
    .then(result => result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
}

export const getUserSubscribers = (userId: string) => {
  return getDocs(query(
    collection(db, 'subscriptions'),
    where('subscribedId', '==', userId),
    orderBy('subscribedAt', 'desc')
  ))
    .then(result => result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
}

export const getUserSubscriptions = (userId: string) => {
  return getDocs(query(
    collection(db, 'subscriptions'),
    where('subscriberId', '==', userId),
    orderBy('subscribedAt', 'desc')
  ))
    .then(result => result.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })));
}

export const addNotification = (userId: string, notification: any) => {
  return addDoc(collection(db, 'notifications'), {
    ...notification,
    userId,
    seen: false,
    createdAt: serverTimestamp()
  });
}

export const seeNotification = (notificationId: string) => {
  return updateDoc(doc(db, 'notifications', notificationId), {
    seen: true
  });
}
