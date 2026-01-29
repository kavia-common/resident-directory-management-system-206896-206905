import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export function NotFoundPage() {
  /** 404 page. */
  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <div>
            <h1 className="card-title">404 — Signal Lost</h1>
            <div className="card-subtitle">That route does not exist.</div>
          </div>
          <span className="badge badge-danger">NOT FOUND</span>
        </div>
        <div className="card-body">
          <div className="row">
            <Link className="btn btn-primary" to="/">
              Go to Directory
            </Link>
            <Link className="btn btn-ghost" to="/admin">
              Go to Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
