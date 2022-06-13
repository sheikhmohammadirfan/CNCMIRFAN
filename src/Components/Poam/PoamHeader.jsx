import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  makeStyles,
  Tooltip,
  InputAdornment,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import ManageColumns from "./ManageColumns";
import ManageJira from "./ManageJira";
import DownloadPoam from "./DownloadPoam";
import { TextControl } from "../Utils/Control";
import jira from "../../assets/img/jira-brands.svg";

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
}));

/* POAM HEADER COMPONENT */
export default function PoamHeader({
  selectedRow,
  zoom: { isZoomed, zoomIn, zoomOut },
  details: { fileID, fileName, cspName, systemName, agencyName },
  poamData,
  cols: { allColumns, secondaryColumns, hiddenColumns },
  manageCol: { moveToPrimary, moveToSecondary },
  manageRow: { openEditFrom, openCreateForm, openJustify },
  manageSheet: { isOpenPoam, showOpenPoam, showClosePoam },
  manageJira: { containIssue, showCreateIssue, showUpdateIssue },
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
              >
                <Button
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
                <Tooltip arrow title="Edit row">
                  <Button
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
                  Create New
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
