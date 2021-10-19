import { Avatar, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

export default function VideoItem({ video }: any) {
  const history = useHistory();
  const ref = useRef(null);
  const ref2 = useRef(null);

  const onHover = () => {
    if (!ref.current) {
      return;
    }

    const videoInp: any = ref.current;

    videoInp.play();
  };

  const onLeave = () => {
    if (!ref.current) {
      return;
    }

    const videoInp: any = ref.current;

    videoInp.pause();
  };

  useEffect(() => {
    if (ref2.current && ref2.current) {
      (ref.current as any).style.height = `${(ref2.current as any).offsetWidth * .6}px`;
    }
  }, [ref, ref2]);

  return (
    <div ref={ref2} onClick={() => history.push(`/watch/${video.id}`)}
      style={{
        width: '25%',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={() => onHover()}
      onMouseLeave={() => onLeave()}
    >
      <div style={{ padding: 2 }}>
        <div style={{
          backgroundColor: '#000'
        }}>
          <video ref={ref} src={video.url} style={{ width: '100%', display: 'block' }} muted={true}></video>
        </div>
        <Typography variant="h6" component="div">{video.title}</Typography>

        <div onClick={() => history.push(`/user/${video.userId}`)} style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          <Avatar src={video.userImageUrl} alt={video.userName} style={{ width: 40 }} />
          <Typography variant="subtitle1" component="div" style={{ marginLeft: 5 }}>{video.userName}</Typography>
        </div>
        {video.viewsCount !== undefined && <div style={{ marginTop: 5 }}>{video.viewsCount} views</div>}
      </div>
    </div>
  );
}
