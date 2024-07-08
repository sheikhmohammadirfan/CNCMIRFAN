import {
  Box,
  ClickAwayListener,
  List,
  ListItem,
  makeStyles,
  Switch,
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
export default function ManageColumns({
  children,
  isOpen,
  closeMenu,
  cols: { allColumns, secondaryColumns, hiddenColumns },
  addColumns,
  removeColums,
  ...rest
}) {
  const classes = useStyle();

  // Hook to get store of timeout reference
  const [timer, setTimer] = useState();
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
              <ListItem divider disableGutters dense>
                <Typography variant="button" fontWeight="bold">
                  Default Columns
                </Typography>
              </ListItem>

              {allColumns
                .filter(
                  (name) =>
                    !hiddenColumns.includes(name) &&
                    name.toLowerCase() !== "poam id"
                )
                .map((headerName, index) => (
                  <ListItem key={index} disableGutters dense>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      width={1}
                    >
                      <Typography variant="caption" noWrap>
                        {headerName}
                      </Typography>
                      <Switch
                        name={headerName}
                        size="small"
                        inputProps={{ "aria-label": "secondary checkbox" }}
                        checked={!secondaryColumns.includes(headerName)}
                        onChange={(e) =>
                          !e.target.checked
                            ? addColumns(headerName)
                            : removeColums(headerName)
                        }
                      />
                    </Box>
                  </ListItem>
                ))}

              <ListItem divider disableGutters dense>
                <Typography variant="button" fontWeight="bold">
                  Hidden columns
                </Typography>
              </ListItem>

              {hiddenColumns.map((headerName, index) => (
                <ListItem key={index} disableGutters dense>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width={1}
                  >
                    <Typography variant="caption" noWrap>
                      {headerName}
                    </Typography>
                    <Switch
                      name={headerName}
                      size="small"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                      checked={!secondaryColumns.includes(headerName)}
                      onChange={(e) =>
                        !e.target.checked
                          ? addColumns(headerName)
                          : removeColums(headerName)
                      }
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </ClickAwayListener>
        </Box>
      }
    >
      {children}
    </Tooltip>
  );
}
