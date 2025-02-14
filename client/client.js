async function getPublicKey() {
  const res = await fetch("/config");
  const data = await res.json();
  return data.publicVapidKey;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/worker.js", { scope: "/" })
    .then(() => console.log("Service Worker Registered..."))
    .catch((err) => console.error("Service Worker Registration Failed:", err));
}

window.enableNotifications = async function () {
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers are not supported.");
    return;
  }

  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.ready;

  const publicVapidKey = await getPublicKey();

  console.log("Subscribing to push notifications...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });

  console.log("Sending subscription to server...");
  await fetch("/notifications/enable", {
    method: "POST",
    body: JSON.stringify({ subscription }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  console.log("Push Subscription Sent:", subscription);
};

window.disableNotifications = async function () {
  if (!("serviceWorker" in navigator)) {
    console.error("Service workers are not supported.");
    return;
  }

  console.log("Unsubscribing from push notifications...");
  const register = await navigator.serviceWorker.ready;
  const subscription = await register.pushManager.getSubscription();

  if (subscription) {
    await subscription.unsubscribe();

    console.log("Sending unsubscription to server...");
    await fetch("/notifications/disable", {
      method: "POST",
      body: JSON.stringify({ subscription }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Push Subscription Disabled.");
  } else {
    console.log("No active subscription found.");
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}
