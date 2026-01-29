import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getResident } from "../api/residents";
import { Alert } from "../components/Alert";

function displayName(r) {
  return (
    r?.name ||
    [r?.first_name, r?.last_name].filter(Boolean).join(" ") ||
    "(Unnamed)"
  );
}

// PUBLIC_INTERFACE
export function ResidentDetailPage() {
  /** Public profile page for a resident. */
  const { id } = useParams();
  const [resident, setResident] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getResident(id);
        setResident(data);
      } catch (e) {
        setError(e?.message || "Failed to load resident.");
        setResident(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const photoUrl = resident?.photo_url || resident?.photo;

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <Link className="btn btn-ghost" to="/">
          ← Back to Directory
        </Link>
        <span className="badge">{loading ? "LOADING..." : `ID: ${id}`}</span>
      </div>

      {error ? (
        <Alert tone="danger" title="Profile load failed">
          {error}
        </Alert>
      ) : null}

      <div className="card">
        <div className="card-header">
          <div className="row" style={{ alignItems: "center" }}>
            {photoUrl ? <img className="avatar avatar-lg" src={photoUrl} alt={`${displayName(resident)} avatar`} /> : (
              <div className="avatar avatar-lg" aria-hidden="true" />
            )}
            <div>
              <h1 className="card-title" style={{ marginBottom: 0 }}>
                {resident ? displayName(resident) : "Resident Profile"}
              </h1>
              <div className="card-subtitle">
                {resident?.address ? resident.address : "Address unavailable"}{" "}
                {resident?.unit ? `• Unit ${resident.unit}` : ""}
              </div>
            </div>
          </div>
          <div className="badge badge-ok">PUBLIC</div>
        </div>

        <div className="card-body">
          {!resident && !error ? (
            <div className="grid">
              <div className="skeleton" style={{ width: "45%" }} />
              <div className="skeleton" style={{ width: "62%" }} />
              <div className="skeleton" style={{ width: "58%" }} />
            </div>
          ) : null}

          {resident ? (
            <div className="grid">
              <div className="card" style={{ boxShadow: "none", background: "rgba(5,6,10,0.35)" }}>
                <div className="card-body">
                  <table className="table" aria-label="Resident details">
                    <tbody>
                      <tr>
                        <th style={{ width: 160 }}>Contact</th>
                        <td className="muted">
                          {[resident.phone, resident.email].filter(Boolean).join(" • ") || "—"}
                        </td>
                      </tr>
                      <tr>
                        <th>Address</th>
                        <td className="muted">
                          {[resident.address, resident.unit ? `Unit ${resident.unit}` : null]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </td>
                      </tr>
                      <tr>
                        <th>Notes</th>
                        <td className="muted">{resident.notes || "—"}</td>
                      </tr>
                      <tr>
                        <th>Photo URL</th>
                        <td className="muted">{photoUrl || "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="muted">
                Tip: admin actions (edit/delete) are available in <Link to="/admin">Admin</Link> once logged in.
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
