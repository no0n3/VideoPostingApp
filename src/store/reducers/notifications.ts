import { TYPE_NOTIFICATIONS_LOADED, TYPE_NOTIFICATION_SEEN } from "../actions/notification";
import { ReduxAction } from "../types";

const initialState = {};

export default function notificationReducer(state: any = initialState, action: ReduxAction) {
  switch (action.type) {
    case TYPE_NOTIFICATIONS_LOADED:
      return {
        ...state,
        ...action.payload
      };
    case TYPE_NOTIFICATION_SEEN:
      return {
        ...state,
        notifications: state.notifications.map((notif: any) => {
          if (notif.id === action.payload.seenNotificationId) {
            return {
              ...notif,
              seen: true
            };
          }

          return { ...notif };
        })
      };
  }

  return state;
}
