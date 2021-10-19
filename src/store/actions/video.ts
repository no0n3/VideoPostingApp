export const TYPE_LIKE_VIDEO = 'like_video';
export const TYPE_FETCH_CURRENT_VIDEO = 'fetch_current_video';
export const TYPE_FETCHED_CURRENT_VIDEO = 'fetched_current_video';
export const TYPE_FETCH_VIDEOS = 'fetch_videos';
export const TYPE_FETCHED_VIDEOS = 'fetched_videos';
export const TYPE_SET_VIDEO_LIKED = 'set_video_liked';
export const TYPE_SET_VIDEO_DISLIKED = 'set_video_disliked';

export function likeCurrentVideo() {
  return { type: TYPE_LIKE_VIDEO, payload: {} };
}

export function fetchCurrentVideo() {
  return {
    type: TYPE_FETCH_CURRENT_VIDEO,
    payload: {}
  };
}

export function fetchVideo() {
  return {
    type: TYPE_FETCH_CURRENT_VIDEO,
    payload: {}
  };
}

export function fetchedCurrentVideo(currentVideo: any) {
  return {
    type: TYPE_FETCHED_CURRENT_VIDEO,
    payload: {
      currentVideo
    }
  };
}

export function fetchVideos() {
  return {
    type: TYPE_FETCH_VIDEOS,
    payload: {}
  };
}

export function fetchedVideos(videos: any[]) {
  return {
    type: TYPE_FETCHED_VIDEOS,
    payload: {
      videos
    }
  };
}

export function setCurrentVideoLiked(liked: boolean) {
  return {
    type: TYPE_SET_VIDEO_LIKED,
    payload: { liked }
  }
}

export function setCurrentVideoDisliked(disliked: boolean) {
  return {
    type: TYPE_SET_VIDEO_DISLIKED,
    payload: { disliked }
  }
}
