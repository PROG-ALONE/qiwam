import { h, s } from '../../core/ui/dom.js';

// 10 آب 2026: اللقاء بالدكتور أصيل. تفاصيل الخطة والمتابعة شخصية، ولا تظهر في المنصة.
const STEPS = [
  { x: 60,  y: 190, when: '10 آب 2026', text: 'التقيتُ بالدكتور أصيل. ولأول مرة صار للحالة اسم واضح، وصار للعلاج طريق.' },
  { x: 380, y: 100, when: 'هنا الآن', text: 'الطريق لم ينتهِ بعد، لكنه صار واضحًا.', now: true },
];

export default {
  title: 'الطريق',
  date: 'آب 2026',
  tone: 'night',
  questions: ['q.heal', 'q.return'],
  mount(stage, { done }) {
    const svg = s('svg', { viewBox: '0 0 560 240', class: 'j-road', 'aria-hidden': 'true' });
    const [a, b] = STEPS;
    const d = `M${a.x} ${a.y} C 180 200, 260 110, ${b.x} ${b.y}`;
    const track = s('path', { class: 'j-road-track', d });
    const walked = s('path', { class: 'j-road-walked', d, pathLength: 1, 'stroke-dasharray': '1', 'stroke-dashoffset': '1' });
    const future = s('path', { class: 'j-road-future', d: `M${b.x} ${b.y} Q 470 70 540 30` });
    const dots = STEPS.map(p => s('circle', { class: `j-road-dot${p.now ? ' is-now' : ''}`, cx: p.x, cy: p.y, r: p.now ? 9 : 6 }));
    svg.append(future, track, walked, ...dots);

    const when = h('p.j-when');
    const what = h('p.j-line');
    const closing = h('p.j-line.j-reveal.j-closing', { hidden: true }, 'ومن هناك بدأت القصة التي أحياني الله بها، وأراد لي فيها الخير طوال تلك المدة.');
    const stepBtn = h('button.btn.j-walk', { type: 'button' }, 'امشِ');

    let i = -1;
    const advance = () => {
      if (i >= STEPS.length - 1) return;
      i++;
      dots.forEach((dd, j) => dd.classList.toggle('is-on', j <= i));
      walked.style.strokeDashoffset = i === 0 ? '1' : '0';
      when.textContent = STEPS[i].when;
      what.textContent = STEPS[i].text;
      if (i === STEPS.length - 1) { stepBtn.hidden = true; closing.hidden = false; done(); }
    };
    stepBtn.addEventListener('click', advance);

    stage.append(
      h('div.j-text.j-text--wide',
        h('p.j-line', 'وبعد ثمانية أيام، انفتح طريق آخر.')),
      h('figure.j-road-fig', svg),
      h('div.j-text.j-text--wide.j-road-text', { 'aria-live': 'polite' }, when, what, closing),
      h('div.j-row', stepBtn));

    return { finish: () => { while (i < STEPS.length - 1) advance(); } };
  },
};
