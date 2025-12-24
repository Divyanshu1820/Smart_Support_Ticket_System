// import { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
 
// export default function Login() {
//   const navigate = useNavigate();
 
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     role: "user",      // default; set to "" if you want to force user to choose
//     rememberMe: false,
//   });
 
//   // Optional: prefill email if previously remembered
//   useEffect(() => {
//     const savedEmail = localStorage.getItem("rememberedEmail");
//     if (savedEmail) {
//       setForm((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
//     }
//   }, []);
 
//   function handleChange(e) {
//     const { name, type, value, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   }
 
//   function handleSubmit(e) {
//     e.preventDefault();
 
//     // TODO: wire to real auth
//     if (form.rememberMe) {
//       localStorage.setItem("rememberedEmail", form.email);
//     } else {
//       localStorage.removeItem("rememberedEmail");
//     }
 
//     alert(
//       `Logging in as ${form.email} with role: ${form.role} (remember: ${form.rememberMe})`
//     );
 
//     // Optional: route based on role
//     // navigate(form.role === "admin" ? "/admin/dashboard" : "/app");
//   }
 
//   function handleForgotPassword(e) {
//     e.preventDefault();
//     navigate("/forgot-password");
//   }
 
//   return (
//     <section className="page">
//       <h2>Login</h2>
 
//       {/* Radio options ABOVE the form, no box, no text label */}
//       <div className="role-options">
//         <label className="radio">
//           <input
//             type="radio"
//             name="role"
//             value="user"
//             checked={form.role === "user"}
//             onChange={handleChange}
//             required
//           />
//           <span>User</span>
//         </label>
 
//         <label className="radio">
//           <input
//             type="radio"
//             name="role"
//             value="admin"
//             checked={form.role === "admin"}
//             onChange={handleChange}
//           />
//           <span>Admin</span>
//         </label>
//       </div>
 
//       <form className="form" onSubmit={handleSubmit}>
//         <label>
//           Email
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             placeholder="you@company.com"
//             required
//             autoComplete="email"
//           />
//         </label>
 
//         <label>
//           Password
//           <input
//             type="password"
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             placeholder="••••••••"
//             required
//             autoComplete="current-password"
//           />
//         </label>
 
//         {/* Remember me + Forgot password row (ON THE SAME LINE) */}
//         <div className="form-row form-row--inline">
//           <label className="checkbox" htmlFor="rememberMe">
//             {/* Text first, checkbox second => checkbox appears on the RIGHT */}
//             <span>Remember me</span>
//             <input
//               type="checkbox"
//               id="rememberMe"
//               name="rememberMe"
//               checked={form.rememberMe}
//               onChange={handleChange}
//             />
//           </label>
 
//           {/* You can either use Link or the navigate handler */}
//           <Link to="/forgot-password" className="forgot-link">
//             Forgot password?
//           </Link>
//           {/* Or:
//           <button type="button" className="link-button" onClick={handleForgotPassword}>
//             Forgot password?
//           </button> */}
//         </div>
 
//         <button type="submit" className="btn primary">Login</button>
//       </form>
 
//       <p className="hint">
//         New here? <Link to="/signup">Create an account</Link>
//       </p>
//     </section>
//   );
// }
 
 

// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../auth";

// navigate("/dashboard", { replace: true });
export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",      // default role
    rememberMe: false, // remember email toggle
  });

  const [err, setErr] = useState("");

  // Prefill email if previously remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!form.email || !form.password) {
      setErr("Email and password are required");
      return;
    }

    // Simulate auth success — replace with real API call when ready
    auth.login({ email: form.email, role: form.role });

    // Remember email (optional)
    if (form.rememberMe) {
      localStorage.setItem("rememberedEmail", form.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    // Redirect after login
    navigate("/ticket", { replace: true }); // or navigate("/", { replace: true })
  }

  return (
    <section className="page">
      <h2>Login</h2>

      {/* Role selection (above the form) */}
      <div className="role-options">
        <label className="radio">
          <input
            type="radio"
            name="role"
            value="user"
            checked={form.role === "user"}
            onChange={handleChange}
            required
          />
          <span>User</span>
        </label>

        <label className="radio">
          <input
            type="radio"
            name="role"
            value="admin"
            checked={form.role === "admin"}
            onChange={handleChange}
          />
          <span>Admin</span>
        </label>
      </div>

      {/* Thicker bordered login card */}
      <form className="form card login-card" onSubmit={handleSubmit}>
        <label className="field">
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </label>

        <label className="field">
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </label>

        {/* Remember me + Forgot password in same line */}
        <div className="form-row form-row--inline align-ends">
          {/* Forgot password on the left */}
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>

          {/* Remember me on the right, with checkbox to the RIGHT side */}
          <label className="checkbox checkbox-right" htmlFor="rememberMe">
            <span>Remember me</span>
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
          </label>
        </div>

        {err && <div className="error">{err}</div>}

        <button type="submit" className="btn primary">Login</button>
      </form>

      {/* Hide signup hint when logged in (optional) */}
      {!auth.isAuthenticated() && (
        <p className="hint">
          New here? <Link to="/signup">Create an account</Link>
        </p>
      )}
    </section>
  );
}
