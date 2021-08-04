import {
  Box,
  Button,
  Divider,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip,
  Typography,
  useMediaQuery,
  withStyles,
  ClickAwayListener,
} from "@material-ui/core";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import React from "react";
import { useState } from "react";
import { SidebarData } from "../assets/SidebarData";

/**
 * Styles generator
 * */
const useStyles = makeStyles((theme) => {
  const iconPadding = (theme.sidebarSmall - 24) / 2;

  return {
    // Sidebar root
    sidebar: {
      width: theme.sidebarLarge,
      [theme.breakpoints.down("xs")]: {
        width: theme.sidebarSmall,
        position: "fixed",
        // Hide scroll bar on reduce width
        "&::-webkit-scrollbar": { display: "none" },
      },
      height: "100vh",
      background: theme.palette.primary.light,
      color: theme.textOnPrimary,
      // Set Icon color
      "& .MuiButton-root .MuiIcon-root, & .MuiListItemIcon-root": {
        color: theme.textOnPrimary,
        minWidth: 3 * iconPadding,
      },
      overflowY: "auto",
      overflowX: "hidden",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
      boxShadow: theme.shadows[1],
      transition: "width 0.2s linear",
      // Scrollbar Container
      "&::-webkit-scrollbar": { width: 10 },
      // Scrollbar track
      "&::-webkit-scrollbar-track": { background: theme.palette.primary.light },
      // Scrollbar mover
      "&::-webkit-scrollbar-thumb": {
        border: `2px solid ${theme.palette.primary.light}`,
        background: theme.palette.primary.main,
        borderRadius: 10,
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: theme.palette.primary.dark,
      },
    },

    // Icon side bar, on minimize btn
    closeSidebar: {
      width: theme.sidebarSmall,
      // Hide scroll bar on reduce width
      "&::-webkit-scrollbar": { display: "none" },
      [theme.breakpoints.down("xs")]: {
        width: theme.sidebarLarge,
        // Display scroll bar again on complete width
        "&::-webkit-scrollbar": { display: "block" },
      },
    },

    // Sidebar btn to navigate
    link: {
      // Decrease left & right padding so that, it look center on minimize
      "& .MuiListItem-root": {
        paddingLeft: iconPadding,
        paddingRight: iconPadding,
      },
      // Hover effect on list btn
      "& .MuiListItem-root:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
      // Reduce height of list btn
      "& .MuiListItemText-root": {
        margin: 0,
      },
    },

    // Logo & toggle btns in sidebar
    sidebarBtn: {
      width: "100%",
      minWidth: "max-content",
      minHeight: theme.sidebarSmall,
      position: "sticky",
      padding: 0,
      zIndex: 10,
      backgroundColor: theme.palette.primary.light,
      "&:hover": { backgroundColor: theme.palette.primary.light },
    },

    // Stick logo btn to top
    logoBtn: {
      top: 0,
      padding: `${theme.spacing(1)}px ${iconPadding}px`,
    },

    // Stick toggle btn to bottom & make it grow to available height
    togglerBtn: {
      bottom: 0,
      flexGrow: 1,
    },
  };
});

/**
 * Customize Tooltip to make sidebar popup
 * */
const PopupTooltip = withStyles((theme) => {
  const iconPadding = (theme.sidebarSmall - 24) / 2;
  return {
    tooltip: {
      marginLeft: 5,
      marginRight: 5,
      padding: 0,
      background: theme.palette.primary.light,
      boxShadow: theme.shadows[4],
      // Set Icon color
      "& .MuiListItemIcon-root": {
        minWidth: 3 * iconPadding,
        color: theme.textOnPrimary,
      },
      // Decrease left & right padding so that, it look center on minimize
      "& .MuiListItem-root": {
        paddingLeft: iconPadding,
        paddingRight: iconPadding,
      },
      // Hover effect on list btn
      "& .MuiListItem-root:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
      // Reduce height of list btn
      "& .MuiListItemText-root": { margin: 0 },
      // Make tooltip text small
      "& .MuiTypography-body2": { padding: theme.spacing(1 / 2) },
    },
  };
})(Tooltip);

/**
 * Menu Component
 * */
const Menu = ({ sidebarStatus = true, data: { title, icon, subNav } }) => {
  // Get styles
  const classes = useStyles();

  const [showTooltip, toggleTooltip] = useState(false);

  return (
    <PopupTooltip
      title={
        subNav ? (
          <List className={classes.link}>
            {subNav.map((val, index) => (
              <Menu data={val} key={index} />
            ))}
          </List>
        ) : !sidebarStatus ? (
          <Typography noWrap variant="body2">
            {title}
          </Typography>
        ) : (
          ""
        )
      }
      placement="right"
      interactive
      onClose={() => toggleTooltip(false)}
      onOpen={() => toggleTooltip(true)}
      open={showTooltip}
    >
      <ListItem button>
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText>
          <Typography noWrap variant="subtitle1">
            {title}
          </Typography>
        </ListItemText>
        {subNav && <Icon>arrow_right</Icon>}
      </ListItem>
    </PopupTooltip>
  );
};

/**
 * Main Sidebar Component
 * */
function Sidebar() {
  // Get Styles
  const classes = useStyles();

  // React states to open & close sub menu
  const [open, setopen] = useState(true);

  // React state to change on theme breakpoint
  const xs = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  return (
    <Box className={`${classes.sidebar} ${!open && classes.closeSidebar}`}>
      <ListItem button className={`${classes.sidebarBtn} ${classes.logoBtn}`}>
        <ListItemIcon>
          <AcUnitIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography noWrap variant="h5">
            LOGO
          </Typography>
        </ListItemText>
      </ListItem>
      <List style={{ padding: 0 }}>
        {SidebarData.map((data, index) => (
          <div className={classes.link} key={index}>
            <Divider />
            <Menu sidebarStatus={(open && !xs) || (!open && xs)} data={data} />
          </div>
        ))}
      </List>
      <Divider />
      <Button
        className={`${classes.sidebarBtn} ${classes.togglerBtn}`}
        onClick={() => setopen(!open)}
      >
        <Icon>
          {(open && !xs) || (!open && xs) ? "arrow_back" : "arrow_forward"}
        </Icon>
      </Button>
    </Box>
  );
}

export default Sidebar;
