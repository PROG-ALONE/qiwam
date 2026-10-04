// خريطة مبسطة لبعض الأعضاء الداخلية (منظر أمامي). يمين الشخص يظهر على يسار المشاهد.
// المواقع مبنية على OpenStax A&P 2e: القلب بين الرئتين وقمته إلى يسار القص (19.1)،
// والكبد تحت الحجاب الحاجز في الربع العلوي الأيمن (23.6)، والمعدة تحت المريء وقاعها إلى اليسار (23.4)،
// والكليتان على جانبي العمود الفقري خلف التجويف البطني، واليمنى أخفض قليلًا (25.3).
//
// mount(el, { mode: 'explore' | 'pick' | 'highlight' | 'targets', highlight, onPick })

import { h, s } from '../../ui/dom.js';
import entities from '../../../content/entities.js';

export const ORGANS = {
  'organ.lungs': { color: '#c4687e', does: 'فيهما يدخل الأكسجين إلى الدم، ويخرج منه ثاني أكسيد الكربون.', d: 'M138 64 Q100 62 84 102 Q70 150 74 196 Q104 204 136 196 Q142 140 138 64 Z M162 64 Q200 62 216 102 Q230 150 226 196 Q200 202 178 192 Q186 160 162 64 Z' },
  'organ.heart': { color: '#a8323a', does: 'مضخة عضلية تدفع الدم في الأوعية إلى الجسم كله.', d: 'M150 128 Q174 118 190 136 Q200 160 178 186 Q164 196 154 190 Q136 176 136 152 Q138 134 150 128 Z' },
  'organ.liver': { color: '#8a4630', does: 'أكبر غدة في الجسم: يعالج ما يمتصه الهضم، ويصنع العصارة الصفراوية.', d: 'M66 212 Q120 202 176 214 Q170 236 150 244 Q110 262 74 252 Q60 236 66 212 Z' },
  'organ.stomach': { color: '#c48a3a', does: 'كيس عضلي يخزن الطعام ويمزجه، ويبدأ فيه هضم البروتين.', d: 'M176 216 Q206 206 224 224 Q234 252 214 272 Q196 288 172 280 Q160 270 170 258 Q190 252 194 238 Q186 226 176 230 Z' },
  'organ.kidneys': { color: '#7b4f86', does: 'تصفّيان الدم، فتصنعان البول وتحفظان توازن الماء والأملاح.', d: 'M96 268 Q84 270 84 290 Q86 314 102 314 Q112 310 108 300 Q104 290 110 280 Q108 268 96 268 Z M204 258 Q216 260 216 280 Q214 304 198 304 Q188 300 192 290 Q196 280 190 270 Q192 258 204 258 Z', behind: true },
};

// تفاصيل تشريحية للزينة فقط (لا تُضغط): القصبة والشعبتان، وشقوق الرئتين، والأبهر، وأخدود القلب،
// والرباط المنجلي بين فصّي الكبد، وثنيات المعدة، والحالبان والمثانة.
const DETAILS = [
  ['om-airway', 'M150 74 V104 M150 104 Q140 110 126 118 M150 104 Q160 110 172 116'],
  ['om-fissure', 'M80 156 Q106 136 134 108 M78 132 Q104 126 134 128 M222 164 Q198 142 170 104'],
  ['om-vessel', 'M156 130 Q154 108 170 108 Q184 110 182 126'],
  ['om-groove', 'M160 134 Q166 160 174 186'],
  ['om-groove', 'M128 206 Q134 228 124 256'],
  ['om-groove', 'M188 238 Q204 248 212 266 M200 226 Q216 238 222 256'],
  ['om-ureter', 'M106 300 Q118 340 140 384 M194 290 Q182 334 160 384'],
  ['om-bladder', 'M136 384 Q150 374 164 384 Q168 398 150 402 Q132 398 136 384 Z'],
];

export default {
  mount(el, { mode = 'explore', highlight = null, onPick } = {}) {
    const svg = s('svg', { viewBox: '0 0 300 420', class: `organ-map is-${mode}`, role: 'img', 'aria-label': 'خريطة مبسطة للأعضاء الداخلية في الجذع' });
    svg.append(
      s('path', { class: 'om-body', d: 'M150 10 Q186 10 190 44 Q192 60 186 66 Q240 74 250 110 Q256 200 244 260 Q240 330 220 410 L80 410 Q60 330 56 260 Q44 200 50 110 Q60 74 114 66 Q108 60 110 44 Q114 10 150 10 Z' }),
      s('line', { class: 'om-diaphragm', x1: 64, y1: 206, x2: 236, y2: 206 }),
      s('line', { class: 'om-spine', x1: 150, y1: 70, x2: 150, y2: 400 }),
      ...DETAILS.filter(([c]) => c === 'om-airway').map(([c, d]) => s('path', { class: c, d })),
    );
    const label = h('p.om-label', { 'aria-live': 'polite' }, mode === 'explore' ? 'مرّر أو اضغط على عضو' : '');
    const regions = {};
    for (const [id, o] of Object.entries(ORGANS)) {
      const ent = entities[id];
      const p = s('path', {
        class: `om-organ${o.behind ? ' is-behind' : ''}`, d: o.d, 'data-e': id, style: `--oc:${o.color}`,
        tabindex: mode === 'highlight' ? null : 0, role: mode === 'highlight' ? null : 'button',
        'aria-label': mode === 'explore' ? `${ent.ar} (${ent.en})` : 'عضو',
      });
      if (mode === 'explore') {
        const show = () => { svg.querySelectorAll('.om-organ').forEach(x => x.classList.toggle('is-on', x === p)); label.replaceChildren(h('strong', ent.ar), ' ', h('span.ltr', `(${ent.en})`), `: ${o.does}${o.behind ? ' (تقعان خلف الأعضاء الأخرى.)' : ''}`); };
        p.addEventListener('pointerenter', show); p.addEventListener('click', show); p.addEventListener('focus', show);
      }
      if (mode === 'pick' || mode === 'targets') {
        const pick = (e) => { e.stopPropagation(); onPick?.(id, p, e); };
        p.addEventListener('click', pick);
        p.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && pick(e));
      }
      regions[id] = p;
      svg.append(p);
    }
    svg.append(s('g', { class: 'om-details', 'aria-hidden': 'true' }, ...DETAILS.filter(([c]) => c !== 'om-airway').map(([c, d]) => s('path', { class: c, d }))));
    if (mode === 'pick') svg.addEventListener('click', (e) => onPick?.(null, null, e)); // نقرة خارج أي عضو
    if (highlight) regions[highlight]?.classList.add('is-hl');
    el.append(h('div.om', svg, mode === 'explore' ? label : null));
    return { svg, regions };
  },
};
