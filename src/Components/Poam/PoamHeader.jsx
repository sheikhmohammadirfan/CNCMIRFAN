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
  tabButton: {
    paddingBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    "& > .MuiButton-root": {
      borderBottom: "none",
      "&:nth-child(1)": { borderRadius: "4px 0 0 0" },
      "&:nth-child(2)": { borderRadius: "0 4px 0 0" },
      "&:disabled": { color: "white", background: "black" },
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

  chip_container: {
    display: "flex",
    alignItems: "center",
    padding: `${theme.spacing(0.6)}px ${theme.spacing(1.5)}px`,
    background: theme.palette.grey[300],
    borderRadius: 2 * theme.shape.borderRadius,
    border: `1px solid ${theme.palette.grey[400]}`,
    cursor: "default",
  },

  chip_label: {
    fontWeight: "bold",
    marginRight: theme.spacing(1.5),
    textTransform: "uppercase",
  },

  chip_data: {
    padding: `${theme.spacing(0)}px ${theme.spacing(1)}px`,
    background: "#fafafa",
    opacity: 0.9,
    borderRadius: theme.shape.borderRadius,
    maxWidth: 200,
  },

  searchInput: {
    height: 32,
    width: 300,
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 8,
      paddingRight: 8,
    },
    overflow: "hidden",
  },
}));

/* POA&M HEADER COMPONENT */
export default function PoamHeader({
  selectedRow,
  zoom: { isZoomed, zoomIn, zoomOut },
  details: { fileID, fileName, cspName, systemName, agencyName },
  poamData,
  cols: { allColumns, secondaryColumns, hiddenColumns, visibleColumns },
  manageCol: { moveToPrimary, moveToSecondary },
  manageRow: { openEditFrom, openCreateForm, openJustify },
  manageSheet: { isOpenPoam, showOpenPoam, showClosePoam },
  manageJira: { containIssue, showCreateIssue, showUpdateIssue },
  search: { matchedCell, setMatched, searchSelected, setSelected },
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
    if (matches.length) {
      matches[0].selected = true;
      setSelected(0);
    } else {
      setSelected(-1);
    }
    setMatched(matches);
  }, [searchValue]);

  return (
    <>
      {poamData && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            marginY={0.5}
          >
            <Box className={`${classes.chip_container} title`}>
              <Typography className={classes.chip_label}>File</Typography>
              <Tooltip title={fileName} placement="bottom" arrow>
                <Typography noWrap className={classes.chip_data}>
                  {fileName}
                </Typography>
              </Tooltip>
              <Box width={24} />
              <Typography className={classes.chip_label}>CSP</Typography>
              <Tooltip title={cspName} placement="bottom" arrow>
                <Typography noWrap className={classes.chip_data}>
                  {cspName}
                </Typography>
              </Tooltip>
              <Box width={24} />
              <Typography className={classes.chip_label}>System</Typography>
              <Tooltip title={systemName} placement="bottom" arrow>
                <Typography className={classes.chip_data}>
                  {systemName}
                </Typography>
              </Tooltip>
              <Box width={24} />
              <Typography className={classes.chip_label}>Agency</Typography>
              <Tooltip title={agencyName} placement="bottom" arrow>
                <Typography noWrap className={classes.chip_data}>
                  {agencyName}
                </Typography>
              </Tooltip>
            </Box>

            <ButtonGroup
              disableElevation
              disableFocusRipple
              disableRipple
              color="default"
              aria-label="outlined primary button group"
              className={classes.searchContainer}
            >
              <ManageJira
                isOpen={isJiraOpen}
                closeMenu={closeJira}
                checkIssue={containIssue}
                createDialog={showCreateIssue}
                updateDialog={showUpdateIssue}
              >
                <Button
                  disabled={!(isOpenPoam && selectedRow.length === 1)}
                  style={{ padding: "5px 15px" }}
                  onClick={openJira}
                >
                  <img
                    src={jira}
                    alt="JIRA"
                    style={{
                      height: "24px",
                      opacity: !(isOpenPoam && selectedRow.length === 1)
                        ? 0.4
                        : 1,
                    }}
                  />
                </Button>
              </ManageJira>

              <Tooltip
                arrow
                title={isOpenPoam ? "Move to close" : "Move to open  "}
                PopperProps={{
                  container: () =>
                    document.getElementById(localStorage.getItem("fullScreen")),
                }}
              >
                <Button
                  id="move-row-btn"
                  disabled={selectedRow.length !== 1}
                  onClick={openJustify}
                >
                  {isOpenPoam ? (
                    <img
                      alt="move-close"
                      src="https://img.icons8.com/ios-filled/24/000000/move-right.png"
                      style={{ opacity: selectedRow.length !== 1 ? 0.4 : 1 }}
                    />
                  ) : (
                    <img
                      alt="move-open"
                      src="https://img.icons8.com/ios-filled/24/000000/move-left.png"
                      style={{ opacity: selectedRow.length !== 1 ? 0.4 : 1 }}
                    />
                  )}
                </Button>
              </Tooltip>

              {isOpenPoam && (
                <Tooltip
                  arrow
                  title="Edit row"
                  PopperProps={{
                    container: () =>
                      document.getElementById(
                        localStorage.getItem("fullScreen")
                      ),
                  }}
                >
                  <Button
                    id="edit-row-btn"
                    disabled={selectedRow.length !== 1}
                    onClick={openEditFrom}
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

              <Button id="download-file-btn" onClick={openDownload}>
                <Icon>file_download</Icon>
              </Button>

              <Tooltip
                arrow
                title="Zoom in"
                PopperProps={{
                  container: () =>
                    document.getElementById(localStorage.getItem("fullScreen")),
                }}
              >
                <Button
                  id="poam-zoom-btn"
                  onClick={isZoomed() ? zoomOut : zoomIn}
                >
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
                <Button disabled={isOpenPoam} onClick={showOpenPoam}>
                  Open
                </Button>
                <Button disabled={!isOpenPoam} onClick={showClosePoam}>
                  Close
                </Button>
              </ButtonGroup>
            </Box>

            <Box marginY={1} paddingBottom={Number(!isOpenPoam)}>
              <TextControl
                variant="outlined"
                placeholder="Search here"
                size="small"
                gutter={false}
                label=" "
                className={classes.searchInput}
                inputProps={{ style: { paddingTop: 7, paddingBottom: 6 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {searchValue ? (
                        <IconButton
                          size="small"
                          color="inherit"
                          onClick={() => {
                            updateSearch({ target: { value: "" } });
                          }}
                        >
                          <Icon>close</Icon>
                        </IconButton>
                      ) : (
                        <Icon>search</Icon>
                      )}
                    </InputAdornment>
                  ),
                  endAdornment: searchValue ? (
                    <InputAdornment position="end">
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
                    </InputAdornment>
                  ) : null,
                }}
                value={searchValue}
                onChange={updateSearch}
              />
              {isOpenPoam && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={openCreateForm}
                  startIcon={<Icon>add</Icon>}
                  style={{
                    background: "black",
                    color: "white",
                    marginLeft: 8,
                  }}
                >
                  Add New Poa&m
                </Button>
              )}
            </Box>
          </Box>

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
