import { Avatar, Button, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Switch, Route, useRouteMatch } from "react-router-dom";
import { addNotification, getUserById, hasSubscribed, subscribe, unsubscribe } from "../../api/service";
import {
  fetchSubscriptionStatus,
  setUser,
  setUserLoading,
  subscriptionStatusLoaded,
  userSubscribed,
  userSubscribing
} from "../../store/actions/user";
import UploadedVideos from "./UploadedVideos";
import UserSubscribers from "./UserSubscribers";
import UserSubscriptions from "./UserSubscriptions";
import WatchedVideos from "./WatchedVideos";
import LikedVideos from "./LikedVideos";
import UserVideoTabs from "./UserVideoTabs";

export default function User() {
  const params: any = useParams();
  const dispatch = useDispatch();
  const user = useSelector(({ user }: any) => user.user);
  const loadingUser = useSelector(({ user }: any) => user.loadingUser ?? true);
  const subscribing = useSelector(({ user }: any) => user.subscribing ?? false);
  const currentUser = useSelector(({ user }: any) => user.currentUser);

  const loadingSubscriptionStatus = useSelector(({ user }: any) => user.loadingSubscriptionStatus ?? true);
  const subscribed = useSelector(({ user }: any) => user?.user?.subscribed ?? false);
  let { path } = useRouteMatch();

  const userId = params.id;

  useEffect(() => {
    dispatch(setUserLoading());
    getUserById(userId)
      .then(user => {
        dispatch(setUser(user));
      })
      .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (!currentUser || userId == currentUser.id) {
      return;
    }

    dispatch(fetchSubscriptionStatus());
    hasSubscribed(userId, currentUser.id)
      .then(hasSubed => {
        dispatch(subscriptionStatusLoaded(hasSubed));
      });
  }, [userId, currentUser]);

  if (loadingUser) {
    return <div>Loading...</div>;
  }
  console.log('user', user.id)
  if (!loadingUser && !user?.id) {
    return <div>User does not exist.</div>;
  }

  const onSubscribe = () => {
    dispatch(userSubscribing());
    subscribe(currentUser, user)
      .then((success) => {
        dispatch(userSubscribed());
        if (!success) {
          return;
        }

        dispatch(subscriptionStatusLoaded(true));

        addNotification(userId, {
          fromUser: {
            id: currentUser.id,
            name: currentUser.name,
            imageUrl: currentUser.imageUrl,
          },
          type: 'SUBSCRIBED'
        });
      })
      .catch(console.error);
  };

  const onUnsubscribe = () => {
    dispatch(userSubscribing());
    unsubscribe(currentUser.id, userId)
      .then(success => {
        dispatch(userSubscribed());
        if (!success) {
          return;
        }

        dispatch(subscriptionStatusLoaded(false));
      })
      .catch(console.error);
  };

  return (
    <div>
      <div style={{
        maxWidth: 500,
        marginTop: 15
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: 10
        }}>
          <Avatar sx={{ width: 60, height: 60 }} src={user.imageUrl} alt={user.name} />
          <div style={{ marginLeft: 5 }}>
            <Typography variant="subtitle1" component="div">{user.name}</Typography>
            <span>{user.subscribersCount} subscribers</span>
          </div>
        </div>
        {!loadingSubscriptionStatus && (<div style={{ padding: 5 }}>
          {subscribed && <Button variant="outlined" onClick={() => onUnsubscribe()} disabled={subscribing}>unsubscribe</Button>}
          {!subscribed && <Button variant="outlined" onClick={() => onSubscribe()} disabled={subscribing}>subscribe</Button>}
        </div>)}
      </div>
      <div style={{
        display: 'flex'
      }}>
        <div style={{ flex: 1 }}>
          <UserVideoTabs></UserVideoTabs>
          <div style={{ marginTop: 10 }}>
            <Switch>
              <Route path={`${path}/videos`}>
                <UploadedVideos userId={userId}></UploadedVideos>
              </Route>
              <Route path={`${path}/watched`}>
                <WatchedVideos userId={userId}></WatchedVideos>
              </Route>
              <Route path={`${path}/liked`}>
                <LikedVideos userId={userId}></LikedVideos>
              </Route>
              <Route path={`${path}`}>
                <UploadedVideos userId={userId}></UploadedVideos>
              </Route>
            </Switch>
          </div>
        </div>
        <div style={{
          width: 200,
          marginTop: 50,
          marginLeft: 15
        }}>
          <Typography variant="h5" component="div" gutterBottom>Subscribers</Typography>
          <UserSubscribers userId={userId}></UserSubscribers>
          <Typography variant="h5" component="div" gutterBottom style={{ marginTop: 20 }}>Subscriptions</Typography>
          <UserSubscriptions userId={userId}></UserSubscriptions>
        </div>
      </div>
    </div>
  );
}
