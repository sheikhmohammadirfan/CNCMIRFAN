import { Avatar, Typography } from "@material-ui/core";
import React from "react";
import { logout } from "../../Service/UserFactory";
import SidebarItem from "./SidebarItem";

/** Generate profile btn with Icon and username
    and on popup show user Setting & logout btn */
function ProfileBtn({ sidebarStatus, xs }) {
  return (
    <SidebarItem
      text={
        <Typography noWrap variant="h6" align="center">
          Anonymous
        </Typography>
      }
      icon={
        <Avatar
          alt="Anonymous"
          src="https://source.unsplash.com/featured/?person"
          style={{ marginLeft: sidebarStatus ? "0" : "-8px" }}
        />
      }
      subMenu={[
        { title: "Settings", icon: "settings" },
        { title: "Log out", icon: "logout", onClick: logout },
      ]}
      sidebarOpen={sidebarStatus}
      xs={xs}
      tooltipProps={{ placement: "right-end" }}
    />
  );
}

export default ProfileBtn;
