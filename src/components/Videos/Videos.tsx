import { collection, getDocs, orderBy, query } from "@firebase/firestore";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { db } from "../../api/firebase";
import { fetchedVideos, fetchVideos } from "../../store/actions/video";
import VideoItem from "./VideoItem";

export default function Videos() {
  const dispatch = useDispatch();
  const history = useHistory();
  const videos: any[] = useSelector(({ video }: any) => video.videos ?? []);
  const loadingVideos: any[] = useSelector(({ video }: any) => video.loadingVideos ?? false);

  useEffect(() => {
    dispatch(fetchVideos());
    getDocs(query(collection(db, 'videos'), orderBy('createdAt')))
      .then(r => {
        dispatch(fetchedVideos(r.docs.map(d => ({ id: d.id, ...d.data() }))));
      })
      .catch(console.error);
  }, []);

  if (loadingVideos) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap'
      }}>
        {videos.length === 0 && <div>No videos found.</div>}
        {videos.map(video => (<VideoItem key={video.id} onClick={() => history.push(`/watch/${video.id}`)} video={video}></VideoItem>))}
      </div>
    </div>
  );
}
