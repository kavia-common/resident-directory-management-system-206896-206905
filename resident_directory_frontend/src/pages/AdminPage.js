import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { createResident, deleteResident, listResidents, updateResident } from "../api/residents";
import { Alert } from "../components/Alert";
import { ResidentForm } from "../components/ResidentForm";

function getId(r) {
  return r?.id ?? r?._id ?? r?.resident_id ?? null;
}

function displayName(r) {
  return r?.name || [r?.first_name, r?.last_name].filter(Boolean).join(" ") || "(Unnamed)";
}

// PUBLIC_INTERFACE
export function AdminPage({ token, isAdmin }) {
  /** Admin-only CRUD console for residents. */
  const [residents, setResidents] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("idle"); // idle|create|edit
  const [active, setActive] = useState(null);
  const [busy, setBusy] = useState(false);

  const canUse = Boolean(isAdmin && token);

  async function load() {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const data = await listResidents();
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

  const sorted = useMemo(() => {
    const arr = [...(residents || [])];
    arr.sort((a, b) => displayName(a).localeCompare(displayName(b)));
    return arr;
  }, [residents]);

  async function handleCreate(values) {
    if (!canUse) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const created = await createResident(token, values);
      setNotice("Resident created.");
      setMode("idle");
      setActive(null);
      // If backend returns created object, merge; otherwise reload.
      if (created && typeof created === "object") {
        await load();
      } else {
        await load();
      }
    } catch (e) {
      setError(e?.message || "Create failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleEdit(values) {
    if (!canUse) return;
    const id = getId(active);
    if (!id) {
      setError("Cannot update: resident id missing.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await updateResident(token, id, values);
      setNotice("Resident updated.");
      setMode("idle");
      setActive(null);
      await load();
    } catch (e) {
      setError(e?.message || "Update failed.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(r) {
    if (!canUse) return;
    const id = getId(r);
    if (!id) {
      setError("Cannot delete: resident id missing.");
      return;
    }
    const ok = window.confirm(`Delete resident "${displayName(r)}"? This cannot be undone.`);
    if (!ok) return;

    setBusy(true);
    setError("");
    setNotice("");
    try {
      await deleteResident(token, id);
      setNotice("Resident deleted.");
      await load();
    } catch (e) {
      setError(e?.message || "Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="grid grid-2">
        <div className="grid">
          <div className="card">
            <div className="card-header">
              <div>
                <h1 className="card-title">Admin Console</h1>
                <div className="card-subtitle">Create • Edit • Delete residents</div>
              </div>
              <span className={canUse ? "badge badge-ok" : "badge badge-danger"}>
                {canUse ? "AUTHORIZED" : "UNAUTHORIZED"}
              </span>
            </div>
            <div className="card-body">
              {!canUse ? (
                <Alert tone="warning" title="Login required">
                  You must <Link to="/login">log in</Link> to use admin actions.
                </Alert>
              ) : (
                <div className="row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setMode("create");
                      setActive(null);
                      setError("");
                      setNotice("");
                    }}
                    disabled={busy}
                  >
                    + Add Resident
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={load} disabled={loading || busy}>
                    {loading ? "Refreshing..." : "Refresh"}
                  </button>
                  <span className="badge">{(residents || []).length} residents</span>
                </div>
              )}
            </div>
          </div>

          {error ? (
            <Alert tone="danger" title="Admin error">
              {error}
            </Alert>
          ) : null}
          {notice ? (
            <Alert tone="success" title="OK">
              {notice}
            </Alert>
          ) : null}

          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Resident Records</h2>
                <div className="card-subtitle">Select a record to edit or delete</div>
              </div>
              <span className="badge">{loading ? "SYNC..." : "READY"}</span>
            </div>
            <div className="card-body">
              {!residents ? (
                <div className="grid">
                  <div className="skeleton" style={{ width: "72%" }} />
                  <div className="skeleton" style={{ width: "80%" }} />
                  <div className="skeleton" style={{ width: "66%" }} />
                </div>
              ) : (
                <table className="table" aria-label="Admin residents table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                      <th style={{ width: 220 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((r) => {
                      const id = getId(r);
                      return (
                        <tr key={String(id ?? displayName(r))}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{displayName(r)}</div>
                            <div className="muted" style={{ marginTop: 4 }}>
                              {[r.phone, r.email].filter(Boolean).join(" • ") || "—"}
                            </div>
                          </td>
                          <td className="muted">
                            {[r.address, r.unit ? `Unit ${r.unit}` : null].filter(Boolean).join(", ") || "—"}
                          </td>
                          <td>
                            <div className="row">
                              {id ? (
                                <Link className="btn btn-ghost" to={`/residents/${encodeURIComponent(String(id))}`}>
                                  View
                                </Link>
                              ) : (
                                <span className="muted">No id</span>
                              )}
                              <button
                                type="button"
                                className="btn"
                                disabled={!canUse || busy}
                                onClick={() => {
                                  setMode("edit");
                                  setActive(r);
                                  setError("");
                                  setNotice("");
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                disabled={!canUse || busy}
                                onClick={() => handleDelete(r)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        <div className="grid">
          {mode === "create" ? (
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Add Resident</h2>
                  <div className="card-subtitle">Create a new record</div>
                </div>
                <span className="badge badge-ok">CREATE</span>
              </div>
              <div className="card-body">
                <ResidentForm
                  initialValues={null}
                  submitLabel="Create"
                  onSubmit={handleCreate}
                  onCancel={() => {
                    setMode("idle");
                    setActive(null);
                  }}
                  busy={busy}
                />
              </div>
            </div>
          ) : null}

          {mode === "edit" ? (
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Edit Resident</h2>
                  <div className="card-subtitle">{displayName(active)}</div>
                </div>
                <span className="badge badge-warn">EDIT</span>
              </div>
              <div className="card-body">
                <ResidentForm
                  initialValues={active}
                  submitLabel="Save"
                  onSubmit={handleEdit}
                  onCancel={() => {
                    setMode("idle");
                    setActive(null);
                  }}
                  busy={busy}
                />
              </div>
            </div>
          ) : null}

          {mode === "idle" ? (
            <div className="card">
              <div className="card-header">
                <div>
                  <h2 className="card-title">Ops Panel</h2>
                  <div className="card-subtitle">Select “Add” or “Edit” to begin</div>
                </div>
                <span className="badge">IDLE</span>
              </div>
              <div className="card-body">
                <div className="muted">
                  <p>
                    Admin operations require a valid token. If your backend uses different auth, adjust <span className="kbd">src/api/auth.js</span>.
                  </p>
                  <p>
                    Endpoints assumed: <span className="kbd">/residents</span> and <span className="kbd">/residents/:id</span>.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="card">
            <div className="card-header">
              <div>
                <h2 className="card-title">Diagnostics</h2>
                <div className="card-subtitle">Quick troubleshooting</div>
              </div>
              <span className="badge">HELP</span>
            </div>
            <div className="card-body">
              <div className="muted">
                <ul>
                  <li>If Admin shows UNAUTHORIZED after login, backend may use a different token field.</li>
                  <li>If CRUD fails with 404, adjust paths in <span className="kbd">src/api/residents.js</span>.</li>
                  <li>If you get CORS errors, enable CORS on backend for the frontend origin.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
