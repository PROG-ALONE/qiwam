import { h } from '../../core/ui/dom.js';
import { chronicle, doctorCard } from '../chronicle.js';

// الطبيبان الثالث والرابع: العلاج الطبيعي بعد ليلة التاسعة عشرة وحتى تموز 2026.
export default {
  title: 'العلاج الطبيعي',
  date: 'رمضان – تموز 2026',
  tone: 'night',
  questions: ['q.evidence', 'q.plate'],
  mount(stage, { done }) {
    const dr3 = doctorCard({
      who: 'الطبيب الثالث: علاج طبيعي',
      when: 'من تلك الليلة حتى نيسان 2026',
      body: ['إبر صينية وأشعة حمراء، ولا شيء غيرهما. أسابيع من الجلسات، ولا تحسّن.'],
      missing: 'التمرين. لم يكن في الخطة تمرين واحد.',
    });
    const dr4 = doctorCard({
      who: 'الطبيب الرابع: علاج طبيعي بتمارين التأهيل',
      when: 'نيسان – تموز 2026',
      body: ['هنا بدأ شيء من التحسّن لأول مرة. لكن التشخيص لم يكن دقيقًا، والخطة لم تُبنَ على علم متين.'],
      missing: 'معرفة الحالة معرفة كاملة، ومعرفة علاجها.',
    });
    const body = h('article.j-doc.j-doc--clinic',
      h('h2.j-doc-who', 'وفي تلك الأشهر'),
      h('p.j-doc-body', 'عدتُ إلى تمارين الجزء العلوي فقط، وصعد وزني من 69 إلى 85 كيلوغرامًا.'));

    stage.append(h('div.j-text.j-text--wide',
      h('p.j-line', 'من المسجد إلى العلاج الطبيعي مباشرة. وبدأت مرحلة جديدة من البحث عن جواب.')));
    const c = chronicle(stage, [
      { label: 'الطبيب الثالث', node: dr3 },
      { label: 'الطبيب الرابع', node: dr4 },
      { label: 'وفي تلك الأشهر', node: body },
    ], done);
    return { finish: () => c.revealAll() };
  },
};
