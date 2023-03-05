import {
  ClickAwayListener,
  Hidden,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";

/** Custom ListItem to act as Sidebar Item */
const Item = withStyles((theme) => {
  // Icon horizontal padding
  const iconPadding = (theme.sidebarSmall - 24) / 2;
  return {
    root: {
      // Decrease left & right padding so that, it look center on minimize
      paddingLeft: iconPadding,
      paddingRight: iconPadding,
      // Set Icon color
      "& > .MuiListItemIcon-root": {
        color: theme.textOnPrimary,
        minWidth: 3 * iconPadding,
      },
      // Reduce height of list btn
      "& > .MuiListItemText-root": { margin: 0 },
      // Set padding for menu open/close btn
      "& > .MuiIconButton-root": { padding: theme.spacing(1 / 4) },
      // Hover effect on list btn
      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
      // Active state of current clicked btn
      "&.active": { backgroundColor: "rgba(255, 255, 255, 0.2)" },
      // Style for submenu
      "& + .MuiList-root": {
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        maxHeight: "100vh",
        transition: "all 0.3s linear",
        // paddingLeft: theme.spacing(1),
        "& > .MuiListItem-root": {
          paddingTop: theme.spacing(1 / 4),
          paddingBottom: theme.spacing(1 / 4),
        },
        // Hide on closing menu
        "&.close": { maxHeight: 0 },
      },
    },
  };
})(ListItem);

/** Apply custom styles to Mui Tooltip */
const CustomTooltip = withStyles((theme) => ({
  tooltip: {
    marginLeft: 5,
    marginRight: 5,
    padding: 0,
    background: theme.palette.primary.dark,
    boxShadow: theme.shadows[4],
    // Update spacing for sidebar item in tooltip
    "& .MuiListItem-root": {
      paddingTop: theme.spacing(1 / 4),
      paddingBottom: theme.spacing(1 / 4),
    },
    // Set padding around text in tooltip
    "& .MuiTypography-caption": {
      padding: `${theme.spacing(1 / 8)}px ${theme.spacing(1)}px`,
    },
  },
}))(Tooltip);

/** Tooltip text typography compoent */
const TooltipText = (text) => <Typography variant="caption">{text}</Typography>;

/** Submenu to show list of subMenu */
function SubMenu({ padding = true, menu = true, subMenu, sidebarOpen, xs }) {
  return (
    <List disablePadding={!padding} className={`${menu ? "" : "close"}`}>
      {subMenu.map(({ title, icon, subMenu, ...rest }, index) => (
        <SidebarItem
          key={index}
          sidebarOpen={sidebarOpen}
          xs={xs}
          text={
            <Typography noWrap variant="subtitle1">
              {title}
            </Typography>
          }
          icon={<Icon>{icon}</Icon>}
          subMenu={subMenu}
          {...rest}
        />
      ))}
    </List>
  );
}

/** Generate Item with no subMenu */
function WithSubMenu({ sidebarOpen, xs, text, icon, subMenu, tooltipProps, ...rest }) {
  // React hook, to manage dropdown open/close
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    xs && setMenuOpen((m) => !m);
  };

  // Close submenu whenever width change
  useEffect(() => setMenuOpen(false), [xs]);

  // React hook, to manage tooltip submenu
  const [tooltip, setTooltip] = useState(false);
  const openTooltip = () => setTooltip(true);
  const closeTooltip = () => setTooltip(false);

  return (
    <>
      <ClickAwayListener onClickAway={closeTooltip}>
        <CustomTooltip
          title={
            sidebarOpen ? (
              !xs ? (
                <SubMenu sidebarOpen={sidebarOpen} xs={xs} subMenu={subMenu} />
              ) : (
                ""
              )
            ) : (
              TooltipText(text.props.children)
            )
          }
          placement="right"
          interactive={sidebarOpen}
          open={tooltip}
          onOpen={openTooltip}
          onClose={closeTooltip}
          {...tooltipProps}
        >
          <Item className={menuOpen ? "active" : ""} button {...rest}>
            <ListItemIcon data-test="sidebaritem-with-icon">{icon}</ListItemIcon>
            <ListItemText data-test="sidebaritem-with-text">{text}</ListItemText>
            <IconButton color="inherit" onClick={toggleMenu}>
              <Icon>{xs ? (menuOpen ? "arrow_drop_up" : "arrow_drop_down") : "arrow_right"}</Icon>
            </IconButton>
          </Item>
        </CustomTooltip>
      </ClickAwayListener>

      <Hidden smUp>
        <SubMenu sidebarOpen={sidebarOpen} xs={xs} padding={false} menu={menuOpen} subMenu={subMenu} />
      </Hidden>
    </>
  );
}

/** Generate Item with no subMenu */
function WithoutSubMenu({ sidebarOpen, text, icon, ...rest }) {
  return (
    <CustomTooltip title={sidebarOpen ? "" : TooltipText(text.props.children)} placement="right">
      <Item button {...rest}>
        <ListItemIcon color="inherit" data-test="sidebaritem-without-icon">
          {icon}
        </ListItemIcon>
        <ListItemText data-test="sidebaritem-without-text">{text}</ListItemText>
      </Item>
    </CustomTooltip>
  );
}

/** Generate Sidebar Item */
export default function SidebarItem({ sidebarOpen, xs, text, icon, subMenu, ...rest }) {
  return subMenu ? (
    <WithSubMenu sidebarOpen={sidebarOpen} xs={xs} text={text} icon={icon} subMenu={subMenu} {...rest} />
  ) : (
    <WithoutSubMenu sidebarOpen={sidebarOpen} text={text} icon={icon} {...rest} />
  );
}
