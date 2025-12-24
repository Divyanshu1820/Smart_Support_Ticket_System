import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth";
import { getTickets, deleteTicket as removeTicket } from "../services/tickets";

export default function UserTicket() {
  const navigate = useNavigate();
  const user = auth.getUser();

  const [tickets, setTickets] = useState([]);

  // Filters (Priority removed)
  const [type, setType] = useState("All Types");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Types list (as per your ask)
  const TYPE_OPTIONS = [
    "All Types",
    "Hardware Issues",
    "Software Installation & Updates",
    "Network Connectivity",
    "Access & Permissions",
  ];

  // Load tickets from storage on mount
  useEffect(() => { setTickets(getTickets()); }, []);

  // Filtering
  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const ticketId = (t.ticketId ?? t.id) || "";
      const matchType = type === "All Types" || t.type === type;

      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        ticketId.toLowerCase().includes(q) ||
        (t.type || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.project || "").toLowerCase().includes(q);

      const updatedDateOnly = t.updated?.slice(0, 10);
      const okStart = !startDate || updatedDateOnly >= startDate;
      const okEnd = !endDate || updatedDateOnly <= endDate;

      return matchType && matchQuery && okStart && okEnd;
    });
  }, [tickets, type, query, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const resetPage = () => setPage(1);

  // ✅ Navigate to another page (no modal)
  function goToCreate() {
    navigate("/dashboard/create");
  }

  function handleDelete(idOrTicketId) {
    const next = removeTicket(idOrTicketId);
    setTickets(next);
    resetPage();
  }

  return (
    <section className="page">
      {/* Toolbar */}
      <div className="page-header">
        <button type="button" className="btn primary pill" onClick={goToCreate}>
          Create Ticket
        </button>
        <span className="muted">
          Signed in as <strong>{user?.email}</strong>
        </span>
      </div>

      {/* Filters (box) */}
      <div className="panel panel--soft">
        <div className="filters-grid" style={{ gridTemplateColumns: "200px 1fr 220px 220px" }}>
          <select className="input" value={type} onChange={e => { setType(e.target.value); resetPage(); }}>
            {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>

          <input
            className="input"
            type="text"
            placeholder="Search by Ticket ID, Type, Description, Project"
            value={query}
            onChange={e => { setQuery(e.target.value); resetPage(); }}
          />

          <div className="input-group">
            <label className="label">Start Date</label>
            <input className="input" type="date" value={startDate} onChange={e => { setStartDate(e.target.value); resetPage(); }} />
          </div>

          <div className="input-group">
            <label className="label">End Date</label>
            <input className="input" type="date" value={endDate} onChange={e => { setEndDate(e.target.value); resetPage(); }} />
          </div>
        </div>
      </div>

      {/* Table (box) */}
      <div className="panel panel--soft">
        <div className="table-responsive">
          <table className="table table--dark">
            <thead>
              <tr>
                <th style={{ width: "16%" }}>Ticket ID</th>
                <th style={{ width: "16%" }}>Type</th>
                <th>Description</th>
                <th style={{ width: "18%" }}>ProjectName</th>
                <th style={{ width: "16%" }}>Status</th>
                <th style={{ width: "18%" }}>Updated Date ^</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-row">
                    No tickets yet. Click <strong>Create Ticket</strong> to add your first ticket.
                  </td>
                </tr>
              ) : (
                currentRows.map(row => {
                  const ticketId = row.ticketId ?? row.id;
                  return (
                    <tr key={ticketId}>
                      <td><a className="link" href={"#" + ticketId}>{ticketId}</a></td>
                      <td>{row.type}</td>
                      <td>{row.description}</td>
                      <td>{row.project}</td>
                      <td>{row.status}</td>
                      <td>{row.updated}</td>
                      <td>
                        <button
                          type="button"
                          className="btn danger pill"
                          onClick={() => handleDelete(ticketId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="pagination">
            <button type="button" className="btn ghost pill" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                type="button"
                key={i}
                className={`btn pill ${page === i + 1 ? "primary" : "ghost"}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button type="button" className="btn ghost pill" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
