// The only file that talks to your backend. Pages call `api.*` and never fetch directly.
// Every request sends Telegram's initData; the server must verify it (HMAC with the bot token).
import { CONFIG } from "./config.js";
import { tg } from "./telegram.js";
import { mock } from "./mock.js";

async function http(path, method = "GET", body) {
  const res = await fetch(CONFIG.API_BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "tma " + tg.initData
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Request failed (" + res.status + ")");
  }
  return res.json();
}

const real = {
  getMe:            ()        => http("/api/me"),                          // { balance, referrals }
  getHistory:       ()        => http("/api/history"),                     // [{ title, amount, status, date }]
  getReferrals:     ()        => http("/api/referrals"),                   // { count, earned }
  getTasks:         ()        => http("/api/tasks"),                       // [{ id, title, reward, url, status }]
  startTask:        (id)      => http(`/api/tasks/${id}/start`, "POST"),   // { ok }
  claimTask:        (id)      => http(`/api/tasks/${id}/claim`, "POST"),   // { reward, balance }
  requestWithdrawal:(payload) => http("/api/withdrawals", "POST", payload) // payload: { amount, address }
};

export const api = CONFIG.USE_MOCK ? mock : real;
