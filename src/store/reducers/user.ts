import {
  TYPE_CURRENT_USER_LOADED,
  TYPE_FETCHING_CURRENT_USER,
  TYPE_FETCHING_SUBSCRIPTION_STATUS,
  TYPE_FETCHING_USER,
  TYPE_FETCHING_USER_SUBSCRIBERS,
  TYPE_FETCHING_USER_SUBSCRIPTIONS,
  TYPE_FETCHING_USER_VIDEOS,
  TYPE_SUBSCRIPTION_STATUS_LOADED,
  TYPE_USER_LOADED, TYPE_USER_SUBSCRIBED,
  TYPE_USER_SUBSCRIBERS_LOADED,
  TYPE_USER_SUBSCRIBING,
  TYPE_USER_SUBSCRIPTIONS_LOADED,
  TYPE_USER_VIDEOS_LOADED
} from "../actions/user";
import { ReduxAction } from "../types";

const initialState = {};

export default function userReducer(state: any = initialState, action: ReduxAction) {
  switch (action.type) {
    case TYPE_FETCHING_CURRENT_USER:
      return {
        ...state,
        ...action.payload
      };
    case TYPE_CURRENT_USER_LOADED:
      return {
        ...state,
        ...action.payload,
        isLogged: !!action.payload.currentUser
      };
    case TYPE_FETCHING_USER:
      return {
        ...state,
        loadingUser: true
      };
    case TYPE_USER_LOADED:
      return {
        ...state,
        user: action.payload.user,
        loadingUser: false
      };
    case TYPE_FETCHING_SUBSCRIPTION_STATUS:
      return {
        ...state,
        loadingSubscriptionStatus: true
      };
    case TYPE_SUBSCRIPTION_STATUS_LOADED:
      return {
        ...state,
        user: {
          ...(state.user || {}),
          ...action.payload,
        },
        loadingSubscriptionStatus: false
      };
    case TYPE_FETCHING_USER_VIDEOS:
      return {
        ...state,
        loadingVideos: true
      };
    case TYPE_USER_VIDEOS_LOADED:
      return {
        ...state,
        user: {
          ...(state.user || {}),
          ...action.payload,
        },
        loadingVideos: false
      };
    case TYPE_FETCHING_USER_SUBSCRIBERS:
      return {
        ...state,
        loadingSubscribers: true
      };
    case TYPE_FETCHING_USER_SUBSCRIPTIONS:
      return {
        ...state,
        loadingSubscriptions: true
      };
    case TYPE_USER_SUBSCRIBERS_LOADED:
      return {
        ...state,
        user: {
          ...(state.user || {}),
          ...action.payload,
        },
        loadingSubscribers: false
      };
    case TYPE_USER_SUBSCRIPTIONS_LOADED:
      return {
        ...state,
        ...action.payload,
        loadingSubscriptions: false
      };
    case TYPE_USER_SUBSCRIBING:
      return {
        ...state,
        subscribing: true
      };
    case TYPE_USER_SUBSCRIBED:
      return {
        ...state,
        subscribing: false
      };
  }

  return state;
}
