import React, { useState } from "react";
import { ClickAwayListener, Tooltip, withStyles } from "@material-ui/core";

/**
 * Style Generator
 */
const customStyles = (theme) => {
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
};

/**
 * Apply styles to Tooltip
 */
const CustomTooltip = withStyles(customStyles)(Tooltip);

/**
 * Custom Tooltip
 */
const MenuPopup = ({ popup, component, ...rest }) => {
  // Tooltip toggler, React hook
  const [showTooltip, toggleTooltip] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => toggleTooltip(false)}>
      <CustomTooltip
        title={popup}
        placement="right"
        interactive
        onClose={() => toggleTooltip(false)}
        onOpen={() => toggleTooltip(true)}
        open={showTooltip}
        leaveTouchDelay={60000}
        {...rest}
      >
        <div onClick={() => toggleTooltip(true)}>{component}</div>
      </CustomTooltip>
    </ClickAwayListener>
  );
};

export default MenuPopup;
