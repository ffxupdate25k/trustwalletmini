export const money = (n) => "$" + Number(n).toFixed(2);

// Escapes text for safe use inside HTML (including attributes).
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

export function avatarHTML(user, name) {
  if (user.photo_url) return `<img src="${esc(user.photo_url)}" alt="">`;
  return esc(name.charAt(0).toUpperCase());
}

export function pageTop(title, subtitle) {
  return `<div class="top"><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div>`;
}
