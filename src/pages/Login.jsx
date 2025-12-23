
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user",      // default; set to "" if you want to force user to choose
    rememberMe: false, // new
  });

  // Optional: prefill email if previously remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setForm((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // TODO: wire to real auth
    if (form.rememberMe) {
      localStorage.setItem("rememberedEmail", form.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    alert(
      `Logging in as ${form.email} with role: ${form.role} (remember: ${form.rememberMe})`
    );

    // Optional: route based on role
    // navigate(form.role === "admin" ? "/admin/dashboard" : "/app");
  }

  function handleForgotPassword(e) {
    e.preventDefault();
    navigate("/forgot-password");
  }

  return (
    <section className="page">
      <h2>Login</h2>

      {/* Radio options ABOVE the form, no box, no text label */}
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

      <form className="form" onSubmit={handleSubmit}>
        <label>
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

        <label>
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

        {/* Remember me + Forgot password row */}
        <div className="form-row form-row--inline">
          <label className="checkbox">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={form.rememberMe}
              onChange={handleChange}
            />
            <span>Remember me</span>
          </label>

          {/* You can either use Link or the navigate handler */}
          <Link to="/forgot-password" className="forgot-link">
            Forgot password?
          </Link>
          {/* Or: <button className="link-button" onClick={handleForgotPassword}>Forgot password?</button> */}
        </div>

        <button type="submit" className="btn primary">Login</button>
      </form>

      <p className="hint">
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </section>
  );
}
