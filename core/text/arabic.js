// تطبيع النص العربي للمقارنة والبحث، ومسافة التحرير للتسامح بالإملاء.

export function normalize(s = '') {
  return String(s)
    .toLowerCase()
    .replace(/[ً-ٰٟۖ-ۭ]/g, '') // التشكيل
    .replace(/ـ/g, '')                            // التطويل
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** يحذف «ال» التعريف من أول كل كلمة */
export const stripAl = (s) => s.split(' ').map(w => (w.startsWith('ال') && w.length > 3 ? w.slice(2) : w)).join(' ');

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}

/** هل الجواب المكتوب يطابق أحد الأجوبة المقبولة، مع تسامح بالإملاء؟ */
export function fuzzyMatch(input, accepted) {
  const x = stripAl(normalize(input));
  if (!x) return false;
  return accepted.some(a => {
    const y = stripAl(normalize(a));
    const tol = Math.max(1, Math.floor(y.length / 5));
    return levenshtein(x, y) <= tol;
  });
}
