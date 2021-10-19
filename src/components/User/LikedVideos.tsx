import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserLikedVideos } from "../../api/service";
import { fetchUserVideos, userVideosLoaded } from "../../store/actions/user";
import VideoItem from "../Videos/VideoItem";

export default function LikedVideos({ userId }: any) {
  const dispatch = useDispatch();

  const loadingVideos = useSelector(({ user }: any) => user.loadingVideos ?? true);
  const videos = useSelector(({ user }: any) => user?.user?.videos ?? []);

  useEffect(() => {
    dispatch(fetchUserVideos());
    getUserLikedVideos(userId)
      .then(videos => videos.map((video: any) => ({
        id: video.videoId,
        url: video.videoUrl,
        userId: video.videoUserId,
        userName: video.videoUserName,
        userImageUrl: video.videoUserImageUrl,
      })))
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
          <VideoItem key={video.id} video={video}></VideoItem>
        ))}
      </div>
    </div>
  );
}
