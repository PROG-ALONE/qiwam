import { h, s } from '../../core/ui/dom.js';

// من البرومت 08: 2 آب الرجل تفلت، 10 آب البداية الحقيقية، المرحلة الأولى، المرحلة الثانية، وهنا الآن.
// اسم المعالج لا يظهر في المدخل، بل في جناح قصتي فقط.
const STEPS = [
  { x: 40,  y: 200, when: '10 آب 2026', text: 'البداية الحقيقية، مع معالج طبيعي متخصص بالرياضيين. وصار للتشخيص اسم.' },
  { x: 170, y: 170, when: '10 آب – 9 أيلول', text: 'تمارين ثابتة، وتقوية الحوض، وأقل من 3000 خطوة في اليوم. والصلاة على الكرسي.' },
  { x: 300, y: 120, when: 'من 10 أيلول', text: 'تقوية وتحميل وظيفي. والخطوات تصعد من 5000 إلى ما بين 7000 و8000.' },
  { x: 410, y: 92,  when: 'هنا الآن', text: 'الطريق لم ينتهِ بعد. لكنه صار واضحًا.', now: true },
];

export default {
  title: 'الطريق',
  date: 'آب 2026',
  tone: 'night',
  questions: ['q.heal', 'q.return'],
  mount(stage, { done }) {
    const svg = s('svg', { viewBox: '0 0 560 240', class: 'j-road', 'aria-hidden': 'true' });
    const pts = STEPS.map(p => `${p.x},${p.y}`).join(' ');
    const track = s('polyline', { class: 'j-road-track', points: pts });
    const walked = s('polyline', { class: 'j-road-walked', points: `${STEPS[0].x},${STEPS[0].y}` });
    const future = s('path', { class: 'j-road-future', d: `M${STEPS[3].x} ${STEPS[3].y} Q 480 70 540 30` });
    const dots = STEPS.map((p, i) => s('circle', { class: `j-road-dot${p.now ? ' is-now' : ''}`, cx: p.x, cy: p.y, r: p.now ? 9 : 6, 'data-i': i }));
    svg.append(future, track, walked, ...dots);

    const when = h('p.j-when');
    const what = h('p.j-line');
    const stepBtn = h('button.btn.j-walk', { type: 'button' }, 'امشِ');

    let i = -1;
    const advance = () => {
      if (i >= STEPS.length - 1) return;
      i++;
      walked.setAttribute('points', STEPS.slice(0, i + 1).map(p => `${p.x},${p.y}`).join(' '));
      dots.forEach((d, j) => d.classList.toggle('is-on', j <= i));
      when.textContent = STEPS[i].when;
      what.textContent = STEPS[i].text;
      if (i === STEPS.length - 1) { stepBtn.hidden = true; done(); }
    };
    stepBtn.addEventListener('click', advance);

    stage.append(
      h('div.j-text.j-text--wide',
        h('p.j-line', '2 آب 2026: عاد كل شيء كما كان. رجلي "تفلت" مني، ولا أستطيع المشي.'),
        h('p.j-line.j-soft', 'وبعد ثمانية أيام، بدأ طريق آخر.')),
      h('figure.j-road-fig', svg),
      h('div.j-text.j-text--wide.j-road-text', { 'aria-live': 'polite' }, when, what),
      h('div.j-row', stepBtn));

    return { finish: () => { while (i < STEPS.length - 1) advance(); } };
  },
};
