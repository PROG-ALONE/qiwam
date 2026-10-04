// خلية حيوانية مفصّلة (رسم تخطيطي، ليس بمقياس رسم): اضغط على أي جزء لترى اسمه ووظيفته،
// أو العب «اعثر على» لتختبر نفسك.
// الأوصاف من OpenStax A&P 2e: الخلية والسيتوبلازم والعضيّات (1.2)، والسيتوبلازم والعضيّات (3.2)، والنواة (3.3).
import { h, s } from '../../ui/dom.js';

const PARTS = {
  membrane:  { ar: 'غشاء الخلية', en: 'Cell membrane', note: 'غلاف مرن يحيط بالخلية ويفصل داخلها عن خارجها.' },
  cytoplasm: { ar: 'السيتوبلازم', en: 'Cytoplasm', note: 'السائل الداخلي الذي تسبح فيه العضيّات.' },
  nucleus:   { ar: 'النواة', en: 'Nucleus', note: 'أكبر عضيّة في الخلية، وفيها التعليمات الوراثية (DNA).' },
  envelope:  { ar: 'الغلاف النووي', en: 'Nuclear envelope', note: 'غشاءان يحيطان بالنواة، تتخللهما ثقوب نووية تعبر منها المواد.' },
  nucleolus: { ar: 'النُّوَيّة', en: 'Nucleolus', note: 'منطقة داخل النواة تصنع الحمض النووي الريبي (RNA) اللازم لبناء الريبوسومات.' },
  mito:      { ar: 'الميتوكوندريا', en: 'Mitochondrion', note: '«محوّل الطاقة» في الخلية. لها غشاءان، والداخلي مطويّ في أعراف (Cristae).' },
  rer:       { ar: 'الشبكة الإندوبلازمية الخشنة', en: 'Rough ER', note: 'أغشية مطويّة ترصّعها الريبوسومات، فيها تُصنع البروتينات وتُعدَّل.' },
  ser:       { ar: 'الشبكة الإندوبلازمية الملساء', en: 'Smooth ER', note: 'أنابيب بلا ريبوسومات، تصنع الدهون كالدهون الفسفورية والستيرويدات.' },
  golgi:     { ar: 'جهاز غولجي', en: 'Golgi apparatus', note: 'أكياس مسطحة متراصّة: يفرز البروتينات ويعدّلها ويغلّفها ثم يشحنها.' },
  lyso:      { ar: 'الجسيم الحالّ', en: 'Lysosome', note: 'كيس فيه إنزيمات تهضم ما لم تعد الخلية تحتاج إليه.' },
  ribo:      { ar: 'الريبوسومات', en: 'Ribosomes', note: 'مواقع صنع البروتين: بعضها حرّ في السيتوبلازم، وبعضها على الشبكة الخشنة.' },
};

const NX = 170, NY = 142; // مركز النواة

function arc(cx, cy, r, a0, a1) {
  const p = (a) => [cx + r * Math.cos(a * Math.PI / 180), cy + r * Math.sin(a * Math.PI / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
}

function mito(x, y, rot) {
  return s('g', { 'data-part': 'mito', transform: `translate(${x} ${y}) rotate(${rot})` },
    s('ellipse', { class: 'cv-mito-out', rx: 32, ry: 14 }),
    s('ellipse', { class: 'cv-mito-in', rx: 28, ry: 10.5 }),
    s('path', { class: 'cv-cristae', d: 'M-24 0 L-20 -9 L-16 8 L-11 -9 L-6 8 L-1 -9 L4 8 L9 -9 L14 8 L19 -9 L23 0' }));
}

function draw(svg) {
  const g = (part, ...kids) => s('g', { 'data-part': part }, ...kids);
  // السيتوبلازم ثم الغشاء (طبقتان: الغشاء ثنائي الطبقة)
  svg.append(
    g('cytoplasm', s('ellipse', { class: 'cv-cyto', cx: 210, cy: 145, rx: 196, ry: 132 })),
    g('membrane',
      s('ellipse', { class: 'cv-mem-hit', cx: 210, cy: 145, rx: 196, ry: 132 }),
      s('ellipse', { class: 'cv-mem', cx: 210, cy: 145, rx: 198, ry: 134 }),
      s('ellipse', { class: 'cv-mem cv-mem-2', cx: 210, cy: 145, rx: 193, ry: 129 })),
  );
  // الشبكة الخشنة: أقواس متوازية حول النواة مرصّعة بالريبوسومات
  const rer = g('rer');
  [66, 77, 88].forEach((r, i) => {
    rer.append(s('path', { class: 'cv-er', d: arc(NX, NY, r, -62 + i * 4, 58 - i * 4) }));
    for (let a = -58 + i * 4; a <= 54 - i * 4; a += 9) rer.append(s('circle', { class: 'cv-ribo-dot', cx: NX + (r + 4) * Math.cos(a * Math.PI / 180), cy: NY + (r + 4) * Math.sin(a * Math.PI / 180), r: 1.8 }));
  });
  // الشبكة الملساء: أنابيب متعرجة بلا ريبوسومات
  const ser = g('ser',
    s('path', { class: 'cv-er', d: 'M70 196 q12 -14 24 0 t24 0 t24 0' }),
    s('path', { class: 'cv-er', d: 'M76 214 q12 -12 24 0 t24 0 t22 0' }),
    s('path', { class: 'cv-er', d: 'M88 232 q10 -10 20 0 t20 0' }));
  // النواة: السائل النووي والكروماتين، ثم الغلاف بثقوبه، ثم النوية
  const nucleus = g('nucleus',
    s('circle', { class: 'cv-nuc', cx: NX, cy: NY, r: 50 }),
    s('path', { class: 'cv-chrom', d: `M${NX - 30} ${NY - 10} q8 -12 16 -2 t14 6 M${NX - 26} ${NY + 18} q10 6 18 -4 t18 2 M${NX + 8} ${NY + 26} q8 -8 18 0 M${NX - 8} ${NY - 30} q10 4 20 -4` }));
  const envelope = g('envelope',
    s('circle', { class: 'cv-env-hit', cx: NX, cy: NY, r: 53 }),
    s('circle', { class: 'cv-env', cx: NX, cy: NY, r: 53, 'stroke-dasharray': '28.3 5' }),
    s('circle', { class: 'cv-env-gap', cx: NX, cy: NY, r: 53, 'stroke-dasharray': '28.3 5' }));
  const nucleolus = g('nucleolus', s('circle', { class: 'cv-nucleolus', cx: NX + 12, cy: NY - 8, r: 15 }));
  // جهاز غولجي: أكياس مقوّسة متراصة وحويصلات تنفصل عنها
  const golgi = g('golgi',
    ...[0, 1, 2, 3, 4].map(i => s('path', { class: 'cv-golgi', d: `M${300 + i * 9} ${108 + i * 2} q${-22 + i} 36 0 ${72 - i * 4}` })),
    ...[[346, 116], [352, 134], [350, 182], [340, 196], [292, 100]].map(([cx, cy]) => s('circle', { class: 'cv-ves', cx, cy, r: 4.5 })));
  // الجسيمات الحالّة: أكياس فيها حبيبات إنزيمات
  const lyso = g('lyso', ...[[250, 238], [356, 226], [78, 128]].flatMap(([cx, cy]) => [
    s('circle', { class: 'cv-lyso', cx, cy, r: 10 }),
    s('circle', { class: 'cv-lyso-dot', cx: cx - 3, cy: cy - 2, r: 1.6 }), s('circle', { class: 'cv-lyso-dot', cx: cx + 3, cy: cy + 1, r: 1.6 }), s('circle', { class: 'cv-lyso-dot', cx, cy: cy + 4, r: 1.6 })]));
  // الريبوسومات الحرة
  const ribo = g('ribo', ...[[262, 52], [270, 58], [255, 60], [120, 248], [128, 254], [326, 246], [334, 240], [60, 160], [64, 170], [210, 262], [218, 266]].map(([cx, cy]) => s('circle', { class: 'cv-ribo', cx, cy, r: 2.6 })));

  svg.append(ser, rer, nucleus, envelope, nucleolus, golgi, lyso, mito(300, 64, 18), mito(102, 74, -22), mito(322, 236, -12), mito(170, 238, 4), ribo);
}

export default {
  mount(el) {
    const svg = s('svg', { viewBox: '0 0 420 290', class: 'cellv', role: 'img', 'aria-label': 'خلية حيوانية مفصّلة' });
    draw(svg);
    svg.querySelectorAll('g[data-part]').forEach(n => { n.setAttribute('tabindex', '0'); n.setAttribute('role', 'button'); n.setAttribute('aria-label', PARTS[n.dataset.part].ar); });

    const out = h('p.cv-label', { 'aria-live': 'polite' });
    const chips = h('div.cv-chips', Object.entries(PARTS).map(([k, p]) => h('button.cv-chip', { type: 'button', 'data-part': k, onclick: () => pick(k) }, p.ar)));
    const light = (k) => svg.querySelectorAll('g[data-part]').forEach(n => n.classList.toggle('is-on', n.dataset.part === k));

    // «استكشف»: اضغط فترى الاسم والوظيفة
    let mode = 'explore';
    const explore = (k) => {
      light(k);
      chips.querySelector(`[data-part="${k}"]`).classList.add('is-seen');
      out.replaceChildren(h('strong', PARTS[k].ar), ' ', h('span.ltr', `(${PARTS[k].en})`), `: ${PARTS[k].note}`);
    };

    // «اعثر على»: نطلب جزءًا وأنت تجده في الرسم
    const ORDER = ['nucleus', 'mito', 'golgi', 'rer', 'nucleolus', 'lyso', 'ser', 'membrane'];
    let target = null, score = 0, round = 0;
    const ask = () => {
      target = ORDER[(round + Math.floor(Math.random() * ORDER.length)) % ORDER.length];
      light(null);
      out.replaceChildren(h('strong', `اضغط على: ${PARTS[target].ar}`), h('span.cv-score.ltr', ` ${score}/${round}`));
    };
    const game = (k) => {
      round++;
      const ok = k === target;
      if (ok) score++;
      light(target);
      out.replaceChildren(h('strong', { class: ok ? 'qz-verdict is-right' : 'qz-verdict is-wrong' }, ok ? 'صحيح. ' : `هذا ${PARTS[k].ar}، و${PARTS[target].ar} هو المضيء. `), PARTS[target].note, h('span.cv-score.ltr', ` ${score}/${round}`));
      setTimeout(() => mode === 'find' && ask(), 2200);
    };
    const pick = (k) => (mode === 'explore' ? explore(k) : game(k));

    svg.addEventListener('click', e => { const n = e.target.closest('g[data-part]'); if (n) pick(n.dataset.part); });
    svg.addEventListener('keydown', e => { const n = e.target.closest('g[data-part]'); if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(n.dataset.part); } });

    const tabs = h('div.cc-tabs');
    [['explore', 'استكشف'], ['find', 'اعثر على']].forEach(([m, t]) => tabs.append(h('button.btn', { type: 'button', 'aria-pressed': String(m === 'explore'), onclick: (e) => {
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
      mode = m; chips.hidden = m === 'find';
      if (m === 'find') { score = 0; round = 0; ask(); } else { light(null); out.textContent = 'اضغط على أي جزء من الخلية، أو على اسمه.'; }
    } }, t)));

    out.textContent = 'اضغط على أي جزء من الخلية، أو على اسمه.';
    el.append(h('div.cv-wrap', tabs, svg, out, chips, h('p.cv-note', 'رسم تخطيطي مبسّط، وليس بمقياس رسم حقيقي.')));
  },
};
