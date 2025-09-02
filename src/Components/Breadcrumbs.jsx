import React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import { BreadcrumbMapper } from "../assets/data/BreadcrumbMapper";
import { getUser } from "../Service/UserFactory";

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
const Breadcrumbs = ({ location: { pathname, search } }) => {
   
   const user = getUser();
  
  // Define superuser-only routes
  const SUPERUSER_ONLY_ROUTES = ['/rbac/organization'];
  
  // Check if current path is a superuser-only route and user is not superuser
  const isUnauthorizedSuperUserRoute = SUPERUSER_ONLY_ROUTES.some(route => 
    pathname.startsWith(route)
  ) && !user?.is_superuser;
    
  // If unauthorized access to superuser route, don't show breadcrumbs
  if (isUnauthorizedSuperUserRoute) {
    return null; // No breadcrumbs at all
  }

  // If user is superadmin, don't show breadcrumbs at all
  if (user?.is_superuser) {
    return null;
  }

  // Array of object with path details
  const pathObject = pathname
    .split("/")
    .filter((x) => x)
    .map((path) => ({
      path,
      text: BreadcrumbMapper[path] || "",
      type: "location",
    }));

  // Append Query String
  const pageName = new URLSearchParams(search).get("page-name");
  if (pageName) {
    pathObject.push({ path: search, text: pageName, type: "search" });
  }

  // Array of path string
  const pathArray = pathObject.map((path) => path.path);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb" separator="/">
      {pathObject.map(({ path, text, type }, index) => (
        <Text
          key={index}
          link={index < pathObject.length - 1}
          path={
            type === "location"
              ? `/${pathArray.slice(0, index + 1).join("/")}`
              : `/${pathArray.join("/")}${path}`
          }
          data-test="breadcrumbs-path-chip"
        >
          {text
            .split(" ")
            .map((t) => t.slice(0, 1).toUpperCase() + t.slice(1))
            .join(" ")}
        </Text>
      ))}
    </MUIBreadcrumbs>
  );
};

export default withRouter(Breadcrumbs);
