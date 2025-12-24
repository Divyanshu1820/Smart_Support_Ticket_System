
// // src/auth.js
// export const auth = {
//   isLoggedIn: () => localStorage.getItem('auth') === 'true',
//   login(user) {
//     localStorage.setItem('auth', 'true');
//     localStorage.setItem('user', JSON.stringify(user));
//   },
//   logout() {
//     localStorage.removeItem('auth');
//     localStorage.removeItem('user');
//   },
//   getUser() {
//     try {
//       return JSON.parse(localStorage.getItem('user') || '{}');
//     } catch {
//       return {};
//     }
//   }
// };

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
