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
  Typography,
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
      // Set Icon color
      "& .MuiIcon-root, & .MuiListItemIcon-root": {
        color: theme.textOnPrimary,
      },
      overflowY: "auto",
      overflowX: "hidden",
      position: "sticky",
      top: 0,
      display: "flex",
      flexDirection: "column",
      zIndex: 1,
      boxShadow: theme.shadows[1],
    },

    // Icon side bar, on minimize btn
    closeSidebar: {
      width: theme.sidebarSmall,
      [theme.breakpoints.down("xs")]: { width: theme.sidebarLarge },
    },

    // Sidebar btn to navigate
    link: {
      // Decrease left & right padding so that, it look center on minimize
      "& > .MuiListItem-root": {
        paddingLeft: iconPadding,
        paddingRight: iconPadding,
      },
      // Hover effect on list btn
      "& > .MuiListItem-root:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },

      // Sub menu backgroud style
      "& .subMenu, & .menuOpen": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
      // Add margin bottom to submenu if it is not empty
      "& .subMenu:not(:empty)": { paddingBottom: theme.spacing(1) },
      // Decrease vertical space in sub menu btn
      "& .subMenu": {
        "& .MuiListItem-root": {
          paddingTop: 0,
          paddingBottom: 0,
          "& .MuiListItemText-root": {
            marginTop: theme.spacing(1 / 4),
            marginBottom: theme.spacing(1 / 4),
          },
        },
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
    toggleSidebar: {
      bottom: 0,
      flexGrow: 1,
    },
  };
});

/**
 * Submenu Component
 * */
const SubMenu = ({ data: { title, icon, subNav } }) => {
  // Get styles
  const classes = useStyles();

  return (
    <div className={classes.link}>
      <ListItem button>
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText>
          <Typography noWrap variant="subtitle1">
            {title}
          </Typography>
        </ListItemText>
      </ListItem>
    </div>
  );
};

/**
 * Menu Component
 * */
const Menu = ({ data: { title, icon, subNav } }) => {
  // Get styles
  const classes = useStyles();

  // React states to open & close sub menu
  const [open, setopen] = useState(false);

  return (
    <div className={classes.link}>
      <Divider />
      <ListItem
        button
        className={open && "menuOpen"}
        onClick={() => setopen(!open)}
      >
        <ListItemIcon>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText>
          <Typography noWrap variant="subtitle1">
            {title}
          </Typography>
        </ListItemText>
        {subNav && <Icon>{open ? "expand_less" : "expand_more"}</Icon>}
      </ListItem>
      {open && (
        <div className="subMenu">
          {subNav &&
            subNav.map((data, index) => <SubMenu data={data} key={index} />)}
        </div>
      )}
    </div>
  );
};

/**
 * Main Sidebar Component
 * */
function Sidebar() {
  // Get Styles
  const classes = useStyles();

  // React states to open & close sub menu
  const [open, setopen] = useState(false);

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
          <Menu data={data} key={index} />
        ))}
      </List>
      <Divider />
      <Button
        className={`${classes.sidebarBtn} ${classes.toggleSidebar}`}
        onClick={() => setopen(!open)}
      >
        <Icon>{open ? "arrow_forward" : "arrow_back"}</Icon>
      </Button>
    </Box>
  );
}

export default Sidebar;
