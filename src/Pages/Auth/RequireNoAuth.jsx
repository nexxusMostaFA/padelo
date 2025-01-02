import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

export default function RequireNoAuth() {
  // Get The Token From Cookies
  const cookie = new Cookies();
  const token = cookie.get("JWT");

  const location = useLocation();

  // If There's a Token User Won't access auth pages, else user will need to login.
  return token ? (
    <Navigate state={{ from: location }} replace to="/" />
  ) : (
    <Outlet />
  );
}
