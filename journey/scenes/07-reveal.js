import { h, s, wait, reducedMotion } from '../../core/ui/dom.js';

// قلب المدخل. بدون موسيقى، وبدون دراما. هدوء، ووقفة.
export default {
  title: 'الكشف',
  date: 'رمضان 2026',
  tone: 'deep',
  questions: [],
  mount(stage, { done, answer }) {
    const lines = [
      h('p.j-line.j-quiet', 'الليلة التاسعة عشر.'),
      h('p.j-line.j-quiet', 'أردت أصلي التراويح كاملة.'),
    ];
    const reveal = [
      h('p.j-line.j-line--big.j-quiet', 'السجدة.'),
      h('p.j-line.j-quiet', 'الحركة اللي يسويها طفل عمره سبع سنين، صارت أصعب حركة بحياتي.'),
      h('p.j-line.j-soft.j-quiet', 'من ذيك الليلة أصلي على الكرسي، لأن ركبتي ما تنثني أكثر من 90 درجة.'),
    ];
    reveal.forEach(r => (r.hidden = true));

    const art = scene();
    const touch = h('button.j-tapzone.j-tapzone--soft', { type: 'button', 'aria-label': 'أكمل' });
    const hint = h('p.j-hint', 'المس بهدوء');

    stage.append(h('div.j-reveal-wrap', art, h('div.j-center.j-center--low', lines, reveal, hint)), touch);

    let started = false;
    async function play(fast) {
      if (started && !fast) return;
      started = true;
      hint.hidden = true;
      touch.remove();
      for (const r of reveal) {
        r.hidden = false;
        if (!fast && !reducedMotion()) await wait(2200);
      }
      answer('q.what');
      done();
    }
    touch.addEventListener('click', () => play(false));
    return { finish: () => { reveal.forEach(r => (r.hidden = false)); play(true); } };
  },
};

// ظل شخص جالس على كرسي، تحت قوس مصلى. خطوط فقط.
function scene() {
  return s('svg', { viewBox: '0 0 320 260', class: 'j-mihrab', 'aria-hidden': 'true' },
    s('path', { class: 'j-arch', d: 'M60 250 V110 Q60 30 160 18 Q260 30 260 110 V250' }),
    s('path', { class: 'j-arch j-arch--inner', d: 'M88 250 V118 Q88 56 160 46 Q232 56 232 118 V250' }),
    s('line', { class: 'j-floor', x1: 20, y1: 250, x2: 300, y2: 250 }),
    // الكرسي
    s('path', { class: 'j-chair', d: 'M128 250 V196 M182 250 V196 M122 196 H186 M180 196 V140' }),
    // الشخص جالساً
    s('circle', { class: 'j-person', cx: 168, cy: 112, r: 12 }),
    s('path', { class: 'j-person', d: 'M166 126 Q158 160 160 194 L130 196 Q126 222 128 248' }),
    s('path', { class: 'j-person j-person--arm', d: 'M164 140 Q150 160 140 168' }),
    s('circle', { class: 'j-lampdot', cx: 160, cy: 70, r: 3 }));
}
