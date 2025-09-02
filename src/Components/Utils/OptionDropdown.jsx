import { Box, ClickAwayListener, Icon, List, Tooltip, Typography, makeStyles } from '@material-ui/core'
import { ListItemButton } from '@mui/material';
import React, { } from 'react'

const useStyle = makeStyles((theme) => ({
  // Tooltip background style
  customTooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid #dadde9",
    marginTop: "8px",
    padding: '8px',
    '& .MuiListItemButton-root': {
      padding: '7px 15px',
      '&:hover': {
        // backgroundColor: 'rgba(68, 119, 206, 0.1)'
      },
      // color: "#4477CE"
    }
  },
}))

const OptionDropdown = ({ open, handleClose, options, placement, children }) => {

  const classes = useStyle();

  return (
    <Tooltip
      placement={placement}
      open={open}
      interactive
      classes={{ tooltip: classes.customTooltip }}
      title={
        <Box>
          <ClickAwayListener onClickAway={handleClose}>
            <List
              disablePadding
              style={{ fontSize: '0.8rem' }}
            >
              {options.map((option, index) => (
                <ListItemButton
                  key={index}
                  disableRipple
                  style={{
                    display: 'flex',
                    columnGap: 5,
                  }}
                  onClick={option.clickHandler}
                >
                  {option.startIcon && (
                    <Icon style={{ fontSize: '1.2rem', color: 'rgba(0, 0, 0, 0.6)' }}>{option.startIcon}</Icon>
                  )}
                  <Typography style={{ fontSize: '0.8rem' }}>{option.text}</Typography>
                </ListItemButton>
              ))}
            </List>
          </ClickAwayListener>
        </Box>
      }
    >
      {children}
    </Tooltip>

  )
}

export default OptionDropdown