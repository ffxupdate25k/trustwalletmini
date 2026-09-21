// In-memory fake backend so the UI works before your server exists.
// Data resets on reload. Set CONFIG.USE_MOCK = false to use the real API.
import { CONFIG } from "./config.js";

const db = {
  balance: 0,
  referrals: 0,
  history: [],
  tasks: [
    { id: 1, title: "Join our Telegram channel", reward: 0.50, url: "https://t.me/telegram", status: "todo" },
    { id: 2, title: "Follow us on X", reward: 0.30, url: "https://x.com", status: "todo" },
    { id: 3, title: "Watch the intro video", reward: 0.20, url: "https://youtube.com", status: "todo" }
  ]
};

const reply = (value, ms = 150) =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

const log = (title, amount, status) =>
  db.history.unshift({ title, amount, status, date: new Date().toLocaleString() });

export const mock = {
  getMe: () => reply({ balance: db.balance, referrals: db.referrals }),
  getHistory: () => reply(db.history),
  getReferrals: () => reply({ count: db.referrals, earned: db.referrals * CONFIG.REFERRAL_BONUS }),
  getTasks: () => reply(db.tasks),

  async startTask(id) {
    const t = db.tasks.find((x) => x.id === id);
    if (t && t.status === "todo") t.status = "started";
    return reply({ ok: true });
  },

  async claimTask(id) {
    const t = db.tasks.find((x) => x.id === id);
    if (!t || t.status !== "started") throw new Error("Start the task first.");
    t.status = "done";
    db.balance += t.reward;
    log("Task: " + t.title, t.reward, "Completed");
    return reply({ reward: t.reward, balance: db.balance });
  },

  async requestWithdrawal({ amount, address }) {
    if (amount < CONFIG.MIN_WITHDRAW) throw new Error("Minimum withdrawal is $" + CONFIG.MIN_WITHDRAW + ".");
    if (amount > db.balance) throw new Error("Amount is higher than your balance.");
    if (!address || address.length < 10) throw new Error("Enter a valid wallet address.");
    db.balance -= amount;
    log("Withdrawal", -amount, "Pending");
    return reply({ ok: true, balance: db.balance });
  }
};
