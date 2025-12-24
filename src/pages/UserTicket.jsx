
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../auth";

// // --- Helper: normalize backend date to yyyy-mm-dd for filtering ---
// function toYMD(dateStr) {
//   // Accepts "2025-05-24 02:03", "2025/05/24", "2025-05-24T02:03:00Z"
//   if (!dateStr) return "";
//   try {
//     const d = new Date(dateStr);
//     if (!isNaN(d)) {
//       const y = d.getFullYear();
//       const m = String(d.getMonth() + 1).padStart(2, "0");
//       const day = String(d.getDate()).padStart(2, "0");
//       return `${y}-${m}-${day}`;
//     }
//     // Fallback: attempt simple slice/replace
//     return dateStr.slice(0, 10).replace(/\//g, "-");
//   } catch {
//     return dateStr.slice(0, 10).replace(/\//g, "-");
//   }
// }

// export default function UserTickets() {
//   const nav = useNavigate();
//   const user = auth.getUser();

//   // Filters
//   const [type, setType] = useState("All Types");
//   const [priority, setPriority] = useState("All Priority");
//   const [query, setQuery] = useState("");
//   const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
//   const [endDate, setEndDate] = useState("");

//   // Data, UX states & pagination
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [page, setPage] = useState(1);
//   const pageSize = 5;

//   // --- Load user’s tickets from backend ---
//   useEffect(() => {
//     let cancelled = false;
//     const abort = new AbortController();

//     async function load() {
//       setLoading(true);
//       setErr("");
//       try {
//         // If you use cookies for auth, you can skip Authorization header
//         const token = localStorage.getItem("token"); // optional
//         const res = await fetch(`/api/tickets?me=true`, {
//           method: "GET",
//           headers: {
//             "Accept": "application/json",
//             ...(token ? { "Authorization": `Bearer ${token}` } : {}),
//           },
//           signal: abort.signal,
//           credentials: "include", // keep cookies if you use cookie auth
//         });
//         if (!res.ok) {
//           const text = await res.text();
//           throw new Error(text || `Failed to load tickets (${res.status})`);
//         }
//         const data = await res.json();
//         // Expect array of { id, title, type, description, priority, projectName, assignedTo, status, updatedAt }
//         if (!cancelled) {
//           setTickets(Array.isArray(data) ? data : []);
//           setPage(1); // reset to first page on new load
//         }
//       } catch (e) {
//         if (!cancelled) setErr(e.message || "Unable to load tickets");
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }
//     load();

//     return () => {
//       cancelled = true;
//       abort.abort();
//     };
//   }, []); // load on mount; add deps if you want to reload on filter change

//   // --- Filter options; derive from data so they match your backend values ---
//   const TYPES = useMemo(() => {
//     const set = new Set(tickets.map(t => t.type).filter(Boolean));
//     return ["All Types", ...Array.from(set)];
//   }, [tickets]);

//   const PRIORITIES = useMemo(() => {
//     const set = new Set(tickets.map(t => t.priority).filter(Boolean));
//     return ["All Priority", ...Array.from(set)];
//   }, [tickets]);

//   // --- Filtered results ---
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();

//     return tickets.filter(t => {
//       const matchesType = type === "All Types" || t.type === type;
//       const matchesPriority = priority === "All Priority" || t.priority === priority;
//       const matchesQuery =
//         !q ||
//         (t.title || "").toLowerCase().includes(q) ||
//         (t.description || "").toLowerCase().includes(q) ||
//         (t.projectName || "").toLowerCase().includes(q);

//       const updated = toYMD(t.updatedAt);
//       const afterStart = !startDate || (updated && updated >= startDate);
//       const beforeEnd = !endDate || (updated && updated <= endDate);

//       return matchesType && matchesPriority && matchesQuery && afterStart && beforeEnd;
//     });
//   }, [tickets, type, priority, query, startDate, endDate]);

//   // --- Pagination ---
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const paged = useMemo(() => {
//     const startIdx = (page - 1) * pageSize;
//     return filtered.slice(startIdx, startIdx + pageSize);
//   }, [filtered, page]);

//   // Keep page in bounds (e.g., after delete)
//   useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [totalPages, page]);

//   // --- Actions ---
//   const logout = () => {
//     auth.logout();
//     nav("/login", { replace: true });
//   };

//   const deleteTicket = async (id) => {
//     if (!confirm(`Delete ticket ${id}?`)) return;
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`, {
//         method: "DELETE",
//         headers: {
//           ...(token ? { "Authorization": `Bearer ${token}` } : {}),
//         },
//         credentials: "include",
//       });
//       if (!res.ok) {
//         const text = await res.text();
//         throw new Error(text || `Failed to delete (${res.status})`);
//       }
//       setTickets(prev => prev.filter(t => t.id !== id));
//     } catch (e) {
//       alert(e.message || "Unable to delete ticket");
//     }
//   };

//   const goToCreate = () => {
//     nav("/ticket");
//   };

//   return (
//     <div className="tickets-page">
//       {/* Header */}
//       <header className="tickets-header">
//         <button className="btn primary" onClick={goToCreate}>Create Ticket</button>
//         <div className="tickets-right">
//           <span className="status">Signed in as {user?.email || "user"}</span>
//           <button className="btn logout-btn" onClick={logout}>Logout</button>
//         </div>
//       </header>

    
// {/* Filters bar */}
// <section className="filters-bar">
//   <select className="filter-select" value={type} onChange={e => setType(e.target.value)}>
//     {TYPES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//   </select>

//   <select className="filter-select" value={priority} onChange={e => setPriority(e.target.value)}>
//     {PRIORITIES.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//   </select>

//   <input
//     className="filter-input"
//     type="text"
//     placeholder="Search by Title, Description or Project"
//     value={query}
//     onChange={e => setQuery(e.target.value)}
//   />

//   <div className="date-field">
//     <label>Start Date</label>
//     <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
//   </div>

//   <div className="date-field">
//     <label>End Date</label>
//     <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
//   </div>
// </section>

//       {/* Table / states */}
//       <section className="tickets-table-card">
//         {loading ? (
//           <div className="empty">Loading tickets…</div>
//         ) : err ? (
//           <div className="empty" role="alert">Error: {err}</div>
//         ) : (
//           <>
//             <table className="tickets-table">
//               <thead>
//                 <tr>
//                   <th>Title</th>
//                   <th>Type</th>
//                   <th>Description</th>
//                   <th>Priority</th>
//                   <th>ProjectName</th>
//                   <th>Assigned To</th>
//                   <th>Status</th>
//                   <th>Updated Date ↑</th>
//                   <th style={{ width: 100 }}></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paged.length === 0 ? (
//                   <tr><td colSpan={9} className="empty">No tickets found</td></tr>
//                 ) : (
//                   paged.map(t => (
//                     <tr key={t.id}>
//                       <td>
//                         <button
//                           className="link-like"
//                           onClick={() => nav(`/tickets/${encodeURIComponent(t.id)}`)}
//                           title="Open details"
//                         >
//                           {t.title || t.id}
//                         </button>
//                       </td>
//                       <td>{t.type}</td>
//                       <td>{t.description}</td>
//                       <td>{t.priority}</td>
//                       <td>{t.projectName}</td>
//                       <td>{t.assignedTo}</td>
//                       <td>{t.status}</td>
//                       <td>{t.updatedAt}</td>
//                       <td>
//                         <button className="btn danger" onClick={() => deleteTicket(t.id)}>Delete</button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>

//             {/* Pagination */}
//             <div className="pagination">
//               <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
//                 <button
//                   key={n}
//                   className={`page-btn ${n === page ? "active" : ""}`}
//                   onClick={() => setPage(n)}
//                 >
//                   {n}
//                 </button>
//               ))}
//               <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
//             </div>
//           </>
//         )}
//       </section>
//     </div>
//   );
// }

// src/pages/UserTicket.jsx
// import { useMemo, useState } from "react";
// import { auth } from "../auth";

// export default function UserTicket() {
//   const user = auth.getUser();

//   // Tickets start empty for brand-new users
//   const [tickets, setTickets] = useState([]);

//   // Filters / query state
//   const [type, setType] = useState("All Types");
//   const [priority, setPriority] = useState("All Priority");
//   const [query, setQuery] = useState("");
//   const [startDate, setStartDate] = useState(""); // yyyy-mm-dd (native input)
//   const [endDate, setEndDate] = useState("");

//   // Pagination
//   const [page, setPage] = useState(1);
//   const pageSize = 5;

//   // Simple Create Ticket modal (uses your existing theme classes)
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newTicket, setNewTicket] = useState({
//     title: "",
//     type: "",
//     description: "",
//     priority: "",
//     project: "",
//     assignedTo: "",
//   });
//   const [formErr, setFormErr] = useState("");

//   const TYPE_OPTIONS = ["All Types", "Type 1", "Type 2", "Type 3"];
//   const PRIORITY_OPTIONS = ["All Priority", "P1", "P2", "P3"];

//   // Filter logic (applies only when tickets exist)
//   const filtered = useMemo(() => {
//     return tickets.filter(t => {
//       const matchType = type === "All Types" || t.type === type;
//       const matchPrio = priority === "All Priority" || t.priority === priority;

//       const matchQuery =
//         !query ||
//         t.title.toLowerCase().includes(query.toLowerCase()) ||
//         t.description.toLowerCase().includes(query.toLowerCase()) ||
//         t.project.toLowerCase().includes(query.toLowerCase());

//       // Date filter from ISO string "yyyy-mm-dd hh:mm:ss"
//       const updatedDateOnly = t.updated?.slice(0, 10);
//       const okStart = !startDate || updatedDateOnly >= startDate;
//       const okEnd = !endDate || updatedDateOnly <= endDate;

//       return matchType && matchPrio && matchQuery && okStart && okEnd;
//     });
//   }, [tickets, type, priority, query, startDate, endDate]);

//   // Pagination slice
//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const currentRows = filtered.slice((page - 1) * pageSize, page * pageSize);

//   // Helpers
//   const resetPage = () => setPage(1);

//   // Create Ticket flow (local-only; replace with API later)
//   function openCreateModal() {
//     setFormErr("");
//     setNewTicket({
//       title: "",
//       type: "",
//       description: "",
//       priority: "",
//       project: "",
//       assignedTo: "",
//     });
//     setIsModalOpen(true);
//   }
//   function closeCreateModal() {
//     setIsModalOpen(false);
//   }
//   function handleNewTicketChange(e) {
//     const { name, value } = e.target;
//     setNewTicket(prev => ({ ...prev, [name]: value }));
//   }
//   function submitNewTicket(e) {
//     e.preventDefault();
//     setFormErr("");

//     if (!newTicket.title || !newTicket.type || !newTicket.priority) {
//       setFormErr("Please fill Title, Type, and Priority");
//       return;
//     }

//     const idSuffix = Math.floor(Math.random() * 100000);
//     const id = `INC${idSuffix}`;
//     const now = new Date();
//     const isoDate = now.toISOString().slice(0, 19).replace("T", " "); // yyyy-mm-dd hh:mm:ss

//     const ticket = {
//       id,
//       title: newTicket.title,
//       type: newTicket.type,
//       description: newTicket.description || "",
//       priority: newTicket.priority,
//       project: newTicket.project || "",
//       assignedTo: newTicket.assignedTo || "",
//       status: "Acknowledged",
//       updated: isoDate,
//     };

//     setTickets(prev => [ticket, ...prev]);
//     setIsModalOpen(false);
//     resetPage();
//   }

//   function handleDelete(id) {
//     setTickets(prev => prev.filter(t => t.id !== id));
//     resetPage();
//   }

//   return (
//     <section className="page">
//       {/* Top toolbar */}
//       <div className="form-row form-row--inline" style={{ justifyContent: "space-between", marginBottom: "0.75rem" }}>
//         <button className="btn primary" onClick={openCreateModal}>Create Ticket</button>
//         <span className="hint">
//           Signed in as <strong>{user?.email}</strong>
//         </span>
//       </div>

//       {/* Filters row (single line) */}
//       <div className="card" style={{ padding: "0.75rem", marginBottom: "0.75rem" }}>
//         <div className="form-row form-row--inline" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
//           <select
//             className="input"
//             value={type}
//             onChange={e => { setType(e.target.value); resetPage(); }}
//           >
//             {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//           </select>

//           <select
//             className="input"
//             value={priority}
//             onChange={e => { setPriority(e.target.value); resetPage(); }}
//           >
//             {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//           </select>

//           <input
//             className="input"
//             type="text"
//             placeholder="Search by Title, Description and Project"
//             value={query}
//             onChange={e => { setQuery(e.target.value); resetPage(); }}
//             style={{ flex: 1, minWidth: "240px" }}
//           />

//           <div className="form-row form-row--inline" style={{ gap: "0.5rem" }}>
//             <label className="field" style={{ minWidth: "220px" }}>
//               <span>Start Date</span>
//               <input
//                 className="input"
//                 type="date"
//                 value={startDate}
//                 onChange={e => { setStartDate(e.target.value); resetPage(); }}
//               />
//             </label>

//             <label className="field" style={{ minWidth: "220px" }}>
//               <span>End Date</span>
//               <input
//                 className="input"
//                 type="date"
//                 value={endDate}
//                 onChange={e => { setEndDate(e.target.value); resetPage(); }}
//               />
//             </label>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="card" style={{ overflowX: "auto" }}>
//         <table className="table">
//           <thead>
//             <tr>
//               <th style={{ width: "14%" }}>Title</th>
//               <th style={{ width: "10%" }}>Type</th>
//               <th>Description</th>
//               <th style={{ width: "10%" }}>Priority</th>
//               <th style={{ width: "14%" }}>ProjectName</th>
//               <th style={{ width: "14%" }}>Assigned To</th>
//               <th style={{ width: "14%" }}>Status</th>
//               <th style={{ width: "14%" }}>Updated Date ^</th>
//               <th style={{ width: "10%" }}>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentRows.length === 0 ? (
//               <tr>
//                 <td colSpan={9} style={{ textAlign: "center", padding: "1rem" }}>
//                   No tickets yet. Click <strong>Create Ticket</strong> to add your first ticket.
//                 </td>
//               </tr>
//             ) : (
//               currentRows.map(row => (
//                 <tr key={row.id}>
//                   <td><a className="link" href={"#"+row.id}>{row.id}</a></td>
//                   <td>{row.type}</td>
//                   <td>{row.description}</td>
//                   <td>{row.priority}</td>
//                   <td>{row.project}</td>
//                   <td>{row.assignedTo}</td>
//                   <td>{row.status}</td>
//                   <td>{row.updated}</td>
//                   <td>
//                     <button className="btn danger" onClick={() => handleDelete(row.id)}>
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination (show only when we have rows) */}
//       {filtered.length > 0 && (
//         <div className="form-row form-row--inline" style={{ gap: "0.4rem", marginTop: "0.8rem" }}>
//           <button
//             className="btn"
//             disabled={page === 1}
//             onClick={() => setPage(p => Math.max(1, p - 1))}
//           >
//             ‹
//           </button>
//           {Array.from({ length: totalPages }).map((_, i) => (
//             <button
//               key={i}
//               className={`btn ${page === i + 1 ? "primary" : ""}`}
//               onClick={() => setPage(i + 1)}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             className="btn"
//             disabled={page === totalPages}
//             onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//           >
//             ›
//           </button>
//         </div>
//       )}

//       {/* Create Ticket Modal — uses your classes, no extra CSS */}
//       {isModalOpen && (
//         <div className="modal-backdrop" onClick={closeCreateModal}>
//           <div className="card" style={{ maxWidth: "640px", width: "92vw" }} onClick={e => e.stopPropagation()}>
//             <h3>Create Ticket</h3>
//             {formErr && <div className="error">{formErr}</div>}

//             <form onSubmit={submitNewTicket} className="form">
//               <label className="field">
//                 <span>Title*</span>
//                 <input
//                   className="input"
//                   type="text"
//                   name="title"
//                   value={newTicket.title}
//                   onChange={handleNewTicketChange}
//                   required
//                 />
//               </label>

//               <div className="form-row form-row--inline" style={{ gap: "0.75rem" }}>
//                 <label className="field" style={{ flex: 1 }}>
//                   <span>Type*</span>
//                   <select
//                     className="input"
//                     name="type"
//                     value={newTicket.type}
//                     onChange={handleNewTicketChange}
//                     required
//                   >
//                     <option value="">Select</option>
//                     <option value="Type 1">Type 1</option>
//                     <option value="Type 2">Type 2</option>
//                     <option value="Type 3">Type 3</option>
//                   </select>
//                 </label>

//                 <label className="field" style={{ flex: 1 }}>
//                   <span>Priority*</span>
//                   <select
//                     className="input"
//                     name="priority"
//                     value={newTicket.priority}
//                     onChange={handleNewTicketChange}
//                     required
//                   >
//                     <option value="">Select</option>
//                     <option value="P1">P1</option>
//                     <option value="P2">P2</option>
//                     <option value="P3">P3</option>
//                   </select>
//                 </label>
//               </div>

//               <label className="field">
//                 <span>Description</span>
//                 <textarea
//                   className="input"
//                   name="description"
//                   rows={3}
//                   value={newTicket.description}
//                   onChange={handleNewTicketChange}
//                 />
//               </label>

//               <div className="form-row form-row--inline" style={{ gap: "0.75rem" }}>
//                 <label className="field" style={{ flex: 1 }}>
//                   <span>Project</span>
//                   <input
//                     className="input"
//                     type="text"
//                     name="project"
//                     value={newTicket.project}
//                     onChange={handleNewTicketChange}
//                   />
//                 </label>

//                 <label className="field" style={{ flex: 1 }}>
//                   <span>Assigned To</span>
//                   <input
//                     className="input"
//                     type="text"
//                     name="assignedTo"
//                     value={newTicket.assignedTo}
//                     onChange={handleNewTicketChange}
//                   />
//                 </label>
//               </div>

//               <div className="form-row form-row--inline" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
//                 <button type="button" className="btn" onClick={closeCreateModal}>Cancel</button>
//                 <button type="submit" className="btn primary">Save</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// src/pages/UserTicket.jsx


// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../auth";
// import { getTickets, deleteTicket as removeTicket } from "../services/tickets";


// export default function UserTicket() {
//   const user = auth.getUser();

//   // Tickets start empty
//   const [tickets, setTickets] = useState([]);

//   // Filters / query
//   const [type, setType] = useState("All Types");
//   const [priority, setPriority] = useState("All Priority");
//   const [query, setQuery] = useState("");
//   const [startDate, setStartDate] = useState(""); // yyyy-mm-dd
//   const [endDate, setEndDate] = useState("");

//   // Pagination
//   const [page, setPage] = useState(1);
//   const pageSize = 5;

//   // Create Ticket modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newTicket, setNewTicket] = useState({
//     title: "",
//     type: "",
//     description: "",
//     priority: "",
//     project: "",
//     assignedTo: "",
//   });
//   const [formErr, setFormErr] = useState("");

//   const TYPE_OPTIONS = ["All Types", "Type 1", "Type 2", "Type 3"];
//   const PRIORITY_OPTIONS = ["All Priority", "P1", "P2", "P3"];

//   const filtered = useMemo(() => {
//     return tickets.filter(t => {
//       const matchType = type === "All Types" || t.type === type;
//       const matchPrio = priority === "All Priority" || t.priority === priority;
//       const matchQuery =
//         !query ||
//         t.title.toLowerCase().includes(query.toLowerCase()) ||
//         t.description.toLowerCase().includes(query.toLowerCase()) ||
//         t.project.toLowerCase().includes(query.toLowerCase());

//       const updatedDateOnly = t.updated?.slice(0, 10);
//       const okStart = !startDate || updatedDateOnly >= startDate;
//       const okEnd = !endDate || updatedDateOnly <= endDate;

//       return matchType && matchPrio && matchQuery && okStart && okEnd;
//     });
//   }, [tickets, type, priority, query, startDate, endDate]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
//   const currentRows = filtered.slice((page - 1) * pageSize, page * pageSize);
//   const resetPage = () => setPage(1);

//   // Modal handlers
//   function openCreateModal() {
//     setFormErr("");
//     setNewTicket({
//       title: "",
//       type: "",
//       description: "",
//       priority: "",
//       project: "",
//       assignedTo: "",
//     });
//     setIsModalOpen(true);
//   }
//   function closeCreateModal() { setIsModalOpen(false); }
//   function handleNewTicketChange(e) {
//     const { name, value } = e.target;
//     setNewTicket(prev => ({ ...prev, [name]: value }));
//   }
//   function submitNewTicket(e) {
//     e.preventDefault();
//     setFormErr("");

//     if (!newTicket.title || !newTicket.type || !newTicket.priority) {
//       setFormErr("Please fill Title, Type, and Priority");
//       return;
//     }

//     const idSuffix = Math.floor(Math.random() * 100000);
//     const id = `INC${idSuffix}`;
//     const now = new Date();
//     const isoDate = now.toISOString().slice(0, 19).replace("T", " ");

//     const ticket = {
//       id,
//       title: newTicket.title,
//       type: newTicket.type,
//       description: newTicket.description || "",
//       priority: newTicket.priority,
//       project: newTicket.project || "",
//       assignedTo: newTicket.assignedTo || "",
//       status: "Acknowledged",
//       updated: isoDate,
//     };

//     setTickets(prev => [ticket, ...prev]);
//     setIsModalOpen(false);
//     resetPage();
//   }

//   function handleDelete(id) {
//     setTickets(prev => prev.filter(t => t.id !== id));
//     resetPage();
//   }

//   return (
//     <section className="page">
//       {/* Header Bar: Create + signed-in */}
//       <div className="page-header">
//         <button className="btn primary pill" onClick={openCreateModal}>Create Ticket</button>
//         <span className="muted">
//           Signed in as <strong>{user?.email}</strong>
//         </span>
//       </div>

//       {/* Filters Panel (boxed) */}
//       <div className="panel panel--soft">
//         <div className="filters-grid">
//           <select
//             className="input"
//             value={type}
//             onChange={e => { setType(e.target.value); resetPage(); }}
//           >
//             {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//           </select>

//           <select
//             className="input"
//             value={priority}
//             onChange={e => { setPriority(e.target.value); resetPage(); }}
//           >
//             {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
//           </select>

//           <input
//             className="input"
//             type="text"
//             placeholder="Search by Title, Description and Project"
//             value={query}
//             onChange={e => { setQuery(e.target.value); resetPage(); }}
//           />

//           <div className="input-group">
//             <label className="label">Start Date</label>
//             <input
//               className="input"
//               type="date"
//               value={startDate}
//               onChange={e => { setStartDate(e.target.value); resetPage(); }}
//             />
//           </div>

//           <div className="input-group">
//             <label className="label">End Date</label>
//             <input
//               className="input"
//               type="date"
//               value={endDate}
//               onChange={e => { setEndDate(e.target.value); resetPage(); }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Table Panel (boxed) */}
//       <div className="panel panel--soft">
//         <div className="table-responsive">
//           <table className="table table--dark">
//             <thead>
//               <tr>
//                 <th style={{ width: "14%" }}>Title</th>
//                 <th style={{ width: "10%" }}>Type</th>
//                 <th>Description</th>
//                 <th style={{ width: "10%" }}>Priority</th>
//                 <th style={{ width: "14%" }}>ProjectName</th>
//                 <th style={{ width: "14%" }}>Assigned To</th>
//                 <th style={{ width: "14%" }}>Status</th>
//                 <th style={{ width: "14%" }}>Updated Date ^</th>
//                 <th style={{ width: "10%" }}>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {currentRows.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} className="empty-row">
//                     No tickets yet. Click <strong>Create Ticket</strong> to add your first ticket.
//                   </td>
//                 </tr>
//               ) : (
//                 currentRows.map(row => (
//                   <tr key={row.id}>
//                     <td><a className="link" href={"#"+row.id}>{row.id}</a></td>
//                     <td>{row.type}</td>
//                     <td>{row.description}</td>
//                     <td>{row.priority}</td>
//                     <td>{row.project}</td>
//                     <td>{row.assignedTo}</td>
//                     <td>{row.status}</td>
//                     <td>{row.updated}</td>
//                     <td>
//                       <button className="btn danger pill" onClick={() => handleDelete(row.id)}>
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination — show only when rows exist */}
//         {filtered.length > 0 && (
//           <div className="pagination">
//             <button
//               className="btn ghost pill"
//               disabled={page === 1}
//               onClick={() => setPage(p => Math.max(1, p - 1))}
//             >
//               ‹
//             </button>

//             {Array.from({ length: totalPages }).map((_, i) => (
//               <button
//                 key={i}
//                 className={`btn pill ${page === i + 1 ? "primary" : "ghost"}`}
//                 onClick={() => setPage(i + 1)}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               className="btn ghost pill"
//               disabled={page === totalPages}
//               onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//             >
//               ›
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Create Ticket Modal (respects dark theme; boxed card) */}
//       {isModalOpen && (
//         <div className="modal-backdrop" onClick={closeCreateModal}>
//           <div className="panel" style={{ maxWidth: "640px", width: "92vw" }} onClick={e => e.stopPropagation()}>
//             <h3>Create Ticket</h3>
//             {formErr && <div className="error">{formErr}</div>}

//             <form onSubmit={submitNewTicket} className="form">
//               <label className="field">
//                 <span>Title*</span>
//                 <input
//                   className="input"
//                   type="text"
//                   name="title"
//                   value={newTicket.title}
//                   onChange={handleNewTicketChange}
//                   required
//                 />
//               </label>

//               <div className="form-row form-row--inline" style={{ gap: "0.75rem" }}>
//                 <label className="field" style={{ flex: 1 }}>
//                   <span>Type*</span>
//                   <select
//                     className="input"
//                     name="type"
//                     value={newTicket.type}
//                     onChange={handleNewTicketChange}
//                     required
//                   >
//                     <option value="">Select</option>
//                     <option value="Type 1">Type 1</option>
//                     <option value="Type 2">Type 2</option>
//                     <option value="Type 3">Type 3</option>
//                   </select>
//                 </label>

//                 <label className="field" style={{ flex: 1 }}>
//                   <span>Priority*</span>
//                   <select
//                     className="input"
//                     name="priority"
//                     value={newTicket.priority}
//                     onChange={handleNewTicketChange}
//                     required
//                   >
//                     <option value="">Select</option>
//                     <option value="P1">P1</option>
//                     <option value="P2">P2</option>
//                     <option value="P3">P3</option>
//                   </select>
//                 </label>
//               </div>

//               <label className="field">
//                 <span>Description</span>
//                 <textarea
//                   className="input"
//                   name="description"
//                   rows={3}
//                   value={newTicket.description}
//                   onChange={handleNewTicketChange}
//                 />
//               </label>

//               <div className="form-row form-row--inline" style={{ gap: "0.75rem" }}>
//                 <label className="field" style={{ flex: 1 }}>
//                   <span>Project</span>
//                   <input
//                     className="input"
//                     type="text"
//                     name="project"
//                     value={newTicket.project}
//                     onChange={handleNewTicketChange}
//                   />
//                 </label>

//                 <label className="field" style={{ flex: 1 }}>
//                   <span>Assigned To</span>
//                   <input
//                     className="input"
//                     type="text"
//                     name="assignedTo"
//                     value={newTicket.assignedTo}
//                     onChange={handleNewTicketChange}
//                   />
//                 </label>
//               </div>

//               <div className="form-row form-row--inline" style={{ justifyContent: "flex-end", gap: "0.5rem" }}>
//                 <button type="button" className="btn ghost pill" onClick={closeCreateModal}>Cancel</button>
//                 <button type="submit" className="btn primary pill">Save</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }

// src/pages/UserTicket.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../auth";
import { getTickets, deleteTicket as removeTicket } from "../services/tickets";

export default function UserTicket() {
  const navigate = useNavigate();
  const user = auth.getUser();

  const [tickets, setTickets] = useState([]);

  // Filters
  const [type, setType] = useState("All Types");
  const [priority, setPriority] = useState("All Priority");
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const TYPE_OPTIONS = ["All Types", "Type 1", "Type 2", "Type 3"];
  const PRIORITY_OPTIONS = ["All Priority", "P1", "P2", "P3"];

  // Load tickets on mount (and on re-mount when returning from create page)
  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      const matchType = type === "All Types" || t.type === type;
      const matchPrio = priority === "All Priority" || t.priority === priority;
      const matchQuery =
        !query ||
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.project.toLowerCase().includes(query.toLowerCase());

      const updatedDateOnly = t.updated?.slice(0, 10);
      const okStart = !startDate || updatedDateOnly >= startDate;
      const okEnd = !endDate || updatedDateOnly <= endDate;

      return matchType && matchPrio && matchQuery && okStart && okEnd;
    });
  }, [tickets, type, priority, query, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const resetPage = () => setPage(1);

  // ✅ Navigate to new page instead of showing a modal
  function goToCreate() {
    navigate("/dashboard/create");
  }

  function handleDelete(id) {
    const next = removeTicket(id);
    setTickets(next);
    resetPage();
  }

  return (
    <section className="page">
      {/* Header */}
      <div className="page-header">
        <button type="button" className="btn primary pill" onClick={goToCreate}>
          Create Ticket
        </button>
        <span className="muted">
          Signed in as <strong>{user?.email}</strong>
        </span>
      </div>

      {/* Filters */}
      <div className="panel panel--soft">
        <div className="filters-grid">
          <select className="input" value={type} onChange={e => { setType(e.target.value); resetPage(); }}>
            {TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>

          <select className="input" value={priority} onChange={e => { setPriority(e.target.value); resetPage(); }}>
            {PRIORITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>

          <input
            className="input"
            type="text"
            placeholder="Search by Title, Description and Project"
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

      {/* Table */}
      <div className="panel panel--soft">
        <div className="table-responsive">
          <table className="table table--dark">
            <thead>
              <tr>
                <th style={{ width: "14%" }}>Title</th>
                <th style={{ width: "10%" }}>Type</th>
                <th>Description</th>
                <th style={{ width: "10%" }}>Priority</th>
                <th style={{ width: "14%" }}>ProjectName</th>
                <th style={{ width: "14%" }}>Assigned To</th>
                <th style={{ width: "14%" }}>Status</th>
                <th style={{ width: "14%" }}>Updated Date ^</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-row">
                    No tickets yet. Click <strong>Create Ticket</strong> to add your first ticket.
                  </td>
                </tr>
              ) : (
                currentRows.map(row => (
                  <tr key={row.id}>
                    <td><a className="link" href={"#"+row.id}>{row.id}</a></td>
                    <td>{row.type}</td>
                    <td>{row.description}</td>
                    <td>{row.priority}</td>
                    <td>{row.project}</td>
                    <td>{row.assignedTo}</td>
                    <td>{row.status}</td>
                    <td>{row.updated}</td>
                    <td>
                      <button type="button" className="btn danger pill" onClick={() => handleDelete(row.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="pagination">
            <button
              type="button"
              className="btn ghost pill"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
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

            <button
              type="button"
              className="btn ghost pill"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
