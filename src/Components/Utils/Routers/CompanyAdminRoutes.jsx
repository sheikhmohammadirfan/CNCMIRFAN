import React from 'react'
import { getUser } from '../../../Service/UserFactory'
import RestrictedPage from '../../Rbac/RestrictedPage';

const CompanyAdminRoutes = ({ children }) => {

  const user = getUser();

  return user?.roles[0]?.id === 1
    ? children
    : <RestrictedPage />
}

export default CompanyAdminRoutes