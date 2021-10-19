export const TYPE_FETCHING_CURRENT_USER = 'fetching_current_user';
export const TYPE_CURRENT_USER_LOADED = 'current_user_loaded';
export const TYPE_FETCHING_USER = 'fetching_user';
export const TYPE_USER_LOADED = 'user_loaded';
export const TYPE_FETCHING_SUBSCRIPTION_STATUS = 'fetching_subscription_status';
export const TYPE_SUBSCRIPTION_STATUS_LOADED = 'subscription_status_loaded';
export const TYPE_FETCHING_USER_VIDEOS = 'fetching_user_videos';
export const TYPE_USER_VIDEOS_LOADED = 'user_video_loaded';
export const TYPE_FETCHING_USER_SUBSCRIBERS = 'fetching_user_subscribers';
export const TYPE_USER_SUBSCRIBERS_LOADED = 'user_subscribers_loaded';
export const TYPE_FETCHING_USER_SUBSCRIPTIONS = 'fetching_user_subscriptions';
export const TYPE_USER_SUBSCRIPTIONS_LOADED = 'user_subscriptions_loaded';
export const TYPE_USER_SUBSCRIBING = 'user_subscribing';
export const TYPE_USER_SUBSCRIBED = 'user_subscribed';

export function fetchCurrent() {
  return {
    type: TYPE_FETCHING_CURRENT_USER,
    payload: {
      loadingCurrentUser: true
    }
  };
}

export function setCurrent(currentUser: any) {
  return {
    type: TYPE_CURRENT_USER_LOADED,
    payload: {
      loadingCurrentUser: false,
      currentUser
    }
  };
}

export function setUserLoading() {
  return {
    type: TYPE_FETCHING_USER,
    payload: {}
  };
}

export function setUser(user: any) {
  return {
    type: TYPE_USER_LOADED,
    payload: {
      user
    }
  };
}

export function fetchSubscriptionStatus() {
  return {
    type: TYPE_FETCHING_SUBSCRIPTION_STATUS,
    payload: {}
  };
}

export function subscriptionStatusLoaded(subscribed: boolean) {
  return {
    type: TYPE_SUBSCRIPTION_STATUS_LOADED,
    payload: { subscribed }
  };
}

export function fetchUserVideos() {
  return {
    type: TYPE_FETCHING_USER_VIDEOS,
    payload: {}
  };
}

export function userVideosLoaded(videos: any[]) {
  return {
    type: TYPE_USER_VIDEOS_LOADED,
    payload: { videos }
  };
}

export function fetchUserSubscribers() {
  return {
    type: TYPE_FETCHING_USER_SUBSCRIBERS,
    payload: {}
  };
}

export function userSubscribersLoaded(subscribers: any[]) {
  return {
    type: TYPE_USER_SUBSCRIBERS_LOADED,
    payload: { subscribers }
  };
}

export function fetchUserSubscriptions() {
  return {
    type: TYPE_FETCHING_USER_SUBSCRIPTIONS,
    payload: {}
  };
}

export function userSubscriptionsLoaded(subscriptions: any[]) {
  return {
    type: TYPE_USER_SUBSCRIPTIONS_LOADED,
    payload: { subscriptions }
  };
}

export function userSubscribing() {
  return {
    type: TYPE_USER_SUBSCRIBING,
    payload: {}
  };
}

export function userSubscribed() {
  return {
    type: TYPE_USER_SUBSCRIBED,
    payload: {}
  };
}

