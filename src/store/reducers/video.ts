import {
  TYPE_FETCHED_CURRENT_VIDEO,
  TYPE_FETCHED_VIDEOS,
  TYPE_FETCH_CURRENT_VIDEO,
  TYPE_FETCH_VIDEOS,
  TYPE_SET_VIDEO_DISLIKED,
  TYPE_SET_VIDEO_LIKED,
  TYPE_VIDEO_DELETED
} from "../actions/video";
import { ReduxAction } from "../types";

const initialState = {};

export default function videoReducer(state: any = initialState, action: ReduxAction) {
  switch (action.type) {
    case TYPE_FETCH_CURRENT_VIDEO:
      return {
        ...state,
        loadingCurrentVideo: true
      };
    case TYPE_FETCHED_CURRENT_VIDEO:
      return {
        ...state,
        ...action.payload,
        loadingCurrentVideo: false,
      };
    case TYPE_FETCH_VIDEOS:
      return {
        ...state,
        loadingVideos: true
      };
    case TYPE_FETCHED_VIDEOS:
      return {
        ...state,
        ...action.payload,
        loadingVideos: false,
      };
    case TYPE_SET_VIDEO_LIKED:
      return {
        ...state,
        currentVideo: {
          ...state.currentVideo,
          ...action.payload
        },
      };
    case TYPE_SET_VIDEO_DISLIKED:
      return {
        ...state,
        currentVideo: {
          ...state.currentVideo,
          ...action.payload
        },
      };
    case TYPE_VIDEO_DELETED:
      return {
        ...state,
        videos: (state?.videos ?? []).filter(({ id }: any) => id !== action.payload.videoId)
      };
  }

  return state;
}
