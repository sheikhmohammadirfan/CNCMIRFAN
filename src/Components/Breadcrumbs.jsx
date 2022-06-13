import React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";

/**
 * CSS class generator
 * */
const useStyles = makeStyles({
  // Color for current page link
  typo: { color: "#000", "&:hover": { textDecoration: "none" } },

  // Update styles for link
  link: {
    color: "#777",
    textDecoration: "none",
    "&:hover": { cursor: "pointer", color: "#333" },
  },
});

/** Compoent to return Link / typography based on data */
const Text = ({ link, children, path }) => {
  // Get styles
  const classes = useStyles();

  return link ? (
    <Link className={classes.link} to={path}>
      {children}
    </Link>
  ) : (
    <Typography className={classes.typo}>{children}</Typography>
  );
};

/**
 * Breadcrumbs Component
 */
const Breadcrumbs = ({ history, location: { pathname } }) => {
  //filtering to get rid of empty string
  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator=">">
      <Text
        link={pathnames.length > 0}
        path={"/"}
        data-test="breadcrumbs-path-chip"
      >
        Home
      </Text>

      {pathnames.map((text, index) => (
        <Text
          key={index}
          link={index < pathnames.length - 1}
          path={`/${pathnames.slice(0, index + 1).join("/")}`}
          data-test="breadcrumbs-path-chip"
        >
          {text}
        </Text>
      ))}
    </MUIBreadcrumbs>
  );
};

export default withRouter(Breadcrumbs);
