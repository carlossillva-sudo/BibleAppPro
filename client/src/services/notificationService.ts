type Platform = 'web' | 'ios' | 'android';

function detectPlatform(): Platform {
  if (typeof window !== 'undefined' && navigator && /Android/.test(navigator.userAgent)) return 'android';
  if (typeof window !== 'undefined' && navigator && /iPhone|iPad|iPod/.test(navigator.userAgent)) return 'ios';
  return 'web';
}

const storageKey = 'scheduledNotifications';

export async function requestPermission(): Promise<NotificationPermission> {
  if (detectPlatform() === 'web' && 'Notification' in window) {
    return await Notification.requestPermission();
  }
  return 'granted';
}

export function scheduleDailyVerseNotification(time: string): string {
  const id = `daily-${time}`;
  save({ id, type: 'daily', time });
  return id;
}

export function scheduleReadingReminder(time: string): string {
  const id = `reading-${time}`;
  save({ id, type: 'reading', time });
  return id;
}

export function cancelNotification(id: string) {
  const list = getScheduledNotifications().filter((n) => n.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(list));
}

export function cancelAllNotifications() {
  localStorage.removeItem(storageKey);
}

export function getScheduledNotifications(): { id: string; type: string; time: string }[] {
  const data = localStorage.getItem(storageKey);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function save(entry: { id: string; type: string; time: string }) {
  const list = getScheduledNotifications();
  const idx = list.findIndex((n) => n.id === entry.id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  localStorage.setItem(storageKey, JSON.stringify(list));
}
