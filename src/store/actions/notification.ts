export const TYPE_NOTIFICATIONS_LOADED = 'notifications_loaded';
export const TYPE_NOTIFICATION_SEEN = 'notification_seen';

export function notificationsLoaded(notifications: any[]) {
  return {
    type: TYPE_NOTIFICATIONS_LOADED,
    payload: { notifications }
  };
}

export function notificationSeen(seenNotificationId: string) {
  return {
    type: TYPE_NOTIFICATION_SEEN,
    payload: { seenNotificationId }
  };
}
