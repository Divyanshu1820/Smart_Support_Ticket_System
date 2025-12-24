
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import About from "./pages/About.jsx";
import UserTicket from "./pages/UserTicket.jsx"; // dashboard/create-ticket
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // route guard
import CreateTicket from "./pages/CreateTicket.jsx";
import UserTickets from "./pages/UserTicket.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />

          {/* Private routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserTicket /> {/* your Create Ticket / Ticket Dashboard component */}
              </ProtectedRoute>
            }
          />

          {/* If you still use /ticket elsewhere */}
          <Route
            path="/ticket"
            element={
              <ProtectedRoute>
                <UserTickets/>
              </ProtectedRoute>
            }
        />
       <Route
        path="/dashboard/create"
      element={
       <ProtectedRoute>
      <CreateTicket />
       </ProtectedRoute>
  }/>
        </Routes>
      </main>
    </>
  );
}
``
