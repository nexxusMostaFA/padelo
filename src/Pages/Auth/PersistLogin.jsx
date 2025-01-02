import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { User } from "../../Context/UserContext";
import Cookies from "universal-cookie";
import { FaSpinner } from "react-icons/fa";

export default function PersistLogin() {
  // Loading Screen
  const [loading, setLoading] = useState(true);

  // User Context (to get current token & data from)
  const user = useContext(User);
  console.log(user);
  // Define Cookie to get the token from (Token has been already saved to cookies on Login / Register)
  const cookie = new Cookies();

  useEffect(() => {
    // Refresh user's data if token exists in cookies
    async function refresh() {
      try {
        // Retrieve Token From Cookies
        const getToken = cookie.get("JWT");

        if (getToken) {
          // Simulate refreshing user data
          const fetchedUserData = user.auth.userData || {}; // Use existing data if available

          // Update context & maintain authentication
          user.setAuth({ token: getToken, userData: fetchedUserData });
          console.log("Updated user context with token and data.");
        } else {
          console.log(
            "No token found in cookies. User remains unauthenticated."
          );
        }
      } catch (error) {
        console.error("Error during token refresh:", error);
      } finally {
        setLoading(false);
      }
    }

    refresh();
  }, []);

  // If loading, show the spinner
  if (loading) {
    return (
      <div className="main-spinner-container">
        <FaSpinner className="main-spinner" />
        <p>Loading...</p>
      </div>
    );
  }
  return <Outlet />;
}
