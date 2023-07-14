import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FriendSearchPage from "./assets/src/pages/FriendSearchPage/FriendSearchPage.jsx";
import Home from "./assets/src/pages/HomePage/Home.jsx";
import PlacesPage from "./assets/src/pages/PlacesPage/PlacesPage.jsx";
import GameSearch from "./assets/src/pages/GameSearch/GameSearch.jsx";
import NavBar from "./assets/src/components/NavBar/NavBar.jsx";
import { AuthContextProvider } from "./assets/src/contexts/authContext.jsx";
import Register from "./assets/src/pages/RegisterPage/Register.jsx";
import Login from "./assets/src/pages/Login/Login.jsx";
import CheckCode from "./assets/src/pages/CheckCode/CheckCode.jsx";
import Profile from "./assets/src/pages/ProfilePage/Profile.jsx";
import ForgotPassword from "./assets/src/pages/ForgotPassword/ForgotPassword.jsx";
import ChangePassword from "./assets/src/pages/ChangePassword/ChangePassword.jsx";
import ProtectedRoute from "./assets/src/components/ProtectedRoute.jsx";
import ProtectedCheckChildren from "./assets/src/components/ProtectedRouteChildren.jsx";






ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/games" element={<GameSearch />} />
          <Route path="/search-friends" element={<FriendSearchPage />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verifyCode" element={<ProtectedCheckChildren><CheckCode /></ProtectedCheckChildren>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /> </ProtectedRoute>} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/passwordchange" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
