
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth";

// --- Helper: normalize backend date to yyyy-mm-dd for filtering ---
function toYMD(dateStr) {
  // Accepts "2025-05-24 02:03", "2025/05/24", "2025-05-24T02:03:00Z"
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (!isNaN(d)) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }
    // Fallback: attempt simple slice/replace
    return dateStr.slice(0, 10).replace(/\//g, "-");
  } catch {
    return dateStr.slice(0, 10).replace(/\//g, "-");
  }
}

export default function UserTickets() {
  const nav = useNavigate();
  const user = auth.getUser();

  // Filters
  const [type, setType] = useState("All Types");
  const [priority, setPriority] = useState("All Priority");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
  const [endDate, setEndDate] = useState("");

  // Data, UX states & pagination
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // --- Load user’s tickets from backend ---
  useEffect(() => {
    let cancelled = false;
    const abort = new AbortController();

    async function load() {
      setLoading(true);
      setErr("");
      try {
        // If you use cookies for auth, you can skip Authorization header
        const token = localStorage.getItem("token"); // optional
        const res = await fetch(`/api/tickets?me=true`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
          signal: abort.signal,
          credentials: "include", // keep cookies if you use cookie auth
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Failed to load tickets (${res.status})`);
        }
        const data = await res.json();
        // Expect array of { id, title, type, description, priority, projectName, assignedTo, status, updatedAt }
        if (!cancelled) {
          setTickets(Array.isArray(data) ? data : []);
          setPage(1); // reset to first page on new load
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || "Unable to load tickets");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();

    return () => {
      cancelled = true;
      abort.abort();
    };
  }, []); // load on mount; add deps if you want to reload on filter change

  // --- Filter options; derive from data so they match your backend values ---
  const TYPES = useMemo(() => {
    const set = new Set(tickets.map(t => t.type).filter(Boolean));
    return ["All Types", ...Array.from(set)];
  }, [tickets]);

  const PRIORITIES = useMemo(() => {
    const set = new Set(tickets.map(t => t.priority).filter(Boolean));
    return ["All Priority", ...Array.from(set)];
  }, [tickets]);

  // --- Filtered results ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tickets.filter(t => {
      const matchesType = type === "All Types" || t.type === type;
      const matchesPriority = priority === "All Priority" || t.priority === priority;
      const matchesQuery =
        !q ||
        (t.title || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.projectName || "").toLowerCase().includes(q);

      const updated = toYMD(t.updatedAt);
      const afterStart = !startDate || (updated && updated >= startDate);
      const beforeEnd = !endDate || (updated && updated <= endDate);

      return matchesType && matchesPriority && matchesQuery && afterStart && beforeEnd;
    });
  }, [tickets, type, priority, query, startDate, endDate]);

  // --- Pagination ---
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const startIdx = (page - 1) * pageSize;
    return filtered.slice(startIdx, startIdx + pageSize);
  }, [filtered, page]);

  // Keep page in bounds (e.g., after delete)
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  // --- Actions ---
  const logout = () => {
    auth.logout();
    nav("/login", { replace: true });
  };

  const deleteTicket = async (id) => {
    if (!confirm(`Delete ticket ${id}?`)) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Failed to delete (${res.status})`);
      }
      setTickets(prev => prev.filter(t => t.id !== id));
    } catch (e) {
      alert(e.message || "Unable to delete ticket");
    }
  };

  const goToCreate = () => {
    nav("/ticket");
  };

  return (
    <div className="tickets-page">
      {/* Header */}
      <header className="tickets-header">
        <button className="btn primary" onClick={goToCreate}>Create Ticket</button>
        <div className="tickets-right">
          <span className="status">Signed in as {user?.email || "user"}</span>
          <button className="btn logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

    
{/* Filters bar */}
<section className="filters-bar">
  <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
    {TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>

  <select className="filter-select" value={priority} onChange={e => setPriority(e.target.value)}>
    {PRIORITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
  </select>

  <input
    className="filter-input"
    type="text"
    placeholder="Search by Title, Description or Project"
    value={query}
    onChange={e => setQuery(e.target.value)}
  />

  <div className="date-field">
    <label>Start Date</label>
    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
  </div>

  <div className="date-field">
    <label>End Date</label>
    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
  </div>
</section>

      {/* Table / states */}
      <section className="tickets-table-card">
        {loading ? (
          <div className="empty">Loading tickets…</div>
        ) : err ? (
          <div className="empty" role="alert">Error: {err}</div>
        ) : (
          <>
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>ProjectName</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Updated Date ↑</th>
                  <th style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={9} className="empty">No tickets found</td></tr>
                ) : (
                  paged.map(t => (
                    <tr key={t.id}>
                      <td>
                        <button
                          className="link-like"
                          onClick={() => nav(`/tickets/${encodeURIComponent(t.id)}`)}
                          title="Open details"
                        >
                          {t.title || t.id}
                        </button>
                      </td>
                      <td>{t.type}</td>
                      <td>{t.description}</td>
                      <td>{t.priority}</td>
                      <td>{t.projectName}</td>
                      <td>{t.assignedTo}</td>
                      <td>{t.status}</td>
                      <td>{t.updatedAt}</td>
                      <td>
                        <button className="btn danger" onClick={() => deleteTicket(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination">
              <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`page-btn ${n === page ? "active" : ""}`}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}
              <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
