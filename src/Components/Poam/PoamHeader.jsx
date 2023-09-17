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
    textTransform: 'none',
    // paddingBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    "& > .MuiButton-root": {
      color: "#b3b3b3",
      borderColor: '#d9d9d9',
      border: 'none',
      borderBottom: '3px solid #d9d9d9',
      "&:nth-child(1)": { borderRadius: "4px 0 0 0" },
      "&:nth-child(2)": { borderRadius: "0 4px 0 0" },
      "&:disabled": { color: '#008374', borderColor: '#008374' },
    },
  },

  tabButton: {
    fontWeight: 600,
    '&:hover': {
      backgroundColor: '#f4f4f4'
    }
  },

  // Apply style on search container
  searchContainer: {
    justifyContent: "flex-end",
    "& > *": { width: 40, height: 'fit-content' },
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
    justifyContent: 'space-between',
    padding: `${theme.spacing(0.6)}px ${theme.spacing(1.5)}px`,
    // padding: `7px`,
    // background: theme.palette.grey[300],
    background: '#fff',
    borderRadius: 2 * theme.shape.borderRadius,
    // border: `1px solid ${theme.palette.grey[400]}`,
    border: `1px solid #c0e6e2`,
    // border: `1px solid #449487`,
    cursor: "default",
  },

  chip_label: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: theme.spacing(1.5),
    textTransform: "uppercase",
  },

  chip_data: {
    fontSize: 14,
    padding: `${theme.spacing(0)}px ${theme.spacing(1)}px`,
    color: '#008374',
    // background: "#fafafa",
    // background: "#c0e6e2",
    // paddingInline: 10,
    // paddingBlock: 3,
    opacity: 0.9,
    borderRadius: theme.shape.borderRadius,
    // maxWidth: 200,
  },

  searchInput: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 7,
    borderRight: 0,
    // flexGrow: 1,
    "& .MuiOutlinedInput-adornedStart": {
      paddingLeft: 8,
      paddingRight: 8,
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 7,
      // borderTopRightRadius: 0,
      // borderBottomRightRadius: 0,
      height: 36
    },
    // overflow: "hidden"
  },

  actionButton: {
    '&.Mui-disabled': {
      border: 'none'
    },
    border: 'none',
    color: theme.palette.primary.main,
    textTransform: 'none',
  }
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

  // hook to manage open / close details popup of header
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl)

  return (
    <>
      {'poamData' && (
        <>
          {/* 1st Box */}
          {/* <Box
            display="flex"
            // flexGrow={1}
            alignItems="center"
            justifyContent="space-between"
            marginY={0.5}
          >
            <Box className={`${classes.chip_container} title`}>
              <Box display={'flex'}>
                <Typography className={classes.chip_label}>File Name : </Typography>
                <Typography noWrap className={classes.chip_data}>
                  {'fileName'}2023-POA&M
                </Typography>

              </Box>
              <IconButton style={{ padding: 0, color: '#008374' }} onMouseOver={handleClick}>
                <Icon>info</Icon>
              </IconButton>
              <Popover
                // anchorReference="anchorPosition"
                // anchorPosition={{ top: 52, left: 320 }}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <Box style={{ padding: 10, width: 300 }}>
                  <Box display={'flex'} position={'relative'}>
                    <Typography className={classes.chip_label}>CSP Name : </Typography>

                    <Typography noWrap className={classes.chip_data} style={{
                      position: 'absolute',
                      left: 120
                    }}>
                      {'cspName'}
                      CloudSecure Pro
                    </Typography>

                  </Box>
                  <Box width={24} />
                  <Box display={'flex'} position={'relative'}>
                    <Typography className={classes.chip_label}>System Name : </Typography>

                    <Typography className={classes.chip_data} style={{
                      position: 'absolute',
                      left: 120
                    }}>
                      {'systemName'}
                      SecureCloudApp
                    </Typography>
                  </Box>
                  <Box width={24} />
                  <Box display={'flex'} position={'relative'}>
                    <Typography className={classes.chip_label}>Agency Name : </Typography>
                    <Typography noWrap className={classes.chip_data} style={{
                      position: 'absolute',
                      left: 120
                    }}>
                      {'agencyName'}
                      CyberAgencies Inc.
                    </Typography>
                  </Box>
                </Box>
              </Popover>
              <Box width={24} />
            </Box>

            <Box
              display='flex'
              justifyContent='center'
            >
              <Tooltip
                arrow
                title="Zoom in"
                PopperProps={{
                  container: () =>
                    document.getElementById(localStorage.getItem("fullScreen")),
                }}
              >
                <Button
                  // disableRipple
                  id="poam-zoom-btn"
                  onClick={isZoomed() ? zoomOut : zoomIn}
                  startIcon={<Icon>{isZoomed() ? "zoom_in_map" : "zoom_out_map"}</Icon>}
                  variant="outlined"
                  style={{ borderColor: '#c0e6e2', background: 'white', color: '#008374' }}
                  sx={{ fontWeight: 'bold' }}
                >
                  {isZoomed() ? "Zoom Out" : "Zoom In"}
                </Button>
              </Tooltip>

              <Tooltip
                arrow
                title="Download File"
              >
                <Button
                  id="download-file-btn"
                  onClick={openDownload}
                  startIcon={<Icon>file_download</Icon>}
                  style={{
                    marginLeft: 5,
                    backgroundColor: '#008374',
                    color: 'white',
                    borer: '1px solid #008374',
                  }}
                >
                  Download
                </Button>
              </Tooltip>
            </Box>
          </Box> */}

          {/* 2nd Box: Tab buttons & search, Add POA&M Button */}
          <Box
            display="flex"
            alignItems="flex-end"
            justifyContent="space-between"
            mt={0}
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
            // marginY={1}
            // paddingBottom={Number(!isOpenPoam)}
            >
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
                          color="#008374"
                          onClick={() => {
                            updateSearch({ target: { value: "" } });
                          }}
                          style={{ color: "#008374" }}
                        >
                          <Icon>close</Icon>
                        </IconButton>
                      ) : (
                        <Icon style={{ color: "#008374" }}>search</Icon>
                      )}
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="absolute" style={{ position: 'absolute', right: -6 }}>
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
              <ButtonGroup
                disableElevation
                disableFocusRipple
                // disableRipple
                // color="primary"
                aria-label="outlined primary button group"
              >
                {isOpenPoam && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={openCreateForm}
                    startIcon={<Icon>add</Icon>}
                    style={{
                      background: "#008374",
                      color: "white",
                      borderRadius: 7,
                      borderColor: '#008374',
                      height: 36,
                      marginLeft: 10,
                      paddingInline: 15
                    }}
                  >
                    New
                  </Button>
                )}
              </ButtonGroup>
            </Box>
          </Box>

          {/* 3rd Box: action buttons and manage columns button */}
          <Box
            mt={2}
            display={'flex'}
            justifyContent={'space-between'}
            paddingY={1}
            paddingX={1}
            padding={1}
            border={1}
            sx={{
              borderRadius: 10,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: '#fff',
              borderBottom: 'none'
            }}
            style={{
              borderColor: '#d9d9d9',
            }}
          >
            <Box marginY={'auto'}>
              <ButtonGroup>

                <ManageJira
                  isOpen={isJiraOpen}
                  closeMenu={closeJira}
                  checkIssue={containIssue}
                  createDialog={showCreateIssue}
                  updateDialog={showUpdateIssue}
                >
                  <Button
                    className={classes.actionButton}
                    disabled={!(isOpenPoam && selectedRow.length === 1)}
                    onClick={openJira}
                  >
                    <img
                      src={jira}
                      alt="JIRA"
                      style={{
                        height: "20px",
                        marginRight: 8,
                        opacity: !(isOpenPoam && selectedRow.length === 1) ? 0.4 : 1,
                      }}
                    />
                    Jira
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
                    className={classes.actionButton}
                    disabled={selectedRow.length !== 1}
                    onClick={openJustify}
                  >
                    {isOpenPoam ? (
                      <img
                        alt="move-close"
                        src="https://img.icons8.com/ios-filled/24/000000/move-right.png"
                        style={{ opacity: selectedRow.length !== 1 ? 0.4 : 1, marginRight: 8, color: 'white' }}
                      />
                    ) : (
                      <img
                        alt="move-open"
                        src="https://img.icons8.com/ios-filled/24/000000/move-left.png"
                        style={{ opacity: selectedRow.length !== 1 ? 0.4 : 1, marginRight: 8, color: 'white' }}
                      />
                    )}
                    {(isOpenPoam) ? 'Move to Close' : 'Move to Open'}
                  </Button>
                </Tooltip>

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
                    className={classes.actionButton}
                    disabled={selectedRow.length !== 1}
                    onClick={openEditFrom}
                    startIcon={<Icon>edit</Icon>}
                  >
                    Edit
                  </Button>
                </Tooltip>

                <Tooltip
                  arrow
                  title="Zoom in"
                  PopperProps={{
                    container: () =>
                      document.getElementById(localStorage.getItem("fullScreen")),
                  }}
                >
                  <Button
                    // disableRipple
                    id="poam-zoom-btn"
                    className={classes.actionButton}
                    onClick={isZoomed() ? zoomOut : zoomIn}
                    startIcon={<Icon>{isZoomed() ? "zoom_in_map" : "zoom_out_map"}</Icon>}
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  >
                    {isZoomed() ? "Zoom Out" : "Zoom In"}
                  </Button>
                </Tooltip>

                <Tooltip
                  arrow
                  title="Download File"
                >
                  <Button
                    id="download-file-btn"
                    className={classes.actionButton}
                    onClick={openDownload}
                    startIcon={<Icon>file_download</Icon>}
                  >
                    Download
                  </Button>
                </Tooltip>
              </ButtonGroup>
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
                  style={{
                    color: '#008374',
                    textTransform: 'none',
                    backgroundColor: '#F0F8F7',
                    // backgroundColor: '#d6e8e6',
                    borderRadius: 10,
                    paddingInline: 15
                  }}
                >
                  Show Columns
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
