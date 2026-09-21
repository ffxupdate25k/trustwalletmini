import { api } from "../api.js";
import { tap, haptic, notify, openLink } from "../telegram.js";
import { esc, money, pageTop } from "../utils.js";

function rowHTML(t) {
  const action =
    t.status === "done"    ? `<span class="badge b-ok">Done</span>` :
    t.status === "started" ? `<button class="btn sm" data-claim="${t.id}">Claim</button>` :
                             `<button class="btn sm ghost" data-start="${t.id}">Start</button>`;
  return `
    <div class="task">
      <div class="t"><b>${esc(t.title)}</b><small>Reward ${money(t.reward)}</small></div>
      ${action}
    </div>`;
}

export default {
  async render(el) {
    let tasks = await api.getTasks();

    el.innerHTML = `
      <section class="page">
        ${pageTop("Task", "Complete tasks to earn rewards")}
        <div class="body"><div class="card" id="list"></div></div>
      </section>`;

    const list = el.querySelector("#list");
    const draw = () => {
      list.innerHTML = tasks.length ? tasks.map(rowHTML).join("")
        : `<div class="empty">No tasks right now.<br>Check back soon.</div>`;
    };
    draw();

    list.addEventListener("click", async (e) => {
      const startId = e.target.dataset.start;
      const claimId = e.target.dataset.claim;
      try {
        if (startId) {
          tap();
          const task = tasks.find((x) => String(x.id) === startId);
          openLink(task.url);
          await api.startTask(task.id);
          tasks = await api.getTasks();
          draw();
        }
        if (claimId) {
          await api.claimTask(isNaN(claimId) ? claimId : Number(claimId));
          haptic("success");
          tasks = await api.getTasks();
          draw();
        }
      } catch (err) {
        haptic("error");
        notify(err.message);
      }
    });
  }
};
