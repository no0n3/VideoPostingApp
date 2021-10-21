import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { auth, db } from "../api/firebase";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from "@mui/material";
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import { useEffect } from "react";
import { collection, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { notificationsLoaded } from "../store/actions/notification";
import NotificationsPopover from "./Notifications/NotificationsPopover";

export default function Header({ onMenuClicked }: { onMenuClicked: () => any }) {
  const isLogged = useSelector(({ user }: any) => user.isLogged);
  const currentUser = useSelector(({ user }: any) => user.currentUser);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const unsubscribe = onSnapshot(
      query(
        collection(db, 'notifications'),
        where('userId', '==', currentUser.id),
        orderBy('createdAt', 'desc')
      ),
      (result) => {
        dispatch(notificationsLoaded(result.docs.map(notif => ({
          id: notif.id,
          ...notif.data()
        }))));
      },
    );

    return unsubscribe;
  }, [currentUser]);

  const onLogout = () => {
    auth.signOut();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ color: '#fff' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onMenuClicked}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => history.push('/')}>
            VVideo
          </Typography>
          {isLogged && (<>
            <VideoCallOutlinedIcon style={{ fontSize: 30, marginRight: 10 }} onClick={() => history.push('/upload')}></VideoCallOutlinedIcon>
            <NotificationsPopover></NotificationsPopover>
            <div onClick={() => history.push(`/user/${currentUser.id}`)} style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={currentUser.imageUrl} alt={currentUser.name} />
              <span style={{ marginLeft: 5 }}>{currentUser.name}</span>
            </div>
            <Button color="inherit" onClick={() => onLogout()}>Logout</Button>
          </>)}
          {!isLogged && (<>
            <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
          </>)}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
