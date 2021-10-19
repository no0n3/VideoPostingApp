import { Avatar } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { getUserRecentSubscribers } from "../../api/service";
import { fetchUserSubscribers, userSubscribersLoaded } from "../../store/actions/user";

export default function UserSubscribers({ userId }: any) {
  const dispatch = useDispatch();
  const history = useHistory();

  const loadingSubscribers = useSelector(({ user }: any) => user.loadingSubscribers ?? true);
  const subscribers = useSelector(({ user }: any) => user?.user?.subscribers ?? []);

  useEffect(() => {
    dispatch(fetchUserSubscribers());
    getUserRecentSubscribers(userId)
      .then(subscribers => {
        dispatch(userSubscribersLoaded(subscribers));
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {loadingSubscribers && <div>Loading...</div>}
      {!loadingSubscribers && subscribers.length === 0 && <div>No subscribers found.</div>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {!loadingSubscribers && subscribers.map((subscriber: any) => (
          <div key={subscriber.subscriberId} onClick={() => history.push(`/user/${subscriber.subscriberId}`)} style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}>
            <Avatar src={subscriber.subscriberImageUrl} alt={subscriber.subscriberName} />
            <span style={{ marginLeft: 5 }}>{subscriber.subscriberName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
