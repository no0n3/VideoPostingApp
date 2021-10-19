import { TYPE_COMMENTS_LOADED, TYPE_FETCHING_COMMENTS } from "../actions/comment";
import { ReduxAction } from "../types";

const initialState = {};

export default function commentReducer(state: any = initialState, action: ReduxAction) {
  switch (action.type) {
    case TYPE_FETCHING_COMMENTS:
      return {
        ...state,
        comment: {
          loadingComments: true
        }
      };
    case TYPE_COMMENTS_LOADED:
      return {
        ...state,
        comments: action.payload.comments,
        loadingComments: false
      };
  }

  return state;
}
