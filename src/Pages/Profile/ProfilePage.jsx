import Cookies from "universal-cookie";
import "./Profile.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function ProfilePage() {
  // set active link
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  // update active link based on current location
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  // get token from cookie
  const cookie = new Cookies();
  const token = cookie.get("JWT");

  // initialize user to set the data onto (we got the data from the cookie)
  const [user, setUser] = useState({});

  useEffect(() => {
    if (token && token !== "undefined") {
      // Decode the token
      const decodedToken = jwtDecode(token);

      // save the user's data
      setUser(decodedToken);
    } else {
      setUser({});
    }
  }, []);

  return (
    <div className="profile">
      <div className="container">
        <div className="user-data">
          <img src={user.image} alt="" />
          <div className="details">
            <h2>Hello {user.name}!</h2>
            <p>
              Here you can edit your profile, track your reservations with
              Padelo.
            </p>
          </div>
        </div>
        <ul>
          <li className={activeLink === "/profile/history" ? "active" : ""}>
            <Link to={"/profile/history"}>History</Link>
          </li>
          <li className={activeLink === "/profile/settings" ? "active" : ""}>
            <Link to={"/profile/settings"}>Settings</Link>
          </li>
        </ul>
        <div className="outlet-box">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
