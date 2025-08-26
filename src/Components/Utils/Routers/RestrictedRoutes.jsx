import { getUser } from "../../../Service/UserFactory";
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import ROUTE_PERMISSIONS_MAP from "../../../assets/data/Rbac/routePermissionMap";
import RestrictedPage from "../../Rbac/RestrictedPage";

// added user as prop to avoid multiple calls to getUser-irfan
function RestrictedRoutes({ children, user }) {

  const location = useLocation()
  const pathname = location.pathname

  // const user = getUser();
  const isUserAdmin = user?.roles[0]?.id === 1
  const permissions = user?.roles[0]?.permissions

  const permissionRequiredForRoute = ROUTE_PERMISSIONS_MAP[pathname]
  const userHasPermission = permissions?.find(p => parseInt(p?.id) === permissionRequiredForRoute)

  const isPageRestricted = pathname !== '/' && !isUserAdmin && !userHasPermission && (pathname in ROUTE_PERMISSIONS_MAP)

  return isPageRestricted
    ? (
      <RestrictedPage />
    )
    : children

}

export default RestrictedRoutes;