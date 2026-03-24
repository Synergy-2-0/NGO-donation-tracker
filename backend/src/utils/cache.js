/**
 * Simple in-memory cache with TTL support.
 * Use Redis in production for multi-instance deployments.
 */
const store = new Map();

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export function setCache(key, value, ttlSeconds = 3600) {
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function deleteCache(key) {
  store.delete(key);
}

export function clearCache() {
  store.clear();
}
