import { api } from "../api.js";
import { getUser, getDisplayName, tap } from "../telegram.js";
import { icons } from "../icons.js";
import { esc, money, avatarHTML } from "../utils.js";

const BUTTONS = [
  { go: "profile",    label: "Profile" },
  { go: "history",    label: "History" },
  { go: "referral",   label: "Referral" },
  { go: "task",       label: "Task" },
  { go: "withdrawal", label: "Withdrawal", wide: true }
];

export default {
  async render(el, { go }) {
    const me = await api.getMe();
    const name = getDisplayName();

    el.innerHTML = `
      <section class="page">
        <div class="hero">
          <div class="user">
            <div class="avatar">${avatarHTML(getUser(), name)}</div>
            <div><small>Welcome back</small><b>${esc(name)}</b></div>
          </div>
        </div>
        <div class="balance">
          <div><small>Your balance</small><div class="amt">${money(me.balance)}</div></div>
          <div class="chip">${me.referrals} referrals</div>
        </div>
        <div class="grid">
          ${BUTTONS.map((b) => `
            <button class="tile${b.wide ? " wide" : ""}" data-go="${b.go}">
              <span class="ic">${icons[b.go]}</span>${b.label}
            </button>`).join("")}
        </div>
      </section>`;

    el.querySelectorAll("[data-go]").forEach((btn) =>
      btn.addEventListener("click", () => { tap(); go(btn.dataset.go); })
    );
  }
};
