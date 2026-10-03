import { h, s, reducedMotion } from '../../core/ui/dom.js';
import { chronicle, doctorCard } from '../chronicle.js';

// الطبيبان الأول والثاني (2025)، كما رواهما صاحب القصة. بلا أسماء.
export default {
  title: 'الطبيبان',
  date: '2025',
  tone: 'night',
  questions: ['q.diagnosis', 'q.vmo'],
  mount(stage, { done }) {
    const dr1 = doctorCard({
      who: 'الطبيب الأول: أستاذ في جراحة العظام، اسمه معروف في العراق',
      body: [
        'نظر في صورة الأشعة وقرأ فيها الجواب. قلتُ له إن الأشعة لا تُظهر الأوتار ولا الأربطة، فأصرّ على رأيه.',
      ],
      quote: 'لا شيء فيك. فقط ارتح.',
      missing: 'الإصغاء. حين اعترضتُ، لم يُعِد النظر.',
    });

    const tracking = patellaTracking();
    const dr2 = doctorCard({
      who: 'الطبيب الثاني: أستاذ في أمراض المفاصل',
      body: [
        'الكلام نفسه تقريبًا، وتشخيص جديد. ثم ضغط على ركبتي بقوة، فطقّت تحت يده.',
        'ومنذ تلك الطقّة بدأت مشكلة ثانية: صارت الرضفة تصعد مائلة عند شدّ العضلة الرباعية، وضمرت عضلة الفخذ اليسرى، ولم تعد العضلة المتسعة الإنسية (VMO) تُبنى. وصارت الركبة تفلت عند المشي أو الوقوف، وصار المشي اليومي نفسه يؤذيها.',
      ],
      quote: 'خشونة.',
      extra: tracking.el,
      missing: 'الفحص الرفيق. ركبة تؤلم لا تُعامَل بالقوة.',
    });

    const clinic = h('article.j-doc.j-doc--clinic',
      h('h2.j-doc-who', 'ما رأيتُه في العيادات'),
      h('p.j-doc-body', 'في كل عيادة دخلتها، كانت الغرفة تتسع لعشرين مريضًا في وقت واحد. كيف يحكي المريض وجعه كاملًا أمام عشرين غريبًا؟ وكيف يُشخَّص في دقائق؟'),
      h('p.j-doc-body', 'في بلدان أخرى، يجلس المريض وحده مع طبيبه، ويأخذ وقته في الكلام. أما هنا، فشعرتُ أن المال سبق المريض.'));

    stage.append(h('div.j-text.j-text--wide',
      h('p.j-line', 'خلال عام 2025، حملتُ ركبتي إلى طبيبين.')));
    const c = chronicle(stage, [
      { label: 'الطبيب الأول', node: dr1 },
      { label: 'الطبيب الثاني', node: dr2 },
      { label: 'ما رأيتُه في العيادات', node: clinic },
    ], done);

    return { finish: () => c.revealAll() };
  },
};

// رسم أمامي: مسار الرضفة الطبيعي (مستقيم) مقابل مسارها في ركبتي (مائل) عند شدّ العضلة الرباعية.
function patellaTracking() {
  const svg = s('svg', { viewBox: '0 0 240 220', class: 'j-track', role: 'img', 'aria-label': 'مسار الرضفة: الطبيعي مستقيم، وفي ركبتي مائل إلى الخارج' });
  svg.append(
    s('path', { class: 'j-track-bone', d: 'M70 0 L170 0 L172 70 Q200 100 190 130 L50 130 Q40 100 68 70 Z' }), // الفخذ
    s('path', { class: 'j-track-bone', d: 'M52 150 L188 150 Q192 170 176 180 L168 220 L72 220 L64 180 Q48 170 52 150 Z' }), // الظنبوب
    s('line', { class: 'j-track-normal', x1: 120, y1: 150, x2: 120, y2: 60 }),
    s('path', { class: 'j-track-mine', d: 'M120 150 Q124 110 146 66' }),
    s('text', { class: 'j-track-label', x: 60, y: 40, 'text-anchor': 'middle', direction: 'rtl' }, 'الطبيعي'),
    s('line', { class: 'j-track-lead', x1: 74, y1: 44, x2: 116, y2: 70 }),
    s('text', { class: 'j-track-label j-track-label--mine', x: 200, y: 40, 'text-anchor': 'middle', direction: 'rtl' }, 'ركبتي'),
    s('line', { class: 'j-track-lead j-track-lead--mine', x1: 190, y1: 46, x2: 152, y2: 66 }),
  );
  const pat = s('ellipse', { class: 'j-track-patella', cx: 120, cy: 128, rx: 20, ry: 26 });
  svg.append(pat);
  const btn = h('button.btn.btn--quiet.j-track-btn', { type: 'button' }, 'شُدّ العضلة الرباعية');
  btn.addEventListener('click', () => {
    if (reducedMotion()) { pat.setAttribute('transform', 'translate(20 -52) rotate(14 120 128)'); return; }
    pat.animate([
      { transform: 'translate(0,0) rotate(0deg)' },
      { transform: 'translate(20px,-52px) rotate(14deg)' },
      { transform: 'translate(0,0) rotate(0deg)' },
    ], { duration: 1800, easing: 'ease-in-out', iterations: 2 });
    pat.style.transformOrigin = '120px 128px';
    pat.style.transformBox = 'view-box';
  });
  return { el: h('figure.j-track-fig', svg, btn) };
}
