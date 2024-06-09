import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '@/hooks/use-auth';
import { ReactNode } from 'react';
import { routes } from '@/config/routes';

interface RequireAuthProps {
  children: ReactNode;
  allowedRoles: string[];
}
function RequireAuth ({ allowedRoles, children }: RequireAuthProps) {

  const { auth } = useAuth();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username")

  return allowedRoles?.includes(auth.role ?? role) ? 
    <>
      { children }
    </> : auth.username ?? username ? (
    <Navigate to={routes.accessDenied} state={{ from: location }} replace />
  ) : (
    <Navigate to={routes.auth.signIn} state={{ from: location }} replace />
  );
};

export default RequireAuth;
