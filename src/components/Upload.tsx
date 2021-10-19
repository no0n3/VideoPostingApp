import { useEffect, useRef, useState } from "react";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from "../api/firebase";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { addVideo } from "../api/service";
import { Button, TextField } from "@mui/material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';

export default function Upload() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [errors, setErros] = useState<{ [key: string]: boolean }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const currentUser = useSelector(({ user }: any) => user.currentUser);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const ref = useRef(null);
  const history = useHistory();

  const upl = () => {
    const fileInp: any = ref?.current;
    if (!fileInp) {
      return;
    }

    const file = fileInp.files[0];

    const sr = storageRef(storage, file.name);

    setUploading(true);
    setProgress(0);

    const uploadTask = uploadBytesResumable(sr, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        setProgress(progress);
      },
      (error) => {
        console.error(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoUrl(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  const isValid = () => {
    return title && description && videoUrl;
  };

  const onSave = () => {
    if (!isValid()) {
      return;
    }

    addVideo({
      title,
      description,
      url: videoUrl,
      userId: currentUser.id,
      userName: currentUser.name,
      userImageUrl: currentUser.imageUrl
    }, currentUser.id)
      .then(result => {
        history.push(`/watch/${result.id}`);
      })
      .catch(console.error);
  };

  return (
    <div style={{
      width: 500,
      margin: 'auto',
      marginTop: 15
    }}>
      <div>
        <div style={{
          height: 300,
          backgroundColor: '#e0e0e0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            width: 200,
            height: 200,
            backgroundColor: '#b5b5b5',
            borderRadius: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer'
          }} onClick={() => (ref?.current as any).click()}
          >
            {uploading && <div style={{ color: '#fff' }}>{progress}%</div>}
            {!uploading && progress == 100 && <div style={{ color: '#fff' }}>Done!</div>}
            {!uploading && progress < 100 && <ControlPointIcon style={{ fontSize: 60, color: '#fff' }}></ControlPointIcon>}
          </div>
        </div>
        <input
          ref={ref}
          type="file"
          accept="video/mp4,video/x-m4v,video/*"
          onChange={() => upl()}
          style={{ display: 'none' }}
        />
      </div>
      <div style={{
        marginTop: 10
      }}>
        <TextField
          label="Title"
          variant="outlined"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErros({
              ...errors,
              title: !e.target.value.trim()
            });
          }}
          onFocus={() => setTouched({ ...touched, title: true })}
          style={{ width: '100%' }}
          helperText={(touched['title'] && errors['title']) ? 'Title is required.' : ''}
          error={touched['title'] && errors['title']}
        />
      </div>
      <div style={{
        marginTop: 10
      }}>
        <TextField
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setErros({
              ...errors,
              description: !e.target.value.trim()
            });
          }}
          onFocus={() => setTouched({ ...touched, description: true })}
          style={{ width: '100%' }}
          helperText={(touched['description'] && errors['description']) ? 'Description is required.' : ''}
          error={touched['description'] && errors['description']}
        />
      </div>
      <div style={{
        marginTop: 10
      }}>
        <Button onClick={() => onSave()} disabled={!isValid()}>Save</Button>
      </div>
    </div>
  );
}
