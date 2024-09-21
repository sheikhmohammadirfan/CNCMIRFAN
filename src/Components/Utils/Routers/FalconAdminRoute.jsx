import { getUser } from "../../../Service/UserFactory"
import RestrictedPage from "../../Rbac/RestrictedPage"

const FalconAdminRoute = ({ children }) => {

  const isSuperAdmin = getUser()?.is_superuser

  return isSuperAdmin
    ? children
    : <RestrictedPage />
}

export default FalconAdminRoute