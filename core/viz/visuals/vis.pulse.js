// قِس نبضك: أين تضع إصبعيك (الشريان الكعبري في المعصم، جهة الإبهام)، ومؤقّت 15 ثانية،
// ثم تكتب ما عددته فتُحسب نبضاتك في الدقيقة خطوة بخطوة، ويُعرض موقعها من المدى المعتاد.
// المصادر: OpenStax A&P 2e، القسم 20.2 (النبض ومواضع جسّه)، والقسم 19.4 (60–100 نبضة عند الراحة للبالغ).
import { h, s } from '../../ui/dom.js';
import formulas from '../../../content/formulas/index.js';
import { loadVisual } from '../../content.js';

const SECS = 15;

function wrist() {
  return s('svg', { viewBox: '0 0 220 270', class: 'pl-art', role: 'img', 'aria-label': 'باطن اليد والمعصم، والنقطة على جهة الإبهام' },
    s('path', { class: 'pl-skin', d: 'M78 268 L82 160 Q80 150 70 140 L68 78 Q68 66 80 66 L150 66 Q160 66 160 78 L160 112 Q178 96 192 84 Q204 78 206 90 Q200 108 176 132 Q160 148 146 160 L142 268 Z' }),
    ...[[70, 14], [90, 6], [110, 8], [130, 18]].map(([x, y]) => s('rect', { class: 'pl-skin', x, y, width: 19, height: 66 - y + 8, rx: 9.5 })),
    s('path', { class: 'pl-crease', d: 'M84 150 Q112 156 144 150 M84 160 Q112 166 144 160' }),
    s('path', { class: 'pl-artery', d: 'M132 266 Q134 220 132 190 Q130 170 134 150' }),
    s('circle', { class: 'pl-spot', cx: 132, cy: 176, r: 10 }),
    s('text', { class: 'pl-lbl', x: 160, y: 200 }, 'هنا'),
    s('path', { class: 'pl-arrow', d: 'M156 196 L144 184' }),
    s('text', { class: 'pl-lbl pl-lbl-s', x: 196, y: 70 }, 'الإبهام'));
}

export default {
  mount(el) {
    const F = formulas['formula.bpm'];
    const ring = h('div.pl-ring', h('span.pl-sec.ltr', String(SECS)), h('span.pl-sec-t', 'ثانية'));
    const startBtn = h('button.btn.btn--primary', { type: 'button' }, `ابدأ العدّ (${SECS} ثانية)`);
    const inp = h('input.qz-text.qz-num.ltr', { type: 'number', min: 1, max: 60, inputmode: 'numeric', 'aria-label': 'عدد النبضات التي عددتها' });
    const calcBtn = h('button.btn.btn--primary', { type: 'button' }, 'احسب');
    const ask = h('div.pl-ask', { hidden: true }, h('p', `كم نبضة عددت في ${SECS} ثانية؟`), h('div.qz-calc', inp, calcBtn));
    const out = h('div.pl-out', { 'aria-live': 'polite' });
    const fxBox = h('div.pl-fx');
    let timer = null;

    startBtn.addEventListener('click', () => {
      clearInterval(timer);
      let left = SECS;
      ring.classList.add('is-run'); ring.style.setProperty('--p', '0');
      ring.firstChild.textContent = String(left);
      startBtn.disabled = true; ask.hidden = true; out.replaceChildren();
      timer = setInterval(() => {
        left--;
        ring.firstChild.textContent = String(left);
        ring.style.setProperty('--p', String((SECS - left) / SECS));
        if (left <= 0) {
          clearInterval(timer); ring.classList.remove('is-run');
          startBtn.disabled = false; startBtn.textContent = 'أعد العدّ';
          ask.hidden = false; inp.focus({ preventScroll: true });
        }
      }, 1000);
    });

    const calc = async () => {
      const beats = Math.round(+inp.value);
      if (!beats || beats < 1) return;
      const bpm = F.compute({ beats, secs: SECS });
      const where = bpm < F.band.min ? 'أقل من المدى المعتاد للبالغ عند الراحة.' : bpm > F.band.max ? 'أعلى من المدى المعتاد للبالغ عند الراحة.' : 'ضمن المدى المعتاد للبالغ عند الراحة.';
      out.replaceChildren(
        h('p.pl-res', 'نبضك: ', h('strong.ltr', String(Math.round(bpm))), ' نبضة في الدقيقة. ', where),
        h('p.pl-caveat', 'قراءة واحدة لا تشخّص شيئًا: النبض يرتفع مع الحركة والانفعال. إن كانت قراءتك خارج المدى مرارًا وأنت مرتاح، أو معها دوخة أو ألم في الصدر، فراجع طبيبًا.'));
      fxBox.replaceChildren();
      (await loadVisual('vis.formula')).mount(fxBox, { formula: 'formula.bpm', values: { beats, secs: SECS } });
    };
    calcBtn.addEventListener('click', calc);
    inp.addEventListener('keydown', e => e.key === 'Enter' && calc());

    // «لا أستطيع أن أجده؟» بديل لمن لا يريد القياس الآن
    const skip = h('button.cite-link', { type: 'button', onclick: async () => { ask.hidden = false; inp.value = '18'; await calc(); } }, 'لا أستطيع القياس الآن: أرني مثالًا (18 نبضة)');

    el.append(h('div.pl',
      h('div.pl-top', wrist(),
        h('ol.pl-how',
          h('li', 'اجلس دقيقة واسترح.'),
          h('li', 'ضع طرفَي السبابة والوسطى على باطن معصمك من جهة الإبهام، واضغط برفق حتى تحسّ النبض.'),
          h('li', `اضغط «ابدأ» وعُدّ النبضات حتى ينتهي المؤقت (${SECS} ثانية).`),
          h('li', 'لا تستعمل إبهامك للجسّ: نبضه هو قد يربكك.'))),
      h('div.pl-timer', ring, startBtn),
      ask, out, fxBox, skip));
  },
};
