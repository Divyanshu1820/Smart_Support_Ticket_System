
// // src/services/tickets.js
// const KEY = "tickets_v1";

// export function getTickets() {
//   try {
//     const raw = localStorage.getItem(KEY);
//     return raw ? JSON.parse(raw) : [];
//   } catch {
//     return [];
//   }
// }

// export function saveTickets(list) {
//   localStorage.setItem(KEY, JSON.stringify(list));
// }

// export function addTicket(ticket) {
//   const list = getTickets();
//   const next = [ticket, ...list];
//   saveTickets(next);
//   return ticket;
// }

// export function deleteTicket(id) {
//   const list = getTickets();
//   const next = list.filter(t => t.id !== id);
//   saveTickets(next);
//   return next;
// }

// src/services/tickets.js
const KEY = "tickets_v1";

export function getTickets() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTickets(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function addTicket(ticket) {
  const list = getTickets();
  const next = [ticket, ...list];
  saveTickets(next);
  return ticket;
}

export function deleteTicket(idOrTicketId) {
  const list = getTickets();
  const next = list.filter(t => (t.id ?? t.ticketId) !== idOrTicketId);
  saveTickets(next);
  return next;
}

/**
 * Generate next Ticket ID in the form U1, U2, ...
 * It scans existing tickets and finds the highest U<number>, then returns next.
 */
export function nextTicketId() {
  const list = getTickets();
  let maxNum = 0;
  for (const t of list) {
    const val = t.ticketId ?? t.id;               // support both during migration
    if (typeof val === "string" && /^U\d+$/.test(val)) {
      const n = parseInt(val.slice(1), 10);
      if (!Number.isNaN(n) && n > maxNum) maxNum = n;
    }
  }
  return `U${maxNum + 1}`;
}
