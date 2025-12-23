
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire to backend for signup
    alert(`Welcome, ${form.name}! Your account has been created.`);
  }

  return (
    <section className="page">
      <h2>Signup</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Alex Doe"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            required
          />
        </label>
        <button type="submit" className="btn primary">Create Account</button>
      </form>
      
<p className="hint">
        Already have an account? <Link to="/login">Login</Link>
      </p>

    </section>
  );
}
