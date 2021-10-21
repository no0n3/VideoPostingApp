import { Divider, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getChunkedResult, getSubscriptionVideos, getUserSubscriptions } from "../api/service";
import VideoItem from "../components/Videos/VideoItem";
import { fetchSubscriptionVideos, subscriptionVideosLoaded } from "../store/actions/subscriptions";
import { fetchUserSubscriptions, userSubscriptionsLoaded } from "../store/actions/user";

export default function SubscriptionsPage() {
  const currentUser = useSelector(({ user }: any) => user.currentUser);
  const videos = useSelector(({ subscriptions }: any) => subscriptions.videos ?? []);
  const subscriptions = useSelector(({ user }: any) => user.subscriptions ?? []);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(fetchUserSubscriptions());
    getUserSubscriptions(currentUser.id)
      .then(users => {
        dispatch(userSubscriptionsLoaded(users));
      });
  }, []);

  useEffect(() => {
    if (subscriptions.length === 0) {
      return;
    }

    dispatch(fetchSubscriptionVideos());
    getChunkedResult(
      subscriptions.map(({ subscribedId }: any) => subscribedId),
      getSubscriptionVideos
    )
      .then((videos: any) => {
        const result: { [key: string]: any[] } = {};

        for (const video of videos) {
          if (!result[video.userId]) {
            result[video.userId] = [];
          }

          result[video.userId].push({
            id: video.id,
            url: video.url,
            title: video.title
          });
        }

        return result;
      })
      .then(videos => {
        dispatch(subscriptionVideosLoaded(videos));
      });
  }, [subscriptions]);

  return (
    <div style={{
      padding: 10
    }}>
      <Typography variant="h3" component="div" sx={{ textAlign: 'center' }}>
        Subscriptions
      </Typography>
      {subscriptions.map((subscription: any) => (
        <div>
          <Typography
            variant="h4"
            component="div"
            style={{ cursor: 'pointer', marginTop: 10, marginBottom: 5 }}
            onClick={() => history.push(`/user/${subscription.subscribedId}`)}
          >
            {subscription.subscribedName}
          </Typography>
          <Divider></Divider>
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            marginTop: 10
          }}>
            {(videos[subscription.subscribedId] ?? []).map((video: any) => (
              <VideoItem key={video.id} video={video}></VideoItem>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
