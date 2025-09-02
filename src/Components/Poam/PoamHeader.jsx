import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  makeStyles,
  Tooltip,
  InputAdornment,
  Typography,
  IconButton,
  Zoom,
  Popover,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import ManageColumns from "./ManageColumns";
import ManageJira from "./ManageJira";
import DownloadPoam from "./DownloadPoam";
import { TextControl } from "../Utils/Control";
import jira from "../../assets/img/jira-brands.svg";
import { useEffect } from "react";

// Style generator
const useStyle = makeStyles((theme) => ({
  // Style for tab switching button
  tabButtonGroup: {
    textTransform: "none",
    // paddingBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    "& > .MuiButton-root": {
      color: "#b3b3b3",
      borderColor: "#d9d9d9",
      border: "none",
      borderBottom: "3px solid #d9d9d9",
      "&:nth-child(1)": { borderRadius: "4px 0 0 0" },
      "&:nth-child(2)": { borderRadius: "0 4px 0 0" },
      "&:disabled": {
        color: "#4477CE",
        borderColor: theme.palette.primary.main,
      },
    },
  },

  tabButton: {
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#f4f4f4",
    },
  },

  // Apply style on search container
  searchContainer: {
    justifyContent: "flex-end",
    "& > *": { width: 40, height: "fit-content" },
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

  searchInput: {
    width: 300,
    "@media (max-width: 960px)": {
      flexGrow: 1,
    },
    backgroundColor: "white",
    borderRadius: 7,
    borderRight: 0,
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 8,
      paddingRight: 8,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 7,
      // borderTopRightRadius: 0,
      // borderBottomRightRadius: 0,
      height: 36,
    },
    // overflow: "hidden"
  },

  actionButton: {
    "&.Mui-disabled": {
      border: "none",
    },
    border: "none",
    borderRadius: 5,
    color: theme.palette.primary.main,
    textTransform: "none",
    "&.MuiButton-root": {
      "@media (max-width: 960px)": {
        minWidth: "50px",
      },
    },
    "& .MuiButton-endIcon": {
      "@media (max-width: 960px)": {
        marginLeft: 0,
        marginRight: 0,
      },
    },
  },
}));

/* POA&M HEADER COMPONENT */
export default function PoamHeader({
  selectedRow,
  zoom: { isZoomed, zoomIn, zoomOut },
  details: { fileID },
  poamData,
  cols: { allColumns, secondaryColumns, hiddenColumns, visibleColumns },
  manageCol: { moveToPrimary, moveToSecondary },
  manageRow: { openEditFrom, openCreateForm, openJustify },
  manageSheet: { isOpenPoam, showOpenPoam, showClosePoam },
  manageJira: { containIssue, showCreateIssue, showUpdateIssue },
  manageTask: { showTaskTracker },
  search: {
    matchedCell,
    setMatched,
    searchSelected,
    setSelected,
    setSearchTerm,
  },
}) {
  const classes = useStyle();

  // hook to Jira open / close status of Jira column
  const [isJiraOpen, setIsJiraOpen] = useState(false);
  const openJira = () => setIsJiraOpen(true);
  const closeJira = () => setIsJiraOpen(false);

  // hook to manage open / close status of manage column
  const [isManageOpen, setIsManageOpen] = useState(false);
  const openManage = () => setIsManageOpen(true);
  const closeManage = () => setIsManageOpen(false);

  // hook to manage open / close status of download dialog
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const openDownload = () => setIsDownloadOpen(true);
  const closeDownload = () => setIsDownloadOpen(false);

  const [searchValue, setSearch] = useState("");
  const updateSearch = (e) => {
    const searchedValue = e.target.value;
    setSearch(searchedValue);
  };
  useEffect(() => {
    setSearch("");
  }, [poamData, isOpenPoam]);
  useEffect(() => {
    const matches = [];
    if (searchValue) {
      try {
        const searchRegex = new RegExp(
          searchValue
            .replaceAll("(", "\\(")
            .replaceAll(")", "\\)")
            .replaceAll(".", "\\."),
          "i"
        );
        const data = isOpenPoam ? poamData.open : poamData.close;
        const length = Object.keys(data["POAM ID"] || {}).length;
        const offset = isOpenPoam ? 2 : 0;

        for (let i = offset; i < length; i++) {
          for (let column of visibleColumns) {
            if (data[column][i] && String(data[column][i]).match(searchRegex)) {
              matches.push({ column, row: i, selected: false });
            }
          }
        }
      } catch (e) {
        console.log(e);
      }
    }
    setSelected(-1); // Temporary reset to trigger useEffect in PoamTable every time searchValue gets changed
    setTimeout(() => {
      // To make sure setSelected(-1) above gets recognized
      if (matches.length) {
        setSelected(0); // Set back to first match if there is a match
      }
    }, 0);
    setMatched(matches);
    setSearchTerm(searchValue); // Update the search term in PoamTable
  }, [searchValue]);

  // State to manage md breakpoint
  const theme = useTheme();
  const aboveMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <>
      {"poamData" && (
        <>
          {/* 1st Box: Had poam file details and Zoom/Download buttons (Removed) */}

          {/* 2nd Box: Tab buttons & search, Add POA&M Button */}
          <Box
            display="flex"
            alignItems={aboveMd && "flex-end"}
            justifyContent="space-between"
            mt={0}
            flexDirection={!aboveMd && "column"}
            gridGap={!aboveMd && 10}
          >
            <Box>
              <ButtonGroup className={classes.tabButtonGroup}>
                <Button
                  disableTouchRipple
                  disabled={isOpenPoam}
                  onClick={showOpenPoam}
                  className={classes.tabButton}
                  startIcon={<Icon>access_time_filled</Icon>}
                >
                  Open
                </Button>
                <Button
                  disableTouchRipple
                  disabled={!isOpenPoam}
                  onClick={showClosePoam}
                  className={classes.tabButton}
                  startIcon={<Icon>check_circle</Icon>}
                >
                  Close
                </Button>
              </ButtonGroup>
            </Box>

            <Box
              display="flex"
              alignItems="flex-end"
              justifyContent="space-between"
              sx={{gap:"10px"}}
            >
              <ButtonGroup
                disableElevation
                disableFocusRipple
                aria-label="outlined primary button group"
              >
                {isOpenPoam && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={openCreateForm}
                    startIcon={<Icon>add</Icon>}
                    style={{
                      background: "#4477CE",
                      color: "white",
                      borderRadius: 7,
                      borderColor: "#4477CE",
                      height: 36,
                      marginLeft: 10,
                      // paddingInline: 15,
                    }}
                  >
                    New
                  </Button>
                )}
              </ButtonGroup>
              <TextControl
                variant="outlined"
                placeholder="Search here"
                size="small"
                gutter={false}
                label=" "
                className={classes.searchInput}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {searchValue ? (
                        <IconButton
                          size="small"
                          color="#4477CE"
                          onClick={() => {
                            updateSearch({ target: { value: "" } });
                          }}
                          style={{ color: "#4477CE" }}
                        >
                          <Icon>close</Icon>
                        </IconButton>
                      ) : (
                        <Icon style={{ color: "#4477CE" }}>search</Icon>
                      )}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment
                      position="absolute"
                      style={{ position: "absolute", right: -6 }}
                    >
                      {searchValue && (
                        <>
                          <IconButton
                            size="small"
                            color="inherit"
                            disabled={
                              searchSelected === 0 || matchedCell.length <= 1
                            }
                            onClick={() => setSelected((prev) => prev - 1)}
                          >
                            <Icon>arrow_left</Icon>
                          </IconButton>
                          <IconButton
                            size="small"
                            color="inherit"
                            disabled={
                              searchSelected === matchedCell.length - 1 ||
                              matchedCell.length <= 1
                            }
                            onClick={() => setSelected((prev) => prev + 1)}
                          >
                            <Icon>arrow_right</Icon>
                          </IconButton>
                        </>
                      )}
                    </InputAdornment>
                  ),
                }}
                value={searchValue}
                onChange={updateSearch}
              />
            </Box>
          </Box>

          {/* 3rd Box: action buttons and manage columns button */}
          <Box
            mt={2}
            display={"flex"}
            justifyContent={"space-between"}
            paddingY={1}
            paddingX={1}
            padding={1}
            border={1}
            sx={{
              borderRadius: 10,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: "#fff",
              borderBottom: "none",
              "& .MuiButton-startIcon": {
                marginRight: !aboveMd && 0,
                marginLeft: !aboveMd && 0,
              },
              "& .MuiButton-root": {
                padding: aboveMd && "6px 16px",
              },
              borderColor: "#d9d9d9",
            }}
          >
            <Box marginY={"auto"}>
              <ManageJira
                isOpen={isJiraOpen}
                closeMenu={closeJira}
                checkIssue={containIssue}
                createDialog={showCreateIssue}
                updateDialog={showUpdateIssue}
              >
                <Button
                  className={classes.actionButton}
                  disabled={!(isOpenPoam && selectedRow.length >= 1)}
                  onClick={openJira}
                >
                  <img
                    src={jira}
                    alt="JIRA"
                    style={{
                      height: "20px",
                      marginRight: aboveMd ? 8 : 0,
                      opacity: !(isOpenPoam && selectedRow.length >= 1)
                        ? 0.4
                        : 1,
                    }}
                  />
                  {aboveMd && "Jira"}
                </Button>
              </ManageJira>

              <Button
                id="move-row-btn"
                className={classes.actionButton}
                disabled={selectedRow.length !== 1}
                onClick={openJustify}
              >
                {isOpenPoam ? (
                  <img
                    alt="move-close"
                    src="https://img.icons8.com/ios-filled/24/000000/move-right.png"
                    style={{
                      opacity: selectedRow.length !== 1 ? 0.4 : 1,
                      marginRight: aboveMd ? 8 : 0,
                      color: "white",
                    }}
                  />
                ) : (
                  <img
                    alt="move-open"
                    src="https://img.icons8.com/ios-filled/24/000000/move-left.png"
                    style={{
                      opacity: selectedRow.length !== 1 ? 0.4 : 1,
                      marginRight: aboveMd ? 8 : 0,
                      color: "white",
                    }}
                  />
                )}
                {aboveMd && (isOpenPoam ? "Move to Close" : "Move to Open")}
              </Button>

              <Button
                id="edit-row-btn"
                className={classes.actionButton}
                disabled={selectedRow.length !== 1 || !isOpenPoam}
                onClick={openEditFrom}
                startIcon={<Icon>edit</Icon>}
              >
                {aboveMd && "Edit"}
              </Button>

              <Button
                // disableRipple
                id="poam-zoom-btn"
                className={classes.actionButton}
                onClick={isZoomed() ? zoomOut : zoomIn}
                startIcon={
                  <Icon>{isZoomed() ? "zoom_in_map" : "zoom_out_map"}</Icon>
                }
              >
                {aboveMd && (isZoomed() ? "Zoom Out" : "Zoom In")}
              </Button>

              <Button
                id="download-file-btn"
                className={classes.actionButton}
                onClick={openDownload}
                startIcon={<Icon>file_download</Icon>}
              >
                {aboveMd && "Download"}
              </Button>

              <Button
                id="download-file-btn"
                className={classes.actionButton}
                onClick={showTaskTracker}
                startIcon={<Icon>timeline</Icon>}
              >
                {aboveMd && "Action Tracker"}
              </Button>
            </Box>
            <Box>
              <ManageColumns
                isOpen={isManageOpen}
                closeMenu={closeManage}
                cols={{ allColumns, secondaryColumns, hiddenColumns }}
                addColumns={moveToSecondary}
                removeColums={moveToPrimary}
              >
                <Button
                  onClick={openManage}
                  endIcon=<Icon>tune</Icon>
                  className={classes.actionButton}
                  style={{
                    color: "#4477CE",
                    textTransform: "none",
                    backgroundColor: "#F0F8F7",
                    borderRadius: 10,
                    paddingInline: 15,
                    width: !aboveMd && 50,
                  }}
                >
                  {aboveMd && "Show Columns"}
                </Button>
              </ManageColumns>
            </Box>
          </Box>

          {/* Edit Actions POPUP Box */}

          <DownloadPoam
            poamID={fileID}
            data={poamData}
            isOpenPoam={isOpenPoam}
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
