import { Box, Popover, Typography, makeStyles, useScrollTrigger } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import useParams from "./Utils/Hooks/useParams";
import { getData } from "../Service/Poam.service";

/** CSS class generator */
const useStyles = makeStyles((theme) => ({
  // style for header roots
  root: {
    zIndex: 5,
    maxHeight: theme.headerHeight,
    minHeight: "min-content",
    background: "#fff",
    borderBottom: '1px solid #d9d9d9',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    transition: "box-shadow 0.1s linear",
    [theme.breakpoints.down("xs")]: {
      width: `calc(100% - ${theme.sidebarSmall}px)`,
      left: theme.sidebarSmall,
    },
  },

  chip_label: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: theme.spacing(1.5),
    textTransform: "uppercase",
    color: 'white',
    opacity: 0.8
  },

  chip_data: {
    fontSize: 14,
    padding: `${theme.spacing(0)}px ${theme.spacing(1)}px`,
    color: '#fff',
    // opacity: 0.9,
    borderRadius: theme.shape.borderRadius,
    // maxWidth: 200,
  },

  popover: {
    '& .MuiPaper-root': {
      background: 'none',
    },
    '& .MuiPaper-elevation8': {
      boxShadow: 'none'
    },
    '& .MuiPopover-paper': {
      display: 'flex',
      top: '6px !important'
    }
  }
}));

/* Header component */
function Header({ scrollTarget }) {
  // Get styles
  const classes = useStyles();

  // Set onScroll handler, to activate bottom shadow when scroll from top
  const headerScrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 50,
    target: scrollTarget,
  });

  // SHOW POAM FILE DETAILS IN HEADER IF A POAM FILE IS OPENED
  // React State to save poam table name
  const [poamDetails, setPoamDetails] = useState({
    fileName: "",
    cspName: "",
    systemName: "",
    agencyName: "",
  });
  // Get url details whenever url/location changes
  const pathname = useParams().location.pathname;
  // Boolean to check if location contains 'poam'
  let isPoamSection = pathname === "/poam";
  // Get parameters from URL
  let params = useParams().getParams();
  // Boolean to check if url contains parameters 'file' and 'page-name'
  let paramsHasFileDetails = 'file' in params && 'page-name' in params;

  // Fetch poam file details and update state 
  useEffect(() => {
    if (isPoamSection && paramsHasFileDetails) {
      getData(params.file).then(({ data, status }) => {
        status && setPoamDetails({
          fileName: data.file_name,
          cspName: data.csp,
          systemName: data.system_name,
          agencyName: data.agency_name,
        })
      });
    }
  }, [isPoamSection, paramsHasFileDetails, params.file])

  // hook to manage open / close details popup of header
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl)

  return (
    <>
      <Box className={classes.root} boxShadow={headerScrollTrigger ? 3 : 0}>
        <Breadcrumbs
          isPoamPage={isPoamSection && paramsHasFileDetails}
          showPoamDetails={handleClick}
        />

        {/* Popover to display POAM File Details */}
        <Popover
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
          className={classes.popover}
        >
          {/* Box to show popover arrow */}
          <Box
            sx={{
              marginX: 1,
              position: "relative",
              "&::before": {
                backgroundColor: "#4477CE",
                content: '""',
                display: "block",
                position: "absolute",
                width: 12,
                height: 12,
                // top: 'calc(50% - 6px)',
                top: 10,
                transform: "rotate(45deg)",
                left: 2,
                zIndex: -100
              }
            }}
            style={{ zIndex: -100 }}
          >
          </Box>
          {/* Popover arrow end */}
          <Box
            style={{
              padding: 10,
              width: 360,
              background: '#4477CE',
              borderRadius: 6,
            }}
          >
            <Box display={'flex'} position={'relative'}>
              <Typography className={classes.chip_label}>CSP Name : </Typography>

              <Typography noWrap className={classes.chip_data} style={{
                position: 'absolute',
                left: 120
              }}>
                {poamDetails.cspName}
              </Typography>

            </Box>
            <Box display={'flex'} position={'relative'} mt={1}>
              <Typography className={classes.chip_label}>System Name : </Typography>

              <Typography className={classes.chip_data} style={{
                position: 'absolute',
                left: 120
              }}>
                {poamDetails.systemName}
              </Typography>
            </Box>
            <Box display={'flex'} position={'relative'} mt={1}>
              <Typography className={classes.chip_label}>Agency Name : </Typography>
              <Typography noWrap className={classes.chip_data} style={{
                position: 'absolute',
                left: 120
              }}>
                {poamDetails.agencyName}
              </Typography>
            </Box>
          </Box>
        </Popover>
        {/* Popover End */}

        <Box display="flex" alignItems="center">
          <NotificationsIcon style={{ cursor: "pointer" }} />
        </Box>
      </Box>
    </>
  );
}

export default Header;
