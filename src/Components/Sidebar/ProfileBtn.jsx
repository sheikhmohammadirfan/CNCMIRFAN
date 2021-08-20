import { Avatar, Icon, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { logout } from "../../Service/UserFactory";
import MenuPopup from "./MenuPopup";
import SidebarItem from "./SidebarItem";

/**
 * Style Generator
 */
const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    "& .MuiListItemIcon-root": { minWidth: "max-content" },
  },
}));

/**
 * Profile Component
 */
function ProfileBtn({ sidebarStatus }) {
  const classes = useStyles();

  const history = useHistory();

  return (
    <MenuPopup
      placement="right-end"
      popup={
        <>
          <SidebarItem
            text={
              <Typography noWrap variant="subtitle1">
                Settings
              </Typography>
            }
            icon={<Icon>settings</Icon>}
          />
          <SidebarItem
            text={
              <Typography noWrap variant="subtitle1">
                Logout
              </Typography>
            }
            icon={<Icon>logout</Icon>}
            onClick={() => {logout(); history.push("/login")}}
          />
        </>
      }
      component={
        <SidebarItem
          className={classes.root}
          text={
            <Typography noWrap variant="h6" align="center">
              Anonymous
            </Typography>
          }
          icon={
            <Avatar
              alt="A"
              src="https://source.unsplash.com/featured/?person"
            />
          }
          subMenu={sidebarStatus}
        />
      }
    />
  );
}

export default ProfileBtn;
