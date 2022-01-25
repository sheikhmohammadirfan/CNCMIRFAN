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
import DataTable from "../Utils/DataTable/DataTable";
import DownloadPoam from "./DownloadPoam";
import { TextControl } from "../Control";
import jira from "../../assets/img/jira-brands.svg";

const clx = (...params) => params.filter((val) => val).join(" ");

// Style generator
const useStyle = makeStyles((theme) => ({
  // Style for tab switching button
  tabButton: {
    background: "black",
    paddingBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    "& > .MuiButton-root": {
      color: "white",
      borderBottom: "none",
      "&:nth-child(1)": { borderRadius: "4px 0 0 0" },
      "&:nth-child(2)": { borderRadius: "0 4px 0 0" },
      "&:disabled": { color: "black", background: "white" },
    },
  },

  // Apply style on search container
  searchContainer: {
    justifyContent: "flex-end",
    "& > *": { width: 40, height: "max-content" },
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

  return (
    <>
      {data && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginY={0.5}
          >
            <DataTable
              style={{
                border: "none",
                marginRight: "10rem",
                width: "fit-content",
              }}
              serialNo={false}
              rowList={{
                rowData: [
                  {
                    data: [
                      { text: "File Name", css: { fontWeight: "bold" } },
                      { text: "CSP Name", css: { fontWeight: "bold" } },
                      { text: "System Name", css: { fontWeight: "bold" } },
                      { text: "Agency Name", css: { fontWeight: "bold" } },
                    ],
                  },
                  {
                    data: [
                      { text: "POAM_FILE_001.xlsx" },
                      { text: "ACME INC." },
                      { text: "HEALTH DEPARTMENT" },
                      { text: "HEALTH DEPARTMENT" },
                    ],
                  },
                ],
                cellStyle: {
                  border: "none",
                  borderRight: "16px solid transparent",
                  padding: 2,
                  textAlign: "center",
                },
              }}
            />

            <ButtonGroup
              disableElevation
              disableFocusRipple
              disableRipple
              color="default"
              aria-label="outlined primary button group"
              className={classes.searchContainer}
            >
              <Tooltip arrow title="Manage issues">
                <Button style={{ padding: "5px 15px" }}>
                  <img src={jira} style={{ height: "24px" }} />
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
                  {isOpenPoam() ? (
                    <img
                      src="https://img.icons8.com/ios-filled/24/000000/move-right.png"
                      style={{ opacity: selectedRow.length !== 1 ? 0.4 : 1 }}
                    />
                  ) : (
                    <img
                      src="https://img.icons8.com/ios-filled/24/000000/move-left.png"
                      style={{ opacity: selectedRow.length !== 1 ? 0.4 : 1 }}
                    />
                  )}
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
              <ButtonGroup className={classes.tabButton}>
                <Button disabled={isOpenPoam()} onClick={showOpenPoam}>
                  Open
                </Button>
                <Button disabled={!isOpenPoam()} onClick={showClosePoam}>
                  Close
                </Button>
              </ButtonGroup>
            </Box>

            <Box marginY={1} paddingBottom={Number(!isOpenPoam())}>
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
