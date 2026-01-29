import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
export function Navbar({ isAdmin, onLogout }) {
  /** App navigation bar with admin status and logout control. */
  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="brand">
          <div className="brand-title">Resident Directory</div>
          <div className="brand-subtitle">Retro UI • Search • Profiles • Admin CRUD</div>
        </div>
        <div className="nav-links" aria-label="Primary navigation">
          <NavLink className="pill" to="/" end>
            Directory
          </NavLink>
          <NavLink className="pill" to="/admin">
            Admin
          </NavLink>
          <span className={isAdmin ? "badge badge-ok" : "badge badge-warn"}>
            {isAdmin ? "ADMIN: ON" : "ADMIN: OFF"}
          </span>
          {isAdmin ? (
            <button className="pill" onClick={onLogout} type="button">
              Logout
            </button>
          ) : (
            <NavLink className="pill" to="/login">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
