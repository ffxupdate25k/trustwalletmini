// Everything that touches the Telegram WebApp SDK lives here.
export const tg = window.Telegram && window.Telegram.WebApp;

// initData is empty when the page is opened in a normal browser.
export const isTelegram = () => !!(tg && tg.initData && tg.initData.length > 0);

export function initTelegram() {
  tg.ready();
  tg.expand();
  try {
    tg.setHeaderColor("#1e6bff");
    tg.setBackgroundColor("#f3f8ff");
    if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
  } catch (e) { /* older clients */ }
}

export const getUser = () => (tg.initDataUnsafe && tg.initDataUnsafe.user) || {};

export function getDisplayName() {
  const u = getUser();
  return [u.first_name, u.last_name].filter(Boolean).join(" ") || "Telegram User";
}

export function notify(message) {
  try { tg.showPopup({ message, buttons: [{ type: "ok" }] }); }
  catch (e) { alert(message); }
}

export function haptic(type) {
  try { tg.HapticFeedback.notificationOccurred(type); } catch (e) {}
}
export function tap() {
  try { tg.HapticFeedback.impactOccurred("light"); } catch (e) {}
}

export function openLink(url) {
  try { tg.openLink(url); } catch (e) { window.open(url, "_blank"); }
}
export function openTelegramLink(url) {
  try { tg.openTelegramLink(url); } catch (e) { window.open(url, "_blank"); }
}

export const backButton = {
  show: () => tg.BackButton.show(),
  hide: () => tg.BackButton.hide(),
  onClick: (fn) => tg.BackButton.onClick(fn)
};
