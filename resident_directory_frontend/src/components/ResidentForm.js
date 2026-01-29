import React, { useMemo, useState } from "react";

function withDefaults(initial) {
  return {
    name: initial?.name || "",
    first_name: initial?.first_name || "",
    last_name: initial?.last_name || "",
    address: initial?.address || "",
    unit: initial?.unit || "",
    phone: initial?.phone || "",
    email: initial?.email || "",
    photo_url: initial?.photo_url || initial?.photo || "",
    notes: initial?.notes || "",
  };
}

function validate(values) {
  const errors = {};
  const name = (values.name || "").trim();
  const first = (values.first_name || "").trim();
  const last = (values.last_name || "").trim();

  if (!name && !(first && last)) {
    errors.identity = "Provide either 'Name' or both 'First name' and 'Last name'.";
  }
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Email format looks invalid.";
  }
  if (values.photo_url && !/^https?:\/\//i.test(values.photo_url)) {
    errors.photo_url = "Photo URL should start with http:// or https://";
  }
  return errors;
}

// PUBLIC_INTERFACE
export function ResidentForm({ initialValues, submitLabel, onSubmit, onCancel, busy }) {
  /** Form for creating/updating a resident. */
  const [values, setValues] = useState(() => withDefaults(initialValues));
  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validate(values), [values]);

  const canSubmit = Object.keys(errors).length === 0;

  function setField(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      name: true,
      first_name: true,
      last_name: true,
      email: true,
      photo_url: true,
    });
    if (!canSubmit) return;
    await onSubmit(values);
  }

  const identityError = touched.name || touched.first_name || touched.last_name ? errors.identity : null;

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid" style={{ gap: 12 }}>
        <div className="row">
          <div className="field">
            <label htmlFor="name">Name (single field)</label>
            <input
              id="name"
              className="input"
              value={values.name}
              onChange={(e) => setField("name", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              placeholder="e.g., Alex Johnson"
            />
          </div>
          <div className="field">
            <label htmlFor="first_name">First name</label>
            <input
              id="first_name"
              className="input"
              value={values.first_name}
              onChange={(e) => setField("first_name", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, first_name: true }))}
              placeholder="e.g., Alex"
            />
          </div>
          <div className="field">
            <label htmlFor="last_name">Last name</label>
            <input
              id="last_name"
              className="input"
              value={values.last_name}
              onChange={(e) => setField("last_name", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, last_name: true }))}
              placeholder="e.g., Johnson"
            />
          </div>
        </div>

        {identityError ? <div className="error">{identityError}</div> : null}

        <div className="row">
          <div className="field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              className="input"
              value={values.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="field" style={{ maxWidth: 220 }}>
            <label htmlFor="unit">Unit</label>
            <input
              id="unit"
              className="input"
              value={values.unit}
              onChange={(e) => setField("unit", e.target.value)}
              placeholder="e.g., 4B"
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              className="input"
              value={values.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="e.g., (555) 123-4567"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              value={values.email}
              onChange={(e) => setField("email", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              placeholder="e.g., alex@example.com"
              inputMode="email"
            />
            {touched.email && errors.email ? <div className="error">{errors.email}</div> : null}
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="photo_url">Photo URL</label>
            <input
              id="photo_url"
              className="input"
              value={values.photo_url}
              onChange={(e) => setField("photo_url", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, photo_url: true }))}
              placeholder="https://..."
              inputMode="url"
            />
            {touched.photo_url && errors.photo_url ? (
              <div className="error">{errors.photo_url}</div>
            ) : null}
          </div>
        </div>

        <div className="field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            className="textarea"
            value={values.notes}
            onChange={(e) => setField("notes", e.target.value)}
            placeholder="Optional notes..."
          />
        </div>

        <div className="row" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button className="btn btn-primary" type="submit" disabled={!canSubmit || busy}>
            {busy ? "Working..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
