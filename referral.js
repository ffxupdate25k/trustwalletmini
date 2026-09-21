import { api } from "../api.js";
import { CONFIG } from "../config.js";
import { getUser, notify, haptic, openTelegramLink } from "../telegram.js";
import { esc, money, pageTop } from "../utils.js";

export default {
  async render(el) {
    const data = await api.getReferrals();
    const link = `https://t.me/${CONFIG.BOT_USERNAME}?start=ref_${getUser().id || ""}`;

    el.innerHTML = `
      <section class="page">
        ${pageTop("Referral", "Invite friends and earn bonuses")}
        <div class="body">
          <div class="stat">
            <div class="card"><b>${data.count}</b><small>Friends invited</small></div>
            <div class="card"><b>${money(data.earned)}</b><small>Earned</small></div>
          </div>
          <div class="card">
            <b>Your invite link</b>
            <div class="link">${esc(link)}</div>
            <button class="btn" id="share">Share with friends</button>
            <div class="gap"></div>
            <button class="btn ghost" id="copy">Copy link</button>
          </div>
        </div>
      </section>`;

    el.querySelector("#share").addEventListener("click", () => {
      openTelegramLink(
        "https://t.me/share/url?url=" + encodeURIComponent(link) +
        "&text=" + encodeURIComponent("Join me and start earning!")
      );
    });

    el.querySelector("#copy").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(link);
        haptic("success");
        notify("Link copied.");
      } catch (e) {
        notify(link);
      }
    });
  }
};
