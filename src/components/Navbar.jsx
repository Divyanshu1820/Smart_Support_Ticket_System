
// import { NavLink } from 'react-router-dom';

// export default function Navbar() {
//   return (
//     <header className="navbar">
//       <div className="nav-inner">
//         <div className="brand">
//           <span className="logo">🤖</span>
//           <span className="brand-text">Agentic Helpdesk</span>
//         </div>
//         <nav className="nav-links">
//           <NavLink to="/" end className={({ isActive }) => isActive ? 'link active' : 'link'}>
//             Home
//           </NavLink>
//           <NavLink to="/signup" className={({ isActive }) => isActive ? 'link active' : 'link'}>
//             Signup
//           </NavLink>
//           <NavLink to="/login" className={({ isActive }) => isActive ? 'link active' : 'link'}>
//             Login
//           </NavLink>
//           <NavLink to="/about" className={({ isActive }) => isActive ? 'link active' : 'link'}>
//             About
//           </NavLink>
//         </nav>
//       </div>
//     </header>
//   );
// }

// src/components/Navbar.jsx
// import { NavLink, useNavigate } from "react-router-dom";
// import { auth } from "../auth";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const loggedIn = auth.isAuthenticated();

//   const handleLogout = () => {
//     auth.logout();
//     // Send user to home after logout
//     navigate("/", { replace: true });
//   };

//   return (
//     <header className="navbar">
//       <div className="nav-inner">
//         <div className="brand">
//           <span className="logo">🤖</span>
//           <span className="brand-text">Agentic Helpdesk</span>
//         </div>

//         <nav className="nav-links">
//           <NavLink to="/" end className={({ isActive }) => (isActive ? "link active" : "link")}>
//             Home
//           </NavLink>

//           {/* Show Signup + Login only when NOT logged in */}
//           {!loggedIn && (
//             <>
//               <NavLink to="/signup" className={({ isActive }) => (isActive ? "link active" : "link")}>
//                 Signup
//               </NavLink>
//               <NavLink to="/login" className={({ isActive }) => (isActive ? "link active" : "link")}>
//                 Login
//               </NavLink>
//             </>
//           )}

//           <NavLink to="/about" className={({ isActive }) => (isActive ? "link active" : "link")}>
//             About
//           </NavLink>

//           {/* Show Logout only when logged in */}
//           {loggedIn && (
//             <button className="btn nav-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }

// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../auth";

export default function Navbar() {
  const navigate = useNavigate();
  const loggedIn = auth.isAuthenticated();

  const handleLogout = () => {
    auth.logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="brand">
          <span className="logo">🤖</span>
          <span className="brand-text">Agentic Helpdesk</span>
        </div>

        <nav className="nav-links">
          {/* When NOT logged in: show Home, Signup, Login, About */}
          {!loggedIn ? (
            <>
              <NavLink to="/" end className={({ isActive }) => (isActive ? "link active" : "link")}>
                Home
              </NavLink>
              <NavLink to="/signup" className={({ isActive }) => (isActive ? "link active" : "link")}>
                Signup
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => (isActive ? "link active" : "link")}>
                Login
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => (isActive ? "link active" : "link")}>
                About
              </NavLink>
            </>
          ) : (
            // When logged in: show only Dashboard + Logout
            <>
              <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "link active" : "link")}>
                Dashboard
              </NavLink>
              <button className="btn nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
``
