import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { clearToken, getStoredToken } from "./api/auth";
import { Navbar } from "./components/Navbar";
import { AdminPage } from "./pages/AdminPage";
import { DirectoryPage } from "./pages/DirectoryPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ResidentDetailPage } from "./pages/ResidentDetailPage";

// PUBLIC_INTERFACE
function App() {
  /** Main application entry with routing and admin session state. */
  const [token, setToken] = useState(() => getStoredToken());
  const isAdmin = useMemo(() => Boolean(token), [token]);

  // Keyboard shortcut: "/" focuses the directory search input if present.
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const active = document.activeElement;
        const isTyping =
          active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
        if (isTyping) return;
        const el = document.getElementById("search");
        if (el && typeof el.focus === "function") {
          e.preventDefault();
          el.focus();
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleLogout() {
    clearToken();
    setToken(null);
  }

  function handleLoggedIn() {
    setToken(getStoredToken());
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<DirectoryPage />} />
          <Route path="/residents/:id" element={<ResidentDetailPage />} />
          <Route path="/login" element={<LoginPage onLoggedIn={handleLoggedIn} />} />
          <Route path="/admin" element={<AdminPage token={token} isAdmin={isAdmin} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <div className="footer">
          <div>REACT_APP_API_BASE: {process.env.REACT_APP_API_BASE || "(not set)"}</div>
          <div>Build: {process.env.REACT_APP_NODE_ENV || process.env.NODE_ENV}</div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
