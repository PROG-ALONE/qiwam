// مساعدات DOM صغيرة بدون إطار عمل

/** h('div.cls#id', {attrs}, ...children) */
export function h(tag, attrs, ...children) {
  if (attrs == null || typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs)) {
    if (attrs != null) children.unshift(attrs);
    attrs = {};
  }
  const [name, ...rest] = tag.split(/(?=[.#])/);
  const el = document.createElement(name || 'div');
  rest.forEach(p => p[0] === '.' ? el.classList.add(p.slice(1)) : (el.id = p.slice(1)));
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') {
      for (const [p, val] of Object.entries(v)) {
        if (p.startsWith('--')) el.style.setProperty(p, val); else el.style[p] = val;
      }
    }
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  append(el, children);
  return el;
}

function append(el, children) {
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
}

const SVGNS = 'http://www.w3.org/2000/svg';
/** s('path', {d: ...}) — عناصر SVG */
export function s(tag, attrs = {}, ...children) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else el.setAttribute(k, v);
  }
  for (const c of children.flat(Infinity)) if (c != null && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const wait = (ms) => new Promise(r => setTimeout(r, ms));

/** أرقام عربية-هندية؟ لا: نستخدم الأرقام الغربية لأنها أوضح بالمحتوى العلمي */
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/** يكتب النص حرف حرف. يرجع { done: Promise, finish() } */
export function typewriter(el, text, { speed = 42 } = {}) {
  let i = 0, timer = null, resolve;
  const done = new Promise(r => (resolve = r));
  const finish = () => { clearTimeout(timer); el.textContent = text; el.classList.add('is-typed'); resolve(); };
  if (reducedMotion()) { finish(); return { done, finish }; }
  el.textContent = '';
  const tick = () => {
    i++;
    el.textContent = text.slice(0, i);
    if (i >= text.length) return finish();
    const ch = text[i - 1];
    timer = setTimeout(tick, /[.،؟:]/.test(ch) ? speed * 9 : speed);
  };
  timer = setTimeout(tick, 400);
  return { done, finish };
}

/** نقطة المؤشر بإحداثيات SVG */
export function svgPoint(svg, evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}
