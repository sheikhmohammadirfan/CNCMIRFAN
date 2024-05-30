import { Box, ClickAwayListener, List, ListItem, Switch, Tooltip, Typography, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyle = makeStyles((theme) => ({
  // Tooltip background style
  customTooltip: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.6)",
    border: "1px solid #dadde9",
    minWidth: 200,
    // maxWidth: 250,
    maxHeight: 400,
    overflowY: "auto",
    overflowX: "hidden",
    marginTop: "8px",
    padding: '8px',
  },
}))

// Dropdown to hide and show columns in risk register table
const ManageRegisterColumns = ({
  open,
  handleClose,
  cols: { allColumns },
  children
}) => {

  const classes = useStyle();

  return (
    <Tooltip
      placement="bottom-end"
      open={open}
      classes={{ tooltip: classes.customTooltip }}
      interactive
      title={
        <Box>
          <ClickAwayListener onClickAway={handleClose}>
            <List disablePadding>
              <ListItem divider disableGutters dense>
                <Typography variant="button" style={{ fontWeight: "bold", textTransform: "none", }}>
                  Default Columns
                </Typography>
              </ListItem>

              {/* {allColumns
                .filter(
                  (name) =>
                    !hiddenColumns.includes(name) &&
                    name.toLowerCase() !== "poam id"
                )
                .map((headerName, index) => (
                ))} */}
              {allColumns.map((colName, index) => (
                <ListItem key={index} disableGutters dense>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    width={1}
                    sx={{color: "rgba(0, 0, 0, 0.8)"}}
                  >
                    <Typography variant="caption" noWrap>
                      {colName}
                    </Typography>
                    <Switch
                      name={colName}
                      size="small"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                      color='primary'
                    // checked={!secondaryColumns.includes(headerName)}
                    // onChange={(e) =>
                    //   !e.target.checked
                    //     ? addColumns(headerName)
                    //     : removeColums(headerName)
                    // }
                    />
                  </Box>
                </ListItem>
              ))}

              <ListItem divider disableGutters dense>
                <Typography variant="button" style={{ fontWeight: "bold", textTransform: "none", }}>
                  Hidden columns
                </Typography>
              </ListItem>

              {/* {hiddenColumns.map((headerName, index) => (
              ))} */}
              <ListItem disableGutters dense>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width={1}
                >
                  <Typography variant="caption" noWrap>
                    {"headerName"}
                  </Typography>
                  <Switch
                    name={"headerName"}
                    size="small"
                    inputProps={{ "aria-label": "secondary checkbox" }}
                    color='primary'
                  // checked={!secondaryColumns.includes(headerName)}
                  // onChange={(e) =>
                  //   !e.target.checked
                  //     ? addColumns(headerName)
                  //     : removeColums(headerName)
                  // }
                  />
                </Box>
              </ListItem>
            </List>
          </ClickAwayListener>
        </Box>
      }
    >
      {children}
    </Tooltip>
  )
}

export default ManageRegisterColumns