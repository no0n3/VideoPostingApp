import { Avatar, Divider, Typography } from "@mui/material";

export default function CommentItem({ comment }: any) {
  return (<>
    <div style={{
      padding: '10px 5px',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center'
      }}>
        <Avatar src={comment.userImageUrl} alt={comment.userName} />
        <Typography variant="subtitle1" component="div" style={{ marginLeft: 5 }}>{comment.userName}</Typography>
      </div>
      <div style={{ padding: 5 }}>{comment.text}</div>
    </div>
    <Divider></Divider>
  </>);
}
