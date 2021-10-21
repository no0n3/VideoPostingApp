export const TYPE_FETCHING_USER_SUBSCRIPTIONS = 'fetching_user_subscriptions';
export const TYPE_USER_SUBSCRIPTIONS_LOADED = 'user_subscriptions_loaded';
export const TYPE_FETCHING_SUBSCRIPTIONS_VIDEOS = 'fetching_subscriptions_videos';
export const TYPE_SUBSCRIPTIONS_VIDEOS_LOADED = 'subscriptions_videos_loaded';

export function fetchSubscriptionVideos() {
  return {
    type: TYPE_FETCHING_SUBSCRIPTIONS_VIDEOS,
    payload: { }
  };
}

export function subscriptionVideosLoaded(videos: any) {
  return {
    type: TYPE_SUBSCRIPTIONS_VIDEOS_LOADED,
    payload: {
      videos
    }
  };
}
