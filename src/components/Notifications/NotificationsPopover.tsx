import Popover from '@mui/material/Popover';
import { Badge } from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useSelector } from 'react-redux';
import { MouseEvent, useState } from 'react';
import NotificationsListing from './NotificationsListing';

export default function NotificationsPopover() {
  const notifications = useSelector(({ notification }: any) => notification.notifications ?? []);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Badge onClick={handleClick} color="secondary" variant="dot" invisible={notifications.every(({ seen }: any) => seen)} style={{ fontSize: 30, marginRight: 10 }}>
        <NotificationsOutlinedIcon></NotificationsOutlinedIcon>
      </Badge>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <NotificationsListing></NotificationsListing>
      </Popover>
    </div>
  );
}
