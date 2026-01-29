import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth";
import { Alert } from "../components/Alert";

// PUBLIC_INTERFACE
export function LoginPage({ onLoggedIn }) {
  /** Admin login page. */
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await loginAdmin({ username, password });
      onLoggedIn?.();
      navigate("/admin");
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="grid grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <h1 className="card-title">Admin Login</h1>
              <div className="card-subtitle">Authenticate to unlock CRUD actions</div>
            </div>
            <span className="badge badge-warn">LOCKED</span>
          </div>
          <div className="card-body">
            {error ? (
              <div style={{ marginBottom: 12 }}>
                <Alert tone="danger" title="Auth">
                  {error}
                </Alert>
              </div>
            ) : null}

            <form onSubmit={handleSubmit}>
              <div className="grid" style={{ gap: 12 }}>
                <div className="field">
                  <label htmlFor="username">Username / Email</label>
                  <input
                    id="username"
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="row" style={{ justifyContent: "flex-end" }}>
                  <button className="btn btn-primary" type="submit" disabled={busy}>
                    {busy ? "Logging in..." : "Login"}
                  </button>
                </div>
              </div>
            </form>

            <hr className="hr" />
            <div className="muted">
              Backend expected endpoint: <span className="kbd">POST /auth/login</span> returning{" "}
              <span className="kbd">{"{ token }"}</span> or <span className="kbd">{"{ access_token }"}</span>.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Security Notes</h2>
              <div className="card-subtitle">Token stored in localStorage</div>
            </div>
            <span className="badge">INFO</span>
          </div>
          <div className="card-body">
            <div className="muted">
              <p>
                This app stores the admin token in <span className="kbd">localStorage</span>. For production,
                consider httpOnly cookies + CSRF protection on the backend.
              </p>
              <p>
                If you see 401 errors in Admin, verify the backend accepts <span className="kbd">Authorization: Bearer &lt;token&gt;</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
