// الموجّه: مسارات hash، وتحميل كسول للصفحات والأجنحة، وحفظ موضع التمرير.

const routes = [];
let guard = null;
let current = null;
const scrollMemo = new Map();

/** route('#/map', loader) — loader يرجع Promise لوحدة فيها render(root, params) */
export function route(pattern, loader) {
  const keys = [];
  const re = new RegExp('^' + pattern.replace(/:([a-z]+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
  routes.push({ re, keys, loader });
}

/** دالة حارس: ترجع مسار تحويل أو null */
export function setGuard(fn) { guard = fn; }

export function go(hash, { replace = false } = {}) {
  if (replace) { history.replaceState(null, '', hash); render(); }
  else if (location.hash === hash) render();
  else location.hash = hash;
}

export function currentPath() { return (location.hash || '#/').split('?')[0]; }

async function render() {
  const path = currentPath();
  const redirect = guard?.(path);
  if (redirect && redirect !== path) return go(redirect, { replace: true });

  if (current) scrollMemo.set(current, window.scrollY);

  for (const r of routes) {
    const m = path.match(r.re);
    if (!m) continue;
    const params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
    const root = document.getElementById('app');
    try {
      const mod = await r.loader();
      if (currentPath() !== path) return; // تغيّر المسار أثناء التحميل
      root.replaceChildren();
      document.body.dataset.route = path.split('/')[1] || 'home';
      await mod.render(root, params);
      current = path;
      requestAnimationFrame(() => window.scrollTo(0, scrollMemo.get(path) ?? 0));
      const h1 = root.querySelector('h1');
      if (h1) document.title = `${h1.textContent.trim()} — قِوام`;
    } catch (err) {
      console.error(err);
      root.replaceChildren(Object.assign(document.createElement('p'), { className: 'noscript', textContent: 'تعذّر فتح هذه الصفحة. حدّث الصفحة وحاول مرة أخرى.' }));
    }
    return;
  }
  go('#/', { replace: true });
}

export function start() {
  window.addEventListener('hashchange', render);
  render();
}
