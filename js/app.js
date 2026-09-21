// Entry point: Telegram gate, router, back button.
import { isTelegram, initTelegram, backButton, notify } from "./telegram.js";

import dashboard  from "./pages/dashboard.js";
import profile    from "./pages/profile.js";
import history    from "./pages/history.js";
import referral   from "./pages/referral.js";
import task       from "./pages/task.js";
import withdrawal from "./pages/withdrawal.js";

const routes = { home: dashboard, profile, history, referral, task, withdrawal };

// 1) Telegram-only gate
if (!isTelegram()) {
  document.getElementById("blocked").hidden = false;
} else {
  boot();
}

function boot() {
  initTelegram();
  const app = document.getElementById("app");
  app.hidden = false;

  async function go(name) {
    const page = routes[name] || routes.home;
    app.innerHTML = `<div class="loading">Loading…</div>`;
    window.scrollTo(0, 0);
    name === "home" ? backButton.hide() : backButton.show();
    try {
      await page.render(app, { go });
    } catch (err) {
      app.innerHTML = `<div class="empty">Couldn't load this page.<br>Check your connection and try again.</div>`;
      notify(err.message);
    }
  }

  backButton.onClick(() => go("home"));
  go("home");
}
