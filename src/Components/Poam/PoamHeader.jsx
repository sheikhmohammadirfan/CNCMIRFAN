import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  makeStyles,
  Tooltip,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import React, { useState } from "react";
import ManageColumns from "./ManageColumns";
import DownloadPoam from "./DownloadPoam";
import { TextControl } from "../Control";

const clx = (...params) => params.filter((val) => val).join(" ");

// Style generator
const useStyle = makeStyles((theme) => ({
  // Style for create new row button
  tabBtn: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: theme.palette.grey[400],
    borderBottomWidth: 0,
    "&.active": {
      background: "black",
      color: "white",
      fontWeight: "bold",
      "&:disabled": { borderBottomWidth: 0 },
    },
    "&:nth-child(1)": { borderTopRightRadius: 0 },
    "&:nth-child(2)": { borderTopLeftRadius: 0 },
  },

  // Apply style on search container
  searchContainer: {
    justifyContent: "flex-end",
    "& > *": { width: 40 },
  },

  // Search input style
  input: {
    width: "100%",
    minWidth: 0,
    outline: "none",
    padding: `0 ${theme.spacing(1)}px`,
    border: `1px solid ${theme.palette.grey[400]}`,
    borderRightColor: "transparent",
    transition: "all 0.5s linear",
    "&.close": {
      width: "0%",
      padding: "0",
      borderColor: "transparent",
    },
  },
}));

function PoamHeader({
  selectedRow,
  zoom: { isZoomed, zoomIn, zoomOut },
  data,
  cols: { allColumns, secondaryColumns, hiddenColumns },
  manageCol: { moveToPrimary, moveToSecondary },
  manageRow: { editRowData, addNewRow, openJustify },
  manageSheet: { isOpenPoam, showOpenPoam, showClosePoam },
}) {
  const classes = useStyle();

  // hook to manage open / close status of manage column
  const [isManageOpen, setIsManageOpen] = useState(false);
  const openManage = () => setIsManageOpen(true);
  const closeManage = () => setIsManageOpen(false);

  // hook to manage open / close status of download dialog
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const openDownload = () => setIsDownloadOpen(true);
  const closeDownload = () => setIsDownloadOpen(false);

  // Hook to save visibility of input field
  const [isInputOpen, setInputOpen] = useState(false);

  return (
    <>
      {data && (
        <>
          <Box display="flex">
            <Typography
              noWrap
              variant="body1"
              style={{ flexGrow: 1, marginRight: "12px" }}
            >
              <strong>Poam file</strong>
              &nbsp;&nbsp; &nbsp;&nbsp;<strong>CSP Name</strong>
              <br />
              File name &nbsp;&nbsp;&nbsp; ACME INC.
            </Typography>

            <ButtonGroup
              disableElevation
              disableFocusRipple
              disableRipple
              color="default"
              aria-label="outlined primary button group"
              className={classes.searchContainer}
            >
              <Tooltip arrow title="Manage issues">
                <Button>
                  <Icon>confirmation_number</Icon>
                </Button>
              </Tooltip>

              <Tooltip
                arrow
                title={isOpenPoam() ? "Move to close" : "Move to open  "}
              >
                <Button
                  disabled={selectedRow.length !== 1}
                  onClick={openJustify}
                >
                  <Icon>{isOpenPoam() ? "lock" : "lock_open"}</Icon>
                </Button>
              </Tooltip>

              {isOpenPoam() && (
                <Tooltip arrow title="Edit row">
                  <Button
                    disabled={selectedRow.length !== 1}
                    onClick={editRowData}
                  >
                    <Icon>edit</Icon>
                  </Button>
                </Tooltip>
              )}

              <ManageColumns
                isOpen={isManageOpen}
                closeMenu={closeManage}
                cols={{ allColumns, secondaryColumns, hiddenColumns }}
                addColumns={moveToSecondary}
                removeColums={moveToPrimary}
              >
                <Button onClick={openManage}>
                  <Icon>tune</Icon>
                </Button>
              </ManageColumns>

              <Button onClick={openDownload}>
                <Icon>file_download</Icon>
              </Button>

              <Tooltip arrow title="Zoom in">
                <Button onClick={isZoomed() ? zoomOut : zoomIn}>
                  <Icon>{isZoomed() ? "zoom_in_map" : "zoom_out_map"}</Icon>
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Box>
          <Box
            display="flex"
            alignItems="flex-end"
            justifyContent="space-between"
          >
            <Box>
              <Button
                variant="outlined"
                className={clx(classes.tabBtn, isOpenPoam() && "active")}
                disabled={isOpenPoam()}
                onClick={showOpenPoam}
              >
                Open
              </Button>
              <Button
                variant="outlined"
                className={clx(classes.tabBtn, !isOpenPoam() && "active")}
                disabled={!isOpenPoam()}
                onClick={showClosePoam}
              >
                Close
              </Button>
            </Box>

            <Box paddingY={1}>
              <TextControl
                variant="outlined"
                placeholder="Search here"
                size="small"
                gutter={false}
                name=""
                style={{ height: "24px", width: "300px" }}
                inputProps={{ style: { paddingTop: 7, paddingBottom: 6 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon>search</Icon>
                    </InputAdornment>
                  ),
                }}
              />
              {isOpenPoam() && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={addNewRow}
                  startIcon={<Icon>add</Icon>}
                  style={{
                    background: "black",
                    color: "white",
                    marginLeft: 8,
                  }}
                >
                  Create New
                </Button>
              )}
            </Box>
          </Box>
          <DownloadPoam
            data={data}
            isOpenPoam={isOpenPoam()}
            open={isDownloadOpen}
            close={closeDownload}
            allColumns={allColumns}
            hiddenColumns={hiddenColumns}
          />
        </>
      )}
    </>
  );
}

export default PoamHeader;
