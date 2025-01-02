import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

export default function RequireAuth() {
  // Get The Token From Cookies
  const cookie = new Cookies();
  const token = cookie.get("JWT");

  const location = useLocation();

  // If There's no Token User will need to login firs to access protected pages
  return token ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to="/Login" />
  );
}
