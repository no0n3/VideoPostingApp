import { Avatar, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getUserRecentSubscriptions } from "../../api/service";
import { fetchUserSubscriptions, userSubscriptionsLoaded } from "../../store/actions/user";

export default function UserSubscriptions({ userId }: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  const loadingSubscriptions = useSelector(({ user }: any) => user.loadingSubscriptions ?? true);
  const subscriptions = useSelector(({ user }: any) => user.subscriptions ?? []);

  useEffect(() => {
    dispatch(fetchUserSubscriptions());
    getUserRecentSubscriptions(userId)
      .then(subscriptions => {
        dispatch(userSubscriptionsLoaded(subscriptions));
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {loadingSubscriptions && <div>Loading...</div>}
      {!loadingSubscriptions && subscriptions.length === 0 && <div>No subscriptions found.</div>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {!loadingSubscriptions && subscriptions.map((subscriber: any) => (
          <ListItem key={subscriber.subscribedId} onClick={() => history.push(`/user/${subscriber.subscribedId}`)}>
            <ListItemIcon>
            <Avatar src={subscriber.subscribedImageUrl} alt={subscriber.subscribedName} />
            </ListItemIcon>
            <ListItemText primary={subscriber.subscribedName} />
          </ListItem>
        ))}
      </div>
    </div>
  );
}
