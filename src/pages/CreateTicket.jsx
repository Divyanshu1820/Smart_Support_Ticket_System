import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTicket, nextTicketId } from "../services/tickets";
import { auth } from "../auth";

export default function CreateTicket() {
  const navigate = useNavigate();
  const user = auth.getUser();

  const [ticketId, setTicketId] = useState("U1");
  const [form, setForm] = useState({
    type: "",
    description: "",
    project: "",
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    setTicketId(nextTicketId());
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!ticketId || !form.type) {
      setErr("Please select Type.");
      return;
    }

    const updated = new Date().toISOString().slice(0, 19).replace("T", " ");

    addTicket({
      id: ticketId,
      ticketId,
      type: form.type,
      description: form.description || "",
      project: form.project || "",
      status: "Acknowledged",
      updated,
      createdBy: user?.email || "",
    });

    navigate("/dashboard", { replace: true });
  }

  return (
    <section className="page">
      <div className="panel" style={{ maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 12 }}>Create Ticket</h2>
        {err && <div className="error">{err}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Ticket ID</span>
            <input className="input" type="text" value={ticketId} readOnly />
          </label>

          <label className="field">
            <span>Type*</span>
            <select
              className="input"
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select</option>
              <option value="Hardware Issues">Hardware Issues</option>
              <option value="Software Installation & Updates">Software Installation & Updates</option>
              <option value="Network Connectivity">Network Connectivity</option>
              <option value="Access & Permissions">Access & Permissions</option>
            </select>
          </label>

          <label className="field">
            <span>Description</span>
            <textarea
              className="input"
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Project</span>
            <input
              className="input"
              type="text"
              name="project"
              value={form.project}
              onChange={handleChange}
            />
          </label>

          <div className="form-row form-row--inline" style={{ justifyContent: "flex-end", gap: 8 }}>
            <button type="button" className="btn ghost pill" onClick={() => navigate("/dashboard")}>
              Cancel
            </button>
            <button type="submit" className="btn primary pill">
              Save Ticket
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
