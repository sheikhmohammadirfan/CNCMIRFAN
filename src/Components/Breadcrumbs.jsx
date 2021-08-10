import React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link,
  makeStyles,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

/**
 * Generate Style
 * */
const useStyles = makeStyles({
  // Color for current page link
  typo: { color: "#000", "&:hover": { textDecoration: "none" } },

  // Update styles for link
  link: {
    color: "#777",
    "&:hover": { cursor: "pointer", textDecoration: "none", color: "#333" },
  },
});

/**
 * Breadcrumbs Component
 */
const Breadcrumbs = ({ history, location: { pathname } }) => {
  // Get styles
  const classes = useStyles();

  //filtering to get rid of empty string
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb">
      <Link
        className={pathnames.length > 0 ? classes.link : classes.typo}
        onClick={() => pathnames.length > 0 && history.push("/")}
      >
        Home
      </Link>

      {pathnames.map((name, index) => (
        <Link
          key={name}
          className={index < pathnames.length - 1 ? classes.link : classes.typo}
          onClick={() =>
            index < pathnames.length - 1 &&
            history.push(`/${pathnames.slice(0, index + 1).join("/")}`)
          }
        >
          {name}
        </Link>
      ))}
    </MUIBreadcrumbs>
  );
};

export default withRouter(Breadcrumbs);
