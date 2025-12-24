
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

export function deleteTicket(id) {
  const list = getTickets();
  const next = list.filter(t => t.id !== id);
  saveTickets(next);
  return next;
}
