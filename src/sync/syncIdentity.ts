import { createSyncId } from "@/utils/ids";

const DEVICE_ID_KEY = "jm-tasks:device-id";

let memoryDeviceId: string | null = null;

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch (error) {
    console.warn("Local storage unavailable, using in-memory device id.", error);
    return null;
  }
}

export function getDeviceId(): string {
  const storage = getStorage();

  if (storage) {
    const existing = storage.getItem(DEVICE_ID_KEY);
    if (existing) {
      return existing;
    }

    const nextId = createSyncId();
    storage.setItem(DEVICE_ID_KEY, nextId);
    return nextId;
  }

  if (!memoryDeviceId) {
    memoryDeviceId = createSyncId();
  }

  return memoryDeviceId;
}

export function resetDeviceIdForTests(): void {
  memoryDeviceId = null;
  const storage = getStorage();
  storage?.removeItem(DEVICE_ID_KEY);
}
