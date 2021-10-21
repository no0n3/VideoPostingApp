import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserVideos } from "../../api/service";
import { fetchUserVideos, userVideosLoaded } from "../../store/actions/user";
import VideoItem from "../Videos/VideoItem";

export default function UploadedVideos({ userId }: any) {
  const dispatch = useDispatch();

  const loadingVideos = useSelector(({ user }: any) => user.loadingVideos ?? true);
  const videos = useSelector(({ user }: any) => user?.user?.videos ?? []);

  const user = useSelector(({ user }: any) => user.user);

  useEffect(() => {
    dispatch(fetchUserVideos());
    getUserVideos(userId)
      .then(videos => {
        dispatch(userVideosLoaded(videos));
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {loadingVideos && <div>Loading...</div>}
      {!loadingVideos && videos.length === 0 && <div>No videos found.</div>}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {!loadingVideos && videos.map((video: any) => (
          <VideoItem key={video.id} video={{ id: video.id, url: video.url, title: video.title }}></VideoItem>
        ))}
      </div>
    </div>
  );
}
