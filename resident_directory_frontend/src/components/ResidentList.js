import React, { useMemo } from "react";
import { Link } from "react-router-dom";

function norm(v) {
  return String(v || "").toLowerCase().trim();
}

// PUBLIC_INTERFACE
export function ResidentList({ residents, query }) {
  /** Renders residents list (filtered) with link to detail pages. */
  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return residents || [];
    return (residents || []).filter((r) => {
      const haystack = [
        r.name,
        r.first_name,
        r.last_name,
        r.address,
        r.unit,
        r.phone,
        r.email,
      ]
        .filter(Boolean)
        .map(norm)
        .join(" | ");
      return haystack.includes(q);
    });
  }, [residents, query]);

  if (!residents) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="skeleton" style={{ width: "55%" }} />
          <div className="skeleton" style={{ width: "75%", marginTop: 10 }} />
          <div className="skeleton" style={{ width: "68%", marginTop: 10 }} />
        </div>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="muted">No residents matched your search.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">Residents</h2>
          <div className="card-subtitle">
            Showing {filtered.length} / {(residents || []).length}
          </div>
        </div>
        <div className="badge">{query ? `filter: "${query}"` : "filter: (none)"}</div>
      </div>
      <div className="card-body">
        <table className="table" role="table" aria-label="Resident list">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Contact</th>
              <th style={{ width: 140 }}>Profile</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const id = r.id ?? r._id ?? r.resident_id;
              const name =
                r.name ||
                [r.first_name, r.last_name].filter(Boolean).join(" ") ||
                "(Unnamed)";
              const address = [r.address, r.unit ? `Unit ${r.unit}` : null]
                .filter(Boolean)
                .join(", ");
              const contact = [r.phone, r.email].filter(Boolean).join(" • ");
              return (
                <tr key={String(id ?? name)}>
                  <td>{name}</td>
                  <td className="muted">{address || "—"}</td>
                  <td className="muted">{contact || "—"}</td>
                  <td>
                    {id ? (
                      <Link className="btn btn-ghost" to={`/residents/${encodeURIComponent(String(id))}`}>
                        View
                      </Link>
                    ) : (
                      <span className="muted">No id</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
