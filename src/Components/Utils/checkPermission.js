import { getUser } from "../../Service/UserFactory";

export default function checkPermissionById(requiredPermissionId) {
  const user = getUser();
  const isUserAdmin = user?.roles[0]?.id === 1
  const permissions = user?.roles[0]?.permissions;
  const userHasPermission = isUserAdmin || Boolean(permissions.find(p => parseInt(p.id) === requiredPermissionId));

  return userHasPermission
}