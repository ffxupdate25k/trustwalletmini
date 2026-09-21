import { api } from "../api.js";
import { CONFIG } from "../config.js";
import { notify, haptic } from "../telegram.js";
import { money, pageTop } from "../utils.js";

export default {
  async render(el, { go }) {
    const me = await api.getMe();

    el.innerHTML = `
      <section class="page">
        ${pageTop("Withdrawal", "Cash out your balance")}
        <div class="body">
          <div class="card">
            <div class="row"><span class="l">Available</span><span class="r">${money(me.balance)}</span></div>
            <div class="row"><span class="l">Minimum</span><span class="r">${money(CONFIG.MIN_WITHDRAW)}</span></div>
            <label for="amount">Amount (USD)</label>
            <input id="amount" type="number" inputmode="decimal" placeholder="0.00">
            <label for="addr">Wallet address</label>
            <input id="addr" type="text" placeholder="Paste your wallet address">
            <div class="gap" style="height:16px"></div>
            <button class="btn" id="submit">Request withdrawal</button>
          </div>
        </div>
      </section>`;

    const btn = el.querySelector("#submit");
    btn.addEventListener("click", async () => {
      const amount = parseFloat(el.querySelector("#amount").value);
      const address = el.querySelector("#addr").value.trim();

      if (!amount || amount < CONFIG.MIN_WITHDRAW) { haptic("error"); return notify("Minimum withdrawal is " + money(CONFIG.MIN_WITHDRAW) + "."); }
      if (amount > me.balance) { haptic("error"); return notify("Amount is higher than your balance."); }
      if (address.length < 10) { haptic("error"); return notify("Enter a valid wallet address."); }

      btn.disabled = true;
      try {
        await api.requestWithdrawal({ amount, address });
        haptic("success");
        notify("Withdrawal requested. It's now pending review.");
        go("history");
      } catch (err) {
        haptic("error");
        notify(err.message);
        btn.disabled = false;
      }
    });
  }
};
