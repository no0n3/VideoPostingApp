import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { addComment, addNotification, } from "../../api/service";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import CommentsListing from "./CommentsListing";

export function Comments({ video }: any) {
  const { isLogged, currentUser } = useSelector(({ user: { isLogged, currentUser } }: any) => ({ isLogged, currentUser }));
  const [comment, setComment] = useState<string>('');

  const onPostComment = () => {
    addComment(video.id, {
      text: comment,
      userId: currentUser.id,
      userName: currentUser.name,
      userImageUrl: currentUser.imageUrl
    })
      .then(() => {
        setComment('');

        addNotification(video.userId, {
          fromUser: {
            id: currentUser.id,
            name: currentUser.name,
            imageUrl: currentUser.imageUrl,
          },
          type: 'COMMENT_VIDEO',
          videoId: video.id
        });
      });
  };

  return (
    <div>
      {isLogged && (<div style={{
        width: '100%',
        display: 'flex',
        margin: '10px 0',
        alignItems: 'flex-end'
      }}>
        <TextField
          label="Your comment..."
          multiline
          maxRows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ flex: 1 }}
        />
        <SendOutlinedIcon onClick={() => onPostComment()}></SendOutlinedIcon>
      </div>)}
      {!isLogged && (<div>You must be logged to post comments.</div>)}
      <CommentsListing video={video}></CommentsListing>
    </div>
  );
}

export const MemoizedComments = React.memo(Comments);
