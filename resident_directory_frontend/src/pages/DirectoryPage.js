import React, { useEffect, useMemo, useState } from "react";
import { listResidents } from "../api/residents";
import { ResidentList } from "../components/ResidentList";
import { Alert } from "../components/Alert";

// PUBLIC_INTERFACE
export function DirectoryPage() {
  /** Public directory: browse/search residents. */
  const [query, setQuery] = useState("");
  const [residents, setResidents] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await listResidents();
      // Normalize: backend might wrap in {items: []}
      const items = Array.isArray(data) ? data : data?.items || data?.results || [];
      setResidents(items);
    } catch (e) {
      setError(e?.message || "Failed to load residents.");
      setResidents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const total = residents ? residents.length : 0;
    return { total };
  }, [residents]);

  return (
    <div className="container">
      <div className="grid grid-2">
        <div className="grid">
          <div className="card">
            <div className="card-header">
              <div>
                <h1 className="card-title">Directory Console</h1>
                <div className="card-subtitle">
                  Browse & search residents • <span className="kbd">/</span> focuses search
                </div>
              </div>
              <div className="badge">{loading ? "SYNCING..." : `TOTAL: ${stats.total}`}</div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="field" style={{ flex: 1, minWidth: 260 }}>
                  <label htmlFor="search">Search</label>
                  <input
                    id="search"
                    className="input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a name, address, unit, phone, email..."
                  />
                </div>
                <button className="btn btn-ghost" type="button" onClick={load} disabled={loading}>
                  Refresh
                </button>
              </div>
              <div className="muted" style={{ marginTop: 10 }}>
                Tip: search is client-side. If your backend supports server search, wire it in via <span className="kbd">listResidents</span>.
              </div>
            </div>
          </div>

          {error ? (
            <Alert tone="danger" title="Network">
              {error}
            </Alert>
          ) : null}

          <ResidentList residents={residents} query={query} />
        </div>

        <div className="grid">
          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Quick Help</h2>
                <div className="card-subtitle">Where am I? What can I do?</div>
              </div>
              <div className="badge">v1</div>
            </div>
            <div className="card-body">
              <div className="muted">
                <p>
                  This is the public directory. Anyone can browse resident profiles.
                </p>
                <p>
                  Admins can log in to add, edit, or remove residents from the <strong>Admin</strong> page.
                </p>
                <hr className="hr" />
                <div className="row">
                  <span className="badge badge-warn">ADMIN</span>
                  <span className="muted">
                    Login required for CRUD actions.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Backend Config</h2>
                <div className="card-subtitle">Environment wiring</div>
              </div>
              <div className="badge">REACT_APP_*</div>
            </div>
            <div className="card-body">
              <div className="muted">
                API base is configured via <span className="kbd">REACT_APP_API_BASE</span> (fallback{" "}
                <span className="kbd">REACT_APP_BACKEND_URL</span>).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
