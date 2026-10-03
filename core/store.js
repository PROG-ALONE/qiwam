// التخزين المحلي — كل المفاتيح بالشكل qiwam.<ns>.<key>
// كل قيمة تنحفظ مع updatedAt حتى يشتغل الدمج (الأحدث يفوز) بمرحلة التصدير والاستيراد.

const PREFIX = 'qiwam.';
const memory = new Map(); // بديل إذا التخزين مقفول (تصفح خاص مثلاً)

function safeGet(k) {
  try { return localStorage.getItem(k); } catch { return memory.get(k) ?? null; }
}
function safeSet(k, v) {
  try { localStorage.setItem(k, v); } catch { memory.set(k, v); }
}
function safeRemove(k) {
  try { localStorage.removeItem(k); } catch { memory.delete(k); }
}

export function get(ns, key, fallback = null) {
  const raw = safeGet(`${PREFIX}${ns}.${key}`);
  if (raw == null) return fallback;
  try {
    const rec = JSON.parse(raw);
    return rec && 'v' in rec ? rec.v : fallback;
  } catch { return fallback; }
}

export function set(ns, key, value) {
  safeSet(`${PREFIX}${ns}.${key}`, JSON.stringify({ v: value, updatedAt: Date.now() }));
  listeners.forEach(fn => { try { fn(ns, key, value); } catch {} });
}

export function remove(ns, key) { safeRemove(`${PREFIX}${ns}.${key}`); }

export function update(ns, key, fn, fallback) {
  const next = fn(get(ns, key, fallback));
  set(ns, key, next);
  return next;
}

const listeners = new Set();
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

/** يمسح كل بيانات قِوام من هذا الجهاز */
export function clearAll() {
  try {
    Object.keys(localStorage).filter(k => k.startsWith(PREFIX)).forEach(k => localStorage.removeItem(k));
  } catch {}
  memory.clear();
}
