import { TYPE_FETCHING_SUBSCRIPTIONS_VIDEOS, TYPE_SUBSCRIPTIONS_VIDEOS_LOADED } from "../actions/subscriptions";
import { ReduxAction } from "../types";

const initialState = {};

export default function subscriptionsReducer(state: any = initialState, action: ReduxAction) {
  switch (action.type) {
    case TYPE_FETCHING_SUBSCRIPTIONS_VIDEOS:
      return {
        ...state,
        loadingSubscriptionVideos: true
      };
    case TYPE_SUBSCRIPTIONS_VIDEOS_LOADED:
      return {
        ...state,
        videos: action.payload.videos,
        loadingSubscriptionVideos: false,
      };
  }

  return state;
}
