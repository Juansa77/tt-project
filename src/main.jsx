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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/games" element={<GameSearch />} />
        <Route path="/search-friends" element={<FriendSearchPage />} />
        <Route path="/places" element={<PlacesPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
