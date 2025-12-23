
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <span className="logo">🤖</span>
          <span className="brand-text">Agentic Helpdesk</span>
        </div>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'link active' : 'link'}>
            Home
          </NavLink>
          <NavLink to="/signup" className={({ isActive }) => isActive ? 'link active' : 'link'}>
            Signup
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? 'link active' : 'link'}>
            Login
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'link active' : 'link'}>
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
