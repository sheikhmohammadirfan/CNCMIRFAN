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
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { getSidebarData } from "../../assets/data/SidebarData"; 
import { logout, getUser } from "../../Service/UserFactory";
import SidebarItem from "./SidebarItem";
import logo from "../../assets/img/logo.png";
import colorShader from "../Utils/ColorShader";


/** CSS Class Generator */
const useStyles = makeStyles((theme) => {
  const iconPadding = (theme.sidebarSmall - 24) / 2;
  return {
    sidebar: {
      width: theme.sidebarLarge,
      [theme.breakpoints.down("xs")]: { position: "fixed" },
      height: "100vh",
      background: theme.palette.primary.dark,
      color: theme.textOnPrimary,
      position: "sticky",
      top: 0,
      zIndex: 10,
      display: "flex",
      flexDirection: "column",
      boxShadow: theme.shadows[1],
      paddingTop: theme.spacing(1),
      transition: "width 0.2s linear",
      "&.close": {
        width: theme.sidebarSmall,
        "& .MuiList-root": { paddingLeft: "0 !important" },
      },
    },
    navContainer: {
      overflowY: "auto",
      overflowX: "hidden",
      flexGrow: 1,
    },
    logoBtn: {
      padding: `${theme.spacing(1)}px ${iconPadding}px`,
      height: 50,
      "& .MuiListItemText-root, & .MuiListItemText-primary": {
        height: "100%",
        display: "flex",
        alignItems: "center",
      },
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
      "& .MuiIcon-root": { fontSize: 12 },
    },
  };
});


/**
 * Sidebar Component
 */
export default function Sidebar({ isOpen, toggleSidebar }) {
  const classes = useStyles();
  const xs = useMediaQuery((theme) => theme.breakpoints.down("xs"));

  // Responsive toggle
  useEffect(() => toggleSidebar(!xs), [xs]);

  return (
    <Box
      className={`${classes.sidebar} ${isOpen ? "" : "close"}`}
      data-test="sidebar-container"
    >
      <List
        className={`${classes.navContainer} ${!isOpen ? "close-sidebar" : ""}`}
        disablePadding
      >
        {/* {changed SidebarData to getSidebarData inorder to match the sidebarData.js export function-irfan}  */}
        {getSidebarData().map(({ title, icon, subMenu, collapseMenu, ...rest }, index) => (
          <SidebarItem
            key={index}
            sidebarOpen={isOpen}
            xs={xs}
            text={
              <Typography noWrap variant="subtitle1">
                {title}
              </Typography>
            }
            icon={icon ? <Icon>{icon}</Icon> : null}
            subMenu={subMenu}
            collapseMenu={collapseMenu}
            {...rest}
            data-test="sidebar-menu-item"
          />
        ))}
      </List>

      <Divider />

      <SidebarItem
        sidebarOpen={isOpen}
        xs={xs}
        text={
          <Typography noWrap variant="subtitle1">
            Settings
          </Typography>
        }
        icon={<Icon>settings</Icon>}
        component={Link}
        to="/profile"
        data-test="sidebar-profile"
      />

      <SidebarItem
        sidebarOpen={isOpen}
        xs={xs}
        text={
          <Typography noWrap variant="subtitle1">
            Log out
          </Typography>
        }
        icon={<Icon>logout</Icon>}
        onClick={logout}
        data-test="sidebar-logout"
      />

      <IconButton
        size="small"
        className={classes.toggleBtn}
        onClick={() => toggleSidebar(!isOpen)}
        data-test="sidebar-toggler"
      >
        <Icon>{isOpen ? "arrow_back" : "menu"}</Icon>
      </IconButton>
    </Box>
  );
}
