import {
  Box,
  ClickAwayListener,
  List,
  ListItem,
  makeStyles,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useCallback, useEffect, useState } from "react";

// Style generator
const useStyle = makeStyles((theme) => ({
  // Tooltip background style
  customTooltip: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid #dadde9",
    maxWidth: 250,
    maxHeight: 400,
    overflowY: "auto",
    overflowX: "hidden",
  },
}));

// Main ManageColumn tooltip component
export default function ManageJira({
  children,
  isOpen,
  closeMenu,
  checkIssue,
  createDialog,
  updateDialog,
  ...rest
}) {
  const classes = useStyle();

  // Hook to get store of timeout reference
  const [timer, setTimer] = useState();

  // Start & stop timer
  const startTimeout = () => setTimer(setTimeout(closeMenu, 5000));
  const stopTimeout = useCallback(() => clearTimeout(timer), [timer]);

  // Clear timeout on unmounting component
  useEffect(() => stopTimeout, [stopTimeout]);

  return (
    <Tooltip
      placement="bottom"
      open={isOpen}
      onOpen={stopTimeout}
      onClose={startTimeout}
      PopperProps={{
        container: () =>
          document.getElementById(localStorage.getItem("fullScreen")),
      }}
      classes={{ tooltip: classes.customTooltip }}
      interactive
      {...rest}
      title={
        <Box>
          <ClickAwayListener onClickAway={closeMenu}>
            <List disablePadding>
              <ListItem
                divider
                dense
                button
                onClick={() => {
                  createDialog();
                  closeMenu();
                }}
              >
                <Typography id="create-issue-btn" variant="button">
                  Create Issue
                </Typography>
              </ListItem>
              {checkIssue() && (
                <ListItem
                  dense
                  button
                  onClick={() => {
                    updateDialog();
                    closeMenu();
                  }}
                >
                  <Typography id="update-issue-btn" variant="button">
                    Update Issue
                  </Typography>
                </ListItem>
              )}
            </List>
          </ClickAwayListener>
        </Box>
      }
    >
      {children}
    </Tooltip>
  );
}
