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
      "& .MuiIcon-root, & .MuiListItemIcon-root": {
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
const SubMenu = ({ sidebarStatus, data: { title, icon } }) => {
  // Get styles
  const classes = useStyles();

  return (
    <Tooltip title={!sidebarStatus ? title : ""} arrow placement="right">
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
    </Tooltip>
  );
};

/**
 * Menu Component
 * */
const Menu = ({ sidebarStatus, data: { title, icon, subNav } }) => {
  // Get styles
  const classes = useStyles();

  // React states to open & close sub menu
  const [open, setopen] = useState(false);

  return (
    <div className={classes.link}>
      {(sidebarStatus || !subNav) && (
        <>
          <Divider />
          <Tooltip title={!sidebarStatus ? title : ""} placement="right">
            <ListItem
              button
              className={open ? "menuOpen" : ""}
              onClick={() => subNav && setopen(!open)}
            >
              {icon && (
                <ListItemIcon>
                  <Icon>{icon}</Icon>
                </ListItemIcon>
              )}
              <ListItemText>
                <Typography noWrap variant="subtitle1">
                  {title}
                </Typography>
              </ListItemText>
              {subNav && <Icon>{open ? "expand_less" : "expand_more"}</Icon>}
            </ListItem>
          </Tooltip>
        </>
      )}
      {open && (
        <div className="subMenu">
          {subNav &&
            subNav.map((data, index) => (
              <SubMenu sidebarStatus={sidebarStatus} data={data} key={index} />
            ))}
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
          <Menu
            sidebarStatus={(open && !xs) || (!open && xs)}
            data={data}
            key={index}
          />
        ))}
      </List>
      <Divider />
      <Button
        className={`${classes.sidebarBtn} ${classes.toggleSidebar}`}
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
