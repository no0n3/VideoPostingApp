import { Avatar, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import React, { useCallback, useMemo } from 'react';
import { seeNotification } from '../../api/service';
import { notificationSeen } from '../../store/actions/notification';

export default function NotificationsListing() {
  const notifications = useSelector(({ notification }: any) => notification.notifications ?? []);
  const history = useHistory();
  const dispatch = useDispatch();

  const notifMessage = useCallback((notif: any) => {
    switch (notif.type) {
      case 'LIKED_VIDEO':
        return (<>
          liked <Link to={'/videos/' + notif.videoId}>your video</Link>.
        </>);
      case 'COMMENTE_VIDEO':
        return (<>
          commented on <Link to={'/videos/' + notif.videoId}>your video</Link>.
        </>);
      case 'SUBSCRIBED':
        return (<>
          has subscribed to you.
        </>);
      default:
        return null;
    }
  }, []);

  const notifs = useMemo(() => {
    return notifications.map((notif: any) => ({
      ...notif,
      message: notifMessage(notif)
    })).filter(({ message }: any) => !!message);
  }, [notifications]);

  if (notifs.length === 0) {
    return <div style={{ padding: 10 }}>No notifications yet.</div>;
  }

  const onNotifClick = (notif: any) => {
    seeNotification(notif.id)
      .then(() => {
        dispatch(notificationSeen(notif.Id));
      });
  };

  return (<>
    {notifs.map((notif: any) => (<React.Fragment key={notif.id}>
      <div
        style={{
          padding: '5px 10px',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: !notif.seen ? '#b5b5b5' : ''
        }}
        onClick={() => onNotifClick(notif)}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          marginRight: 5
        }} onClick={() => history.push(`/user/${notif.fromUser.id}`)}>
          <Avatar src={notif.fromUser.imageUrl} alt={notif.fromUser.name} />
          <span style={{ marginLeft: 5 }}>{notif.fromUser.name}</span>
        </div>
        <div>{notif.message}</div>
      </div>
      <Divider></Divider>
    </React.Fragment>))}
  </>);
}
