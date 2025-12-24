
// // src/components/ProtectedRoute.jsx
// import { Navigate, Outlet } from 'react-router-dom';
// import { auth } from '../auth';

// export default function ProtectedRoute() {
//   return auth.isLoggedIn() ? <Outlet /> : <Navigate to="/login" replace />;
// }

// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { auth } from "../auth";

export default function ProtectedRoute({ children }) {
  return auth.isAuthenticated() ? children : <Navigate to="/login" replace />;
}
``
