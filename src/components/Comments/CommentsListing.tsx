import { collection, onSnapshot, orderBy, query } from "@firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../api/firebase";
import { commentsLoaded } from "../../store/actions/comment";
import CommentItem from "./CommentItem";

export default function CommentsListing({ video }: any) {
  const dispatch = useDispatch();
  const comments = useSelector(({ comment }: any) => comment.comments ?? []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'videos', video.id, 'comments'), orderBy('createdAt', 'desc')),
      (result) => {
        dispatch(commentsLoaded(result.docs.map(comment => ({
          id: comment.id,
          ...comment.data()
        }))));
      },
    );

    return unsubscribe;
  }, []);

  return (
    <>
      {comments.length === 0 && <div>No comments available.</div>}
      {comments.map((comment: any) => <CommentItem key={comment.id} comment={comment}></CommentItem>)}
    </>
  );
}
