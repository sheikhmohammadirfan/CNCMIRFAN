import { makeStyles, useScrollTrigger } from "@material-ui/core";
import { Box } from '@mui/material'
import NotificationsIcon from "@material-ui/icons/Notifications";
import Breadcrumbs from "./Breadcrumbs";
import useParams from "./Utils/Hooks/useParams";
import ProfileMenu from "./ProfileMenu";

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
    paddingRight: theme.spacing(2),
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

  // Get url details whenever url/location changes
  const pathname = useParams().location.pathname;
  // Boolean to check if location contains 'poam'
  let isPoamSection = pathname === "/poam";
  // Get parameters from URL
  let params = useParams().getParams();
  // Boolean to check if url contains parameters 'file' and 'page-name'
  let paramsHasFileDetails = 'file' in params && 'page-name' in params;

  return (
    <>
      <Box className={classes.root} boxShadow={headerScrollTrigger ? 3 : 0}>
        <Breadcrumbs isPoamPage={isPoamSection && paramsHasFileDetails} />
        <Box display="flex" alignItems="center" sx={{ columnGap: 1 }}>
          <NotificationsIcon style={{ cursor: "pointer" }} />
          <ProfileMenu />
        </Box>
      </Box>
    </>
  );
}

export default Header;
