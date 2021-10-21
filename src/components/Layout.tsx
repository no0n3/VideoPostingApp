import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import Header from "./Header";
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { auth } from '../api/firebase';
import { SubscriptionsOutlined } from '@mui/icons-material';
import UserSubscriptions from './User/UserSubscriptions';
import { Divider, Typography } from '@mui/material';

function LeftDrawer({ open, setOpen }: { open: boolean, setOpen: (b: boolean) => void }) {
  const isLogged = useSelector(({ user }: any) => user.isLogged);
  const currentUser = useSelector(({ user }: any) => user.currentUser);
  const history = useHistory();

  const toggleDrawer = (open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpen(open);
    };

  return (
    <div>
      <Drawer
        anchor={'left'}
        open={open}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {(isLogged ? [
              {
                text: 'Home',
                icon: <HomeOutlinedIcon />,
                onClick: () => history.push('/')
              },
              {
                text: 'Watched',
                icon: <HistoryOutlinedIcon />,
                onClick: () => history.push(`/user/${currentUser.id}/watched`)
              },
              {
                text: 'Liked',
                icon: <FavoriteBorderOutlinedIcon />,
                onClick: () => history.push(`/user/${currentUser.id}/liked`)
              },
              {
                text: 'Subscriptions',
                icon: <SubscriptionsOutlined />,
                onClick: () => history.push('/subscriptions')
              },
              {
                text: 'Logout',
                icon: <LogoutOutlinedIcon />,
                onClick: () => auth.signOut()
              }
            ] : [
              {
                text: 'Home',
                icon: <HomeOutlinedIcon />,
                onClick: () => history.push('/')
              },
              {
                text: 'Login',
                icon: <LoginOutlinedIcon />,
                onClick: () => history.push('/login')
              },
              {
                text: 'Sign up',
                icon: <GroupAddOutlinedIcon />,
                onClick: () => history.push('/sign-up')
              }
            ]).map(item => (
              <ListItem button key={item.text} onClick={item.onClick}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider></Divider>
          <ListItem>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => history.push('/')}>
              Subscriptions
            </Typography>
          </ListItem>
          <UserSubscriptions userId={currentUser?.id}></UserSubscriptions>
        </Box>
      </Drawer>
    </div>
  );
}

export default function Layout(props: any) {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);

  return (
    <div>
      <Header onMenuClicked={() => setDrawerOpen(!drawerOpen)}></Header>
      <LeftDrawer open={drawerOpen} setOpen={setDrawerOpen}></LeftDrawer>
      {props.children}
    </div>
  );
}
