import React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  Typography,
  makeStyles
} from "@material-ui/core";
import { withRouter } from "react-router-dom";


const useStyles = makeStyles({
  typo: {
    color: "#000"
  },

  link: { 
    color: "#777",
    "&:hover": {
      cursor: "pointer",
      textDecoration: "none",
      color: "#333",
    },
  }
});

const Breadcrumbs = props => {

  const classes = useStyles();

  // extracting the page relative paths
  const {
    history,
    location: { pathname }
  } = props;
  

  //filtering to get rid of empty string
  const pathnames = pathname.split("/").filter(x => x);
  return (
    // the current page breadcrumb will not serve as a link 
    // but its herirarchical parent are a Link component
    <MUIBreadcrumbs aria-label="breadcrumb">
      {pathnames.length > 0 ? (
        <Link className={classes.link} onClick={() => history.push("/")}>Home</Link>
      ) : (
        <Typography className={classes.typo}> Home </Typography>
      )}
      {/* figuring out the name and index from the pathname array
      and displaying it as breadcrumbs */}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography className={classes.typo} key={name}>{name}</Typography>
        ) : (
          <Link color="inherit" key={name} onClick={() => history.push(routeTo)}>
            {name}
          </Link>
        );
      })}
    </MUIBreadcrumbs>
  );
};

export default withRouter(Breadcrumbs);
