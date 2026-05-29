/**
 * Cross-tab auth communication using BroadcastChannel API.
 * When a user logs out in one tab, all other tabs are notified
 * and redirected to the appropriate page.
 */

const CHANNEL_NAME = "adyapan-auth";

type AuthMessage = {
  type: "logout" | "login";
  role?: string;
  timestamp: number;
};

/**
 * Broadcast a logout event to all other open tabs.
 */
export function broadcastLogout() {
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const message: AuthMessage = { type: "logout", timestamp: Date.now() };
    channel.postMessage(message);
    channel.close();
  } catch {
    // BroadcastChannel not supported — fallback to localStorage event
    try {
      localStorage.setItem("adyapan-logout", String(Date.now()));
      localStorage.removeItem("adyapan-logout");
    } catch {
      // localStorage not available
    }
  }
}

/**
 * Broadcast a login event to all other open tabs.
 */
export function broadcastLogin(role?: string) {
  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    const message: AuthMessage = { type: "login", role, timestamp: Date.now() };
    channel.postMessage(message);
    channel.close();
  } catch {
    try {
      localStorage.setItem("adyapan-login", String(Date.now()));
      localStorage.removeItem("adyapan-login");
    } catch {
      // localStorage not available
    }
  }
}

/**
 * Listen for auth events from other tabs.
 * Returns a cleanup function to stop listening.
 */
export function onAuthChange(callback: (message: AuthMessage) => void): () => void {
  const cleanups: Array<() => void> = [];

  try {
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data && typeof event.data.type === "string") {
        callback(event.data as AuthMessage);
      }
    };
    cleanups.push(() => channel.close());
  } catch {
    // Fallback: listen to localStorage changes for cross-tab communication
  }

  // localStorage fallback for browsers without BroadcastChannel
  function handleStorage(event: StorageEvent) {
    if (event.key === "adyapan-logout") {
      callback({ type: "logout", timestamp: Date.now() });
    } else if (event.key === "adyapan-login") {
      callback({ type: "login", timestamp: Date.now() });
    }
  }

  window.addEventListener("storage", handleStorage);
  cleanups.push(() => window.removeEventListener("storage", handleStorage));

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
