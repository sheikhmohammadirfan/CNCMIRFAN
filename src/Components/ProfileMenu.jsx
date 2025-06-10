import { Avatar, Box, ClickAwayListener, Divider, Grow, IconButton, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper, Stack, Typography } from '@mui/material';
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { getUser, logout } from '../Service/UserFactory';
import { Icon, makeStyles } from '@material-ui/core';
import { SettingsOutlined } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const useStyles = makeStyles((theme) => ({

}));

const ProfileMenu = () => {

  const [open, setOpen] = useState(null);
  const anchorRef = useRef(null)

  const history = useHistory();

  const user = useMemo(() => getUser(), []);

  const stringToColor = useCallback((string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }, [])

  const stringAvatar = useCallback((first_name, last_name, twoLetter, sx) => {
    const children = twoLetter ? `${first_name[0]}${last_name[0]}` : first_name[0]
    return {
      sx: {
        bgcolor: stringToColor(`${first_name} ${last_name}`),
        ...sx
      },
      children: children,
    };
  }, [stringToColor])

  return (
    <Box>
      <Box
        ref={anchorRef}
        onClick={() => setOpen(true)}
      >
        <Avatar {...stringAvatar(user?.first_name, user?.last_name, false, { width: 24, height: 24 })} />
      </Box>
      <Popper
        anchorEl={anchorRef.current}
        open={open}
        sx={{
          width: 300,
          zIndex: 1,
          '& .MuiPaper-root': {
            boxShadow: '0 0 10px 0 #c5c5c5',
            borderRadius: 1,
          },
          '& .MuiMenuItem-root': {
            color: '#606060',
            paddingLeft: 2
          },
          '& .MuiListItemIcon-root': {
            color: '#8d8d8d',
          },
        }}
        transition
        disablePortal
        placement='bottom-end'
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: 'right top' }}
          >
            <Paper>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Box>
                  <Box sx={{ display: 'flex', columnGap: 2, alignItems: 'center', px: 2, py: 1 }}>
                    <Avatar {...stringAvatar(user?.first_name, user?.last_name, true, { width: 35, height: 35 })} />
                    <Stack>
                      <Typography sx={{ fontWeight: 'semibold' }}>{`${user?.first_name} ${user?.last_name}`}</Typography>
                    </Stack>
                  </Box>
                  <Divider />
                  <Box sx={{ px: 2, my: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>Email:</Typography>
                      <Typography sx={{ color: '#888' }}>{user?.email}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', columnGap: 1 }}>
                      <Typography sx={{ fontWeight: 'bold' }}>Role:</Typography>
                      <Typography sx={{ color: '#888' }}>{user?.roles?.[0]?.name}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box>
                    <MenuList>
                      <MenuItem onClick={() => { history.push('/profile'); setOpen(false) }}>
                        <ListItemIcon>
                          <Icon>settings</Icon>
                        </ListItemIcon>
                        <ListItemText sx={{ fontSize: '0.9rem' }}>Settings</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={() => { setOpen(false); logout() }}>
                        <ListItemIcon>
                          <Icon>logout</Icon>
                        </ListItemIcon>
                        <ListItemText sx={{ fontSize: '0.9rem' }}>Logout</ListItemText>
                      </MenuItem>
                    </MenuList>
                  </Box>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box>
  )
}

export default ProfileMenu