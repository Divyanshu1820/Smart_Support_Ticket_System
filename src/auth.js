// src/auth.js
export const auth = {
  login({ email, role }) {
    localStorage.setItem("auth", JSON.stringify({ email, role, ts: Date.now() }));
  },
  logout() {
    localStorage.removeItem("auth");
  },
  isAuthenticated() {
    return !!localStorage.getItem("auth");
  },
  getUser() {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  },
};
