export const TYPE_FETCHING_COMMENTS = 'fetching_comments';
export const TYPE_COMMENTS_LOADED = 'comments_loaded';

export function fetchComments() {
  return {
    type: TYPE_FETCHING_COMMENTS,
    payload: {}
  };
}

export function commentsLoaded(comments: any) {
  return {
    type: TYPE_COMMENTS_LOADED,
    payload: { comments }
  };
}
