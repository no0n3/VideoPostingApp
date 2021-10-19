import { useMemo, useState } from "react";
import { useHistory, useRouteMatch } from "react-router";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function UserVideoTabs() {
  const { path, url } = useRouteMatch();
  const initialValue = useMemo(() => {
    const a = window.location.pathname.split('/');

    switch (path + '/' + a[a.length - 1]) {
      case '/user/:id/watched':
        return 1;
      case '/user/:id/liked':
        return 2;
      default:
        return 0;
    }
  }, []);
  const [value, setValue] = useState(initialValue);
  const history = useHistory();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    const r = newValue === 0 ? 'videos' :
      newValue === 1 ? 'watched' :
        newValue === 2 ? 'liked' :
          '';

    if (!r) {
      return;
    }

    history.push(`${url}/${r}`);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange}
        indicatorColor="secondary"
        textColor="inherit">
        <Tab label="Uploaded" />
        <Tab label="Watched" />
        <Tab label="Liked" />
      </Tabs>
    </Box>
  );
}
