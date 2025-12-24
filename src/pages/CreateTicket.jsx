
// // src/pages/CreateTicket.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { addTicket } from "../services/tickets";
// import { auth } from "../auth";

// export default function CreateTicket() {
//   const navigate = useNavigate();
//   const user = auth.getUser();

//   const [form, setForm] = useState({
//     title: "",
//     type: "",
//     description: "",
//     priority: "",
//     project: "",
//     assignedTo: "",
//   });
//   const [err, setErr] = useState("");

//   function handleChange(e) {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     setErr("");

//     // Basic validation
//     if (!form.title || !form.type || !form.priority) {
//       setErr("Please fill Title, Type, and Priority");
//       return;
//     }

//     // Generate ID + timestamp
//     const idSuffix = Math.floor(Math.random() * 100000);
//     const id = `INC${idSuffix}`;
//     const now = new Date();
//     const updated = now.toISOString().slice(0, 19).replace("T", " ");

//     addTicket({
//       id,
//       title: form.title,
//       type: form.type,
//       description: form.description || "",
//       priority: form.priority,
//       project: form.project || "",
//       assignedTo: form.assignedTo || "",
//       status: "Acknowledged",
//       updated,
//       createdBy: user?.email || "",
//     });

//     // After save -> go back to Dashboard
//     navigate("/dashboard", { replace: true });
//   }

//   function cancel() {
//     navigate("/dashboard");
//   }

//   return (
//     <section className="page">
//       <div className="panel" style={{ maxWidth: 760, margin: "0 auto" }}>
//         <h2 style={{ marginBottom: 12 }}>Create Ticket</h2>
//         {err && <div className="error">{err}</div>}

//         <form className="form" onSubmit={handleSubmit}>
//           <label className="field">
//             <span>Title*</span>
//             <input
//               className="input"
//               type="text"
//               name="title"
//               value={form.title}
//               onChange={handleChange}
//               required
//             />
//           </label>

//           <div className="form-row form-row--inline" style={{ gap: 12 }}>
//             <label className="field" style={{ flex: 1 }}>
//               <span>Type*</span>
//               <select
//                 className="input"
//                 name="type"
//                 value={form.type}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select</option>
//                 <option value="Type 1">Type 1</option>
//                 <option value="Type 2">Type 2</option>
//                 <option value="Type 3">Type 3</option>
//               </select>
//             </label>

//             <label className="field" style={{ flex: 1 }}>
//               <span>Priority*</span>
//               <select
//                 className="input"
//                 name="priority"
//                 value={form.priority}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Select</option>
//                 <option value="P1">P1</option>
//                 <option value="P2">P2</option>
//                 <option value="P3">P3</option>
//               </select>
//             </label>
//           </div>

//           <label className="field">
//             <span>Description</span>
//             <textarea
//               className="input"
//               rows={4}
//               name="description"
//               value={form.description}
//               onChange={handleChange}
//             />
//           </label>

//           <div className="form-row form-row--inline" style={{ gap: 12 }}>
//             <label className="field" style={{ flex: 1 }}>
//               <span>Project</span>
//               <input
//                 className="input"
//                 type="text"
//                 name="project"
//                 value={form.project}
//                 onChange={handleChange}
//               />
//             </label>

//             <label className="field" style={{ flex: 1 }}>
//               <span>Assigned To</span>
//               <input
//                 className="input"
//                 type="text"
//                 name="assignedTo"
//                 value={form.assignedTo}
//                 onChange={handleChange}
//               />
//             </label>
//           </div>

//           <div className="form-row form-row--inline" style={{ justifyContent: "flex-end", gap: 8 }}>
//             <button type="button" className="btn ghost pill" onClick={cancel}>
//               Cancel
//             </button>
//             <button type="submit" className="btn primary pill">
//               Save Ticket
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// }

// src/pages/CreateTicket.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addTicket, nextTicketId } from "../services/tickets";
import { auth } from "../auth";

export default function CreateTicket() {
  const navigate = useNavigate();
  const user = auth.getUser();

  // Auto-generated Ticket ID (U1, U2, ...)
  const [ticketId, setTicketId] = useState("U1");

  const [form, setForm] = useState({
    type: "",
    description: "",
    project: "",
    // removed: priority, assignedTo
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    // Get the next unique ticket ID on mount
    setTicketId(nextTicketId());
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    // Required: Ticket ID (auto), Type
    if (!ticketId || !form.type) {
      setErr("Please select Type.");
      return;
    }

    const now = new Date();
    const updated = now.toISOString().slice(0, 19).replace("T", " ");

    // Save ticket (use ticketId instead of title; no priority/assignedTo)
    addTicket({
      id: ticketId,               // keep id for compatibility with list/delete
      ticketId,                   // explicit field for display
      type: form.type,
      description: form.description || "",
      project: form.project || "",
      status: "Acknowledged",
      updated,
      createdBy: user?.email || "",
    });

    // Navigate back to dashboard
    navigate("/dashboard", { replace: true });
  }

  return (
    <section className="page">
      <div className="panel" style={{ maxWidth: 760, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 12 }}>Create Ticket</h2>
        <p className="muted" style={{ marginBottom: 12 }}>
          {/* Ticket IDs are generated automatically (e.g., U1, U2…). */}
        </p>

        {err && <div className="error">{err}</div>}

        <form className="form" onSubmit={handleSubmit}>
          {/* Ticket ID (read-only) */}
          <label className="field">
            <span>Ticket ID</span>
            <input
              className="input"
              type="text"
              value={ticketId}
              readOnly
            />
          </label>

          {/* Type (required) */}
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

          {/* Description */}
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

          {/* Project */}
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

          {/* Actions */}
          <div className="form-row form-row--inline" style={{ justifyContent: "flex-end", gap: 8 }}>
            <button
              type="button"
              className="btn ghost pill"
              onClick={() => navigate("/dashboard")}
            >
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
