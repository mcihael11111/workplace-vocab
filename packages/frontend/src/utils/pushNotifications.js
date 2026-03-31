// Push notification helpers.
// Handles service worker registration and notification permission.

export async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    return registration;
  } catch (err) {
    console.warn("SW registration failed:", err);
    return null;
  }
}

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  const result = await Notification.requestPermission();
  return result;
}

export function sendLocalNotification(title, body, options = {}) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(title, { body, icon: "/icons/icon-192.png", badge: "/icons/icon-192.png", ...options });
}

// Schedule a daily review reminder at a given hour (uses setTimeout, not a real scheduler)
// This runs only while the tab is open. For real push notifications, use Firebase Cloud Messaging.
export function scheduleReviewReminder(dueCount, hour = 9) {
  if (dueCount <= 0) return;

  const now = new Date();
  const target = new Date();
  target.setHours(hour, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);

  const delay = target.getTime() - now.getTime();
  setTimeout(() => {
    sendLocalNotification(
      "Time to review",
      `You have ${dueCount} card${dueCount === 1 ? "" : "s"} due for review.`,
    );
  }, delay);
}
