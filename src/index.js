import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./index.css";

// Auth Controllers
import UserProvider from "./Context/UserContext";
import RequireAuth from "./Pages/Auth/RequireAuth";
import RequireNoAuth from "./Pages/Auth/RequireNoAuth";
import PersistLogin from "./Pages/Auth/PersistLogin";

// Header
import Header from "./Components/Header/Header";

// Website Pages
import Login from "./Pages/Auth/LoginPage";
import Register from "./Pages/Auth/RegisterPage";
import HomePage from "./Pages/HomePage";
import Courts from "./Pages/CourtsPage";
import ContactUs from "./Pages/ContactUsPage";
import Profile from "./Pages/Profile/ProfilePage";
import Admin from "./Pages/AdminsPage";
import Reservation from "./Pages/ReservationPage";
import History from "./Components/Profile/History";
import AccountSettings from "./Components/Profile/AccountSettings";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPasswordPage";

// Layouts, main with header, auth without
const MainLayout = () => (
  <>
    <Header />
    <Outlet />
  </>
);
const AuthLayout = () => (
  <>
    <Outlet />
  </>
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth Routes (No Header) */}
          <Route element={<AuthLayout />}>
            {/* Redirect User to Home page if he's authenticated */}
            <Route element={<RequireNoAuth />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/ForgetPassword" element={<ForgetPassword />} />
              <Route path="/ResetPassword/:token" element={<ResetPassword />} />
            </Route>
          </Route>
          {/* Main Routes (With Header) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courts" element={<Courts />} />
            <Route path="/contactUs" element={<ContactUs />} />
            {/* Protected Paths: Requires Auth */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth />}>
                <Route path="/profile" element={<Profile />}>
                  <Route path="history" element={<History />} />
                  <Route path="settings" element={<AccountSettings />} />
                </Route>
                <Route path="/admin" element={<Admin />} />
                <Route path="/reservation/:id" element={<Reservation />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);
