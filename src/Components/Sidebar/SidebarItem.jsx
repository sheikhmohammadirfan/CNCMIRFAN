import { Icon, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";

/** Generate Sidebar Item */
function SidebarItem({ text, icon, subMenu, ...rest }) {
  return (
    <ListItem button {...rest}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
      {subMenu && <Icon>arrow_right</Icon>}
    </ListItem>
  );
}

export default SidebarItem;
