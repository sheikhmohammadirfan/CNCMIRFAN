import { Avatar, Typography } from "@material-ui/core";
import React from "react";
import { logout } from "../../Service/UserFactory";
import { useHistory } from "react-router-dom";
import SidebarItem from "./SidebarItem";

/** Generate profile btn with Icon and username
    and on popup show user Setting & logout btn */
function ProfileBtn({ sidebarStatus, xs }) {
  const history = useHistory();

  function navigate() {
    history.push("/profile");
    // window.location.href = "/profile";
  }

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
        {
          title: "Settings",
          icon: "settings",
          onClick: navigate,
        },
        { title: "Log out", icon: "logout", onClick: logout },
      ]}
      sidebarOpen={sidebarStatus}
      xs={xs}
      tooltipProps={{ placement: "right-end" }}
    />
  );
}

export default ProfileBtn;
