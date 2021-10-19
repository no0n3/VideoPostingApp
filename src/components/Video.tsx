import { doc, getDoc } from "@firebase/firestore";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { db } from "../api/firebase";
import { addNotification, dislikeVideo, hasDisliked, hasLiked, likeVideo, viewVideo } from "../api/service";
import { fetchCurrentVideo, fetchedCurrentVideo, setCurrentVideoDisliked, setCurrentVideoLiked } from "../store/actions/video";
import { MemoizedComments } from "./Comments/Comments";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import { Avatar, Typography } from "@mui/material";

export default function Video() {
  const params: any = useParams();
  const dispatch = useDispatch();
  const video = useSelector(({ video }: any) => video.currentVideo);
  const loadingCurrentVideo = useSelector(({ video }: any) => video.loadingCurrentVideo ?? true);
  const { isLogged, currentUser } = useSelector(({ user: { isLogged, currentUser } }: any) => ({ isLogged, currentUser }));
  const history = useHistory();
  const ref = useRef(null);

  useEffect(() => {
    dispatch(fetchCurrentVideo());
    getDoc(doc(db, 'videos', params.id))
      .then(result => {
        dispatch(fetchedCurrentVideo({
          id: result.id,
          ...result.data()
        }));
      })
      .then(() => checkIfLikedVideo())
      .catch(console.error);
  }, []);

  const checkIfLikedVideo = () => {
    if (!currentUser || !video) {
      return;
    }

    hasLiked(currentUser.id, video.id)
      .then((hasLiked) => {
        dispatch(setCurrentVideoLiked(hasLiked));
      });
    hasDisliked(currentUser.id, video.id)
      .then((hasLiked) => {
        dispatch(setCurrentVideoDisliked(hasLiked));
      });
  }

  useEffect(() => {
    checkIfLikedVideo();
  }, [currentUser]);

  useEffect(() => {
    if (!video || !currentUser) {
      return;
    }

    viewVideo(video, currentUser);
  }, [video, currentUser]);

  if (loadingCurrentVideo) {
    return <div>Loading...</div>;
  }

  const onLike = () => {
    if (!isLogged) {
      return;
    }

    likeVideo(video, currentUser)
      .then(hasLiked => {
        dispatch(setCurrentVideoLiked(hasLiked));

        addNotification(video.userId, {
          fromUser: {
            id: currentUser.id,
            name: currentUser.name,
            imageUrl: currentUser.imageUrl,
          },
          type: 'LIKED_VIDEO',
          videoId: video.id
        });
      })
      .catch(console.error);
  };

  const onDislike = () => {
    if (!isLogged) {
      return;
    }

    dislikeVideo(video, currentUser)
      .then(hasLiked => {
        dispatch(setCurrentVideoDisliked(hasLiked));
      })
      .catch(console.error);
  };

  return (
    <div style={{ maxWidth: 800, margin: 'auto', marginTop: 15 }}>
      <video ref={ref} src={video.url} controls autoPlay style={{ width: '100%', display: 'block' }}></video>
      <Typography variant="h4" component="div">{video.title}</Typography>
      <Typography variant="body2" gutterBottom component="div">{video.description}</Typography>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <div onClick={() => history.push(`/user/${video.userId}`)} style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <Avatar src={video.userImageUrl} alt={video.userName} style={{ width: 40 }} />
          <Typography variant="subtitle1" component="div" style={{ marginLeft: 5 }}>{video.userName}</Typography>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <div style={{ marginRight: 10 }}>
            <span>{video.viewsCount}</span> <span>views</span>
          </div>
          <div style={{
            marginRight: 10,
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: 5 }}>{video.likesCount}</span> <ThumbUpOutlinedIcon onClick={() => onLike()} style={{ color: video.liked ? 'red' : '' }}>like</ThumbUpOutlinedIcon>
          </div>
          <div style={{
            marginRight: 10,
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: 5 }}>{video.dislikesCount}</span> <ThumbDownOutlinedIcon onClick={() => onDislike()} style={{ color: video.disliked ? 'red' : '' }}>dislike</ThumbDownOutlinedIcon>
          </div>
        </div>
      </div>
      <MemoizedComments video={video}></MemoizedComments>
    </div>
  );
}
