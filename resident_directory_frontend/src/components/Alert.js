import React from "react";

// PUBLIC_INTERFACE
export function Alert({ tone = "info", title, children }) {
  /** Simple alert banner. tone: info|success|warning|danger */
  const className =
    tone === "success"
      ? "badge badge-ok"
      : tone === "warning"
        ? "badge badge-warn"
        : tone === "danger"
          ? "badge badge-danger"
          : "badge";

  return (
    <div className="card" role={tone === "danger" ? "alert" : "status"}>
      <div className="card-body">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <span className={className}>{tone.toUpperCase()}</span>
          {title ? <span className="muted">{title}</span> : null}
        </div>
        <div style={{ marginTop: 10 }}>{children}</div>
      </div>
    </div>
  );
}
