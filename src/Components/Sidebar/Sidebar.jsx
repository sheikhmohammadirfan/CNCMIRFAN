import {
  Box,
  Icon,
  List,
  makeStyles,
  Typography,
  useMediaQuery,
  IconButton,
  Divider,
} from "@material-ui/core";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SidebarData } from "../../assets/SidebarData";
import MenuPopup from "./MenuPopup";
import ProfileBtn from "./ProfileBtn";
import SidebarItem from "./SidebarItem";

/**
 * Styles generator
 * */
const useStyles = makeStyles((theme) => {
  const iconPadding = (theme.sidebarSmall - 24) / 2;

  return {
    // Sidebar root
    sidebar: {
      flex: "1",
      width: theme.sidebarLarge,
      [theme.breakpoints.down("xs")]: {
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
    closeSidebar: { width: theme.sidebarSmall },

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

    // Style for sidebar width toggler
    toggleBtn: {
      maxWidth: "max-content",
      minWidth: "max-content",
      backgroundColor: "white",
      transition: "all 0.4s linear",
      "&:hover": { backgroundColor: "white" },
      position: "absolute",
      right: -9,
      top: 5,
      "& .MuiIcon-root": { fontSize: 12 },
    },
  };
});

/**
 * Menu Component
 * */
const Menu = ({ sidebarStatus = true, data: { title, icon, subNav } }) => {
  // Get styles
  const classes = useStyles();

  return (
    <MenuPopup
      popup={
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
      component={
        <SidebarItem
          text={
            <Typography noWrap variant="subtitle1">
              {title}
            </Typography>
          }
          icon={<Icon>{icon}</Icon>}
          subMenu={subNav}
        />
      }
    />
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

  // Change sidebar status on window width
  useEffect(() => toggleSidebar(!xs), [xs]);

  return (
    <Box
      className={`${classes.sidebar} ${
        !isSidebarOpen ? classes.closeSidebar : ""
      }`}
    >
      <SidebarItem
        className={classes.logoBtn}
        text={
          <Typography noWrap variant="h5">
            LOGO
          </Typography>
        }
        icon={<AcUnitIcon />}
      />
      <Divider />

      <List
        className={`${classes.navContainer} ${
          !isSidebarOpen ? classes.navClose : ""
        }`}
      >
        {SidebarData.map((data, index) => (
          <div className={classes.link} key={index}>
            <Menu sidebarStatus={isSidebarOpen} data={data} />
          </div>
        ))}
      </List>

      <Divider />
      <ProfileBtn sidebarStatus={isSidebarOpen} />

      <IconButton
        size="small"
        className={classes.toggleBtn}
        onClick={() => toggleSidebar(!isSidebarOpen)}
      >
        <Icon>{isSidebarOpen ? "arrow_back" : "menu"}</Icon>
      </IconButton>
    </Box>
  );
}

export default Sidebar;
