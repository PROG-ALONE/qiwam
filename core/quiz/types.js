// أنواع الأسئلة. كل نوع: render(q, el, ctx) ← { check(): { correct, key } , lock() }
// key: مفتاح الجواب الخاطئ لعرض شرحه (معرّف الخيار، أو 'default').

import { h } from '../ui/dom.js';
import { fuzzyMatch } from '../text/arabic.js';
import entities from '../../content/entities.js';
import { loadVisual } from '../content.js';

export const shuffle = (a) => { const x = [...a]; for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };

function optionList(q, el, { multi = false } = {}) {
  const name = `q-${q.id}-${Math.random().toString(36).slice(2, 7)}`;
  const opts = shuffle(q.options);
  const list = h('div.qz-options', { role: multi ? 'group' : 'radiogroup' },
    opts.map(o => h('label.qz-opt', { 'data-id': o.id },
      h('input', { type: multi ? 'checkbox' : 'radio', name, value: o.id }),
      h('span', o.text))));
  el.append(list);
  const chosen = () => [...list.querySelectorAll('input:checked')].map(i => i.value);
  return { list, chosen };
}

const T = {};

T.mcq = (q, el) => {
  const { list, chosen } = optionList(q, el);
  return {
    ready: () => chosen().length === 1,
    check() {
      const c = chosen()[0];
      list.querySelectorAll('.qz-opt').forEach(l => { l.classList.toggle('is-right', l.dataset.id === q.correct); l.classList.toggle('is-wrong', l.dataset.id === c && c !== q.correct); });
      return { correct: c === q.correct, key: c };
    },
    lock: () => list.querySelectorAll('input').forEach(i => (i.disabled = true)),
  };
};
T.case = (q, el) => { el.append(h('p.qz-vignette', q.vignette)); return T.mcq(q, el); };
T.image = (q, el) => {
  el.append(h('figure.qz-img', h('img', { src: q.img.src, alt: q.img.alt, loading: 'lazy' }), q.img.caption ? h('figcaption', q.img.caption) : null));
  return T.mcq(q, el);
};

T.multi = (q, el) => {
  const { list, chosen } = optionList(q, el, { multi: true });
  return {
    ready: () => chosen().length > 0,
    check() {
      const c = chosen(), set = new Set(q.correct);
      list.querySelectorAll('.qz-opt').forEach(l => { l.classList.toggle('is-right', set.has(l.dataset.id)); l.classList.toggle('is-wrong', c.includes(l.dataset.id) && !set.has(l.dataset.id)); });
      const ok = c.length === set.size && c.every(x => set.has(x));
      return { correct: ok, key: c.find(x => !set.has(x)) || 'default' };
    },
    lock: () => list.querySelectorAll('input').forEach(i => (i.disabled = true)),
  };
};

T.hotspot = async (q, el) => {
  const vis = await loadVisual(q.visual);
  let picked = null, mark = null;
  const holder = h('div.qz-visual');
  el.append(holder);
  const api = vis.mount(holder, {
    mode: 'pick',
    onPick: (id, node, e) => {
      picked = id || '__none';
      Object.values(api.regions).forEach(r => r.classList.remove('is-picked'));
      node?.classList.add('is-picked');
      const p = api.svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const sp = p.matrixTransform(api.svg.getScreenCTM().inverse());
      mark?.remove();
      mark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      Object.entries({ cx: sp.x, cy: sp.y, r: 6, class: 'qz-mark' }).forEach(([k, v]) => mark.setAttribute(k, v));
      api.svg.append(mark);
    },
  });
  return {
    ready: () => picked !== null,
    check() {
      api.regions[q.target].classList.add('is-right');
      if (picked !== q.target) api.regions[picked]?.classList.add('is-wrong');
      return { correct: picked === q.target, key: 'default' };
    },
    lock: () => api.svg.classList.add('is-locked'),
  };
};

T['name-it'] = async (q, el) => {
  const vis = await loadVisual(q.visual);
  const holder = h('div.qz-visual');
  el.append(holder);
  vis.mount(holder, { mode: 'highlight', highlight: q.highlight });
  const ent = entities[q.entity];
  const accepted = [ent.ar, ent.en, ent.la, ...(q.accept || [])].filter(Boolean);
  const input = h('input.qz-text', { type: 'text', autocomplete: 'off', 'aria-label': 'اسم العضو', placeholder: 'اكتب الاسم هنا' });
  el.append(input);
  return {
    ready: () => input.value.trim().length > 0,
    check() { const ok = fuzzyMatch(input.value, accepted); input.classList.add(ok ? 'is-right' : 'is-wrong'); return { correct: ok, key: 'default' }; },
    lock: () => (input.disabled = true),
  };
};

T['drag-label'] = async (q, el) => {
  const vis = await loadVisual(q.visual);
  const placed = {}; // entity on region ← label entity
  let selected = null;
  const chips = h('div.qz-chips', shuffle(q.labels).map(id => {
    const c = h('button.qz-chip', { type: 'button', 'data-e': id, draggable: 'true' }, entities[id].ar);
    c.addEventListener('click', () => { selected = id; chips.querySelectorAll('.qz-chip').forEach(x => x.classList.toggle('is-selected', x === c)); });
    c.addEventListener('dragstart', e => { selected = id; e.dataTransfer.setData('text/plain', id); });
    return c;
  }));
  const holder = h('div.qz-visual');
  el.append(chips, holder);
  const tags = {};
  const place = (regionId) => {
    if (!selected) return;
    for (const [r, l] of Object.entries(placed)) if (l === selected) { delete placed[r]; tags[r]?.remove(); }
    placed[regionId] = selected;
    const bb = api.regions[regionId].getBBox();
    tags[regionId]?.remove();
    const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    Object.entries({ x: bb.x + bb.width / 2, y: bb.y + bb.height / 2, class: 'qz-tag', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }).forEach(([k, v]) => t.setAttribute(k, v));
    t.textContent = entities[selected].ar;
    api.svg.append(t);
    tags[regionId] = t;
    chips.querySelector(`[data-e="${selected}"]`).classList.add('is-used');
    chips.querySelectorAll('.qz-chip').forEach(x => x.classList.remove('is-selected'));
    selected = null;
  };
  const api = vis.mount(holder, { mode: 'targets', onPick: (id) => id && place(id) });
  Object.entries(api.regions).forEach(([id, r]) => {
    r.addEventListener('dragover', e => e.preventDefault());
    r.addEventListener('drop', e => { e.preventDefault(); selected = e.dataTransfer.getData('text/plain'); place(id); });
  });
  return {
    ready: () => Object.keys(placed).length === q.labels.length,
    check() {
      let ok = true;
      for (const [r, l] of Object.entries(placed)) { const good = r === l; ok &&= good; tags[r].classList.add(good ? 'is-right' : 'is-wrong'); }
      return { correct: ok && Object.keys(placed).length === q.labels.length, key: 'default' };
    },
    lock: () => { api.svg.classList.add('is-locked'); chips.querySelectorAll('button').forEach(b => (b.disabled = true)); },
  };
};

T.match = (q, el) => {
  const pairs = {}; let left = null;
  const colors = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  const L = h('div.qz-col', q.left.map(x => h('button.qz-m', { type: 'button', 'data-side': 'l', 'data-id': x.id }, x.text)));
  const R = h('div.qz-col', shuffle(q.right).map(x => h('button.qz-m', { type: 'button', 'data-side': 'r', 'data-id': x.id }, x.text)));
  const paint = () => {
    el.querySelectorAll('.qz-m').forEach(b => { b.className = 'qz-m'; });
    Object.entries(pairs).forEach(([l, r], i) => {
      L.querySelector(`[data-id="${l}"]`).classList.add('is-paired', colors[i % 6]);
      R.querySelector(`[data-id="${r}"]`).classList.add('is-paired', colors[i % 6]);
    });
    if (left) L.querySelector(`[data-id="${left}"]`).classList.add('is-selected');
  };
  L.addEventListener('click', e => { const b = e.target.closest('.qz-m'); if (!b) return; left = b.dataset.id; delete pairs[left]; paint(); });
  R.addEventListener('click', e => {
    const b = e.target.closest('.qz-m'); if (!b || !left) return;
    for (const [l, r] of Object.entries(pairs)) if (r === b.dataset.id) delete pairs[l];
    pairs[left] = b.dataset.id; left = null; paint();
  });
  el.append(h('p.qz-help', 'اضغط على عنصر من اليمين، ثم على ما يقابله من اليسار.'), h('div.qz-match', L, R));
  return {
    ready: () => Object.keys(pairs).length === q.left.length,
    check() {
      let ok = true;
      for (const [l, r] of Object.entries(pairs)) { const good = q.pairs[l] === r; ok &&= good; L.querySelector(`[data-id="${l}"]`).classList.add(good ? 'is-right' : 'is-wrong'); }
      return { correct: ok, key: 'default' };
    },
    lock: () => el.querySelectorAll('.qz-m').forEach(b => (b.disabled = true)),
  };
};

T.order = (q, el) => {
  let items = shuffle(q.items);
  if (items.every((x, i) => x.id === q.items[i].id)) items = items.reverse();
  const list = h('ol.qz-order');
  const draw = () => {
    list.replaceChildren(...items.map((x, i) => h('li.qz-ord', { 'data-id': x.id },
      h('span.qz-ord-text', x.text),
      h('span.qz-ord-btns',
        h('button.qz-ord-btn', { type: 'button', 'aria-label': `انقل «${x.text}» إلى الأعلى`, disabled: i === 0, onclick: () => { [items[i - 1], items[i]] = [items[i], items[i - 1]]; draw(); } }, '▲'),
        h('button.qz-ord-btn', { type: 'button', 'aria-label': `انقل «${x.text}» إلى الأسفل`, disabled: i === items.length - 1, onclick: () => { [items[i + 1], items[i]] = [items[i], items[i + 1]]; draw(); } }, '▼')))));
  };
  draw();
  el.append(h('p.qz-help', 'استخدم الأسهم لترتيب العناصر من الأعلى إلى الأسفل.'), list);
  return {
    ready: () => true,
    check() {
      let ok = true;
      list.querySelectorAll('.qz-ord').forEach((li, i) => { const good = li.dataset.id === q.items[i].id; ok &&= good; li.classList.add(good ? 'is-right' : 'is-wrong'); });
      return { correct: ok, key: 'default' };
    },
    lock: () => list.querySelectorAll('button').forEach(b => (b.disabled = true)),
  };
};

T['tf-why'] = (q, el) => {
  const name = `tf-${q.id}`;
  const tf = h('div.qz-tf', { role: 'radiogroup', 'aria-label': 'صح أم خطأ' },
    h('label.qz-opt', { 'data-id': 'true' }, h('input', { type: 'radio', name, value: 'true' }), h('span', 'صح')),
    h('label.qz-opt', { 'data-id': 'false' }, h('input', { type: 'radio', name, value: 'false' }), h('span', 'خطأ')));
  const reasons = shuffle(q.reasons);
  const rname = `${name}-r`;
  const rl = h('div.qz-options', { role: 'radiogroup', 'aria-label': 'السبب' }, reasons.map(r => h('label.qz-opt', { 'data-id': r.id }, h('input', { type: 'radio', name: rname, value: r.id }), h('span', r.text))));
  el.append(h('blockquote.qz-claim', q.stem), tf, h('p.qz-help', 'ثم اختر السبب:'), rl);
  const val = (n) => el.querySelector(`input[name="${n}"]:checked`)?.value;
  return {
    stemShown: true,
    ready: () => val(name) && val(rname),
    check() {
      const a = val(name) === String(q.answer), r = val(rname);
      tf.querySelectorAll('.qz-opt').forEach(l => l.classList.toggle('is-right', l.dataset.id === String(q.answer)));
      rl.querySelectorAll('.qz-opt').forEach(l => { l.classList.toggle('is-right', l.dataset.id === q.reason); l.classList.toggle('is-wrong', l.dataset.id === r && r !== q.reason); });
      return { correct: a && r === q.reason, key: !a ? 'tf' : r };
    },
    lock: () => el.querySelectorAll('input').forEach(i => (i.disabled = true)),
  };
};

T.calc = (q, el) => {
  const input = h('input.qz-text.qz-num.ltr', { type: 'number', inputmode: 'decimal', step: 'any', 'aria-label': 'الجواب' });
  el.append(h('div.qz-calc', input, q.unit ? h('span.qz-unit', q.unit) : null));
  return {
    ready: () => input.value !== '',
    check() { const ok = Math.abs(+input.value - q.answer) <= (q.tolerance ?? 0); input.classList.add(ok ? 'is-right' : 'is-wrong'); return { correct: ok, key: 'default' }; },
    lock: () => (input.disabled = true),
  };
};

export const TYPES = T;
export const TYPE_NAMES = {
  mcq: 'اختيار من متعدد', multi: 'عدة إجابات', hotspot: 'اضغط على المكان', 'name-it': 'ما اسمه؟', 'drag-label': 'ضع الأسماء',
  match: 'مطابقة', order: 'ترتيب', 'tf-why': 'صح أم خطأ مع السبب', case: 'حالة', image: 'صورة', calc: 'حساب',
};
