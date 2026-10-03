// الوصول إلى المراجع: 'ref.id' أو 'ref.id:الموضع'
import { REFS, EVIDENCE } from '../../content/refs/index.js';

export function parseCite(r) {
  const i = r.indexOf(':');
  return i < 0 ? { id: r, loc: null } : { id: r.slice(0, i), loc: r.slice(i + 1) };
}
export const getRef = (id) => REFS[id] || null;
export const allRefs = () => Object.entries(REFS).map(([id, r]) => ({ id, ...r }));
export const evidenceName = (e) => EVIDENCE[e] || e;
export const plainApa = (r) => r.apa.replace(/<[^>]+>/g, '');

/** هل ملف الـ PDF موجود فعلًا؟ (يُنزَّل على جهازك بالسكربت) */
const pdfCache = new Map();
export async function pdfAvailable(path) {
  if (!path) return false;
  if (!pdfCache.has(path)) pdfCache.set(path, fetch(path, { method: 'HEAD' }).then(r => r.ok && /pdf/.test(r.headers.get('content-type') || 'pdf')).catch(() => false));
  return pdfCache.get(path);
}
