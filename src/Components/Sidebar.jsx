import {
  Box,
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
  Avatar,
  IconButton,
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
      },
      height: "100vh",
      background: theme.palette.primary.light,
      color: theme.textOnPrimary,
      position: "sticky",
      top: 0,
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
      boxShadow: theme.shadows[1],
      transition: "width 0.2s linear",
    },

    // Icon side bar, on minimize btn
    closeSidebar: {
      width: theme.sidebarSmall,
      [theme.breakpoints.down("xs")]: {
        width: theme.sidebarLarge,
      },
    },

    // Nav list container
    navContainer: {
      padding: 0,
      overflowY: "auto",
      overflowX: "hidden",
      flexGrow: 1,
      // Hide scroll bar on reduce width
      [theme.breakpoints.down("xs")]: {
        "&::-webkit-scrollbar": { display: "none" },
      },
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

    // Nav container on small width
    navClose: {
      // Hide scroll bar on reduce width
      "&::-webkit-scrollbar": { display: "none" },
      [theme.breakpoints.down("xs")]: {
        // Display scroll bar again on complete width
        "&::-webkit-scrollbar": { display: "block" },
      },
    },

    // Sidebar btn to navigate
    link: {
      // Set Icon color
      "& .MuiListItemIcon-root": {
        color: theme.textOnPrimary,
        minWidth: 3 * iconPadding,
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
      "& .MuiListItemText-root": {
        margin: 0,
      },
    },

    // Style for logobtn in sidebar
    logoBtn: {
      padding: `${theme.spacing(1)}px ${iconPadding}px`,
      minHeight: 50,
      "& .MuiListItemIcon-root": { color: theme.textOnPrimary },
    },

    // style for Account profile btn
    accBtn: {
      justifyContent: "center",
      "& .MuiListItemIcon-root": { minWidth: "max-content" },
    },

    toggleBtn: {
      maxWidth: "max-content",
      minWidth: "max-content",
      backgroundColor: "white",
      transition: "all 0.4s linear",
      "&:hover": { backgroundColor: "white" },
      position: "absolute",
      right: -9,
      top: 5,
      "& .MuiIcon-root": {
        fontSize: 12,
      },
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
    <ClickAwayListener onClickAway={() => toggleTooltip(false)}>
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
        leaveTouchDelay={60000}
      >
        <ListItem button onClick={() => toggleTooltip(true)}>
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
    </ClickAwayListener>
  );
};

/**
 * Main Sidebar Component
 * */
function Sidebar() {
  // Get Styles
  const classes = useStyles();

  // React states to isSidebarOpen & close sub menu
  const [isSidebarOpen, toggleSidebar] = useState(true);

  // React state to change on theme breakpoint
  const xs = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  return (
    <Box
      className={`${classes.sidebar} ${
        !isSidebarOpen ? classes.closeSidebar : ""
      }`}
    >
      <ListItem button className={classes.logoBtn}>
        <ListItemIcon>
          <AcUnitIcon />
        </ListItemIcon>
        <ListItemText>
          <Typography noWrap variant="h5">
            LOGO
          </Typography>
        </ListItemText>
      </ListItem>

      <List
        className={`${classes.navContainer} ${
          !isSidebarOpen ? classes.navClose : ""
        }`}
      >
        {SidebarData.map((data, index) => (
          <div className={classes.link} key={index}>
            {index > 0}
            <Menu
              sidebarStatus={(isSidebarOpen && !xs) || (!isSidebarOpen && xs)}
              data={data}
            />
          </div>
        ))}
      </List>

      <ListItem button className={classes.accBtn}>
        <ListItemIcon>
          <Avatar
            alt="A"
            src="https://images.unsplash.com/photo-1625428508242-07166dc06bba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTYyNzQ4MzIxNA&ixlib=rb-1.2.1&q=80&w=1080"
          />
        </ListItemIcon>
        <ListItemText>
          <Typography noWrap variant="h5" align="center">
            Accounts
          </Typography>
        </ListItemText>
      </ListItem>

      <IconButton
        size="small"
        className={classes.toggleBtn}
        onClick={() => toggleSidebar(!isSidebarOpen)}
      >
        <Icon>
          {(isSidebarOpen && !xs) || (!isSidebarOpen && xs)
            ? "arrow_back"
            : "menu"}
        </Icon>
      </IconButton>
    </Box>
  );
}

export default Sidebar;
