// سجل الأجنحة. status: 'soon' | 'open'
// question: السؤال الفضولي اللي يمثل الجناح بالخريطة (مأخوذ من أسئلة المدخل).

export default [
  {
    id: 'story', name: 'قصتي', en: 'My Story', color: 'var(--w-story)',
    question: 'القصة كاملة: التواريخ، والأرقام، والأشعة، والطريق إلى السجدة.',
    status: 'soon', lessons: null,
  },
  {
    id: 'anatomy', name: 'التشريح', en: 'Anatomy', color: 'var(--w-anatomy)',
    question: 'كيف يبني العظم نفسه؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'movement', name: 'الحركة', en: 'Movement', color: 'var(--w-movement)',
    question: 'لماذا لا تقتصر المرونة على العضلة؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'rehab', name: 'التأهيل', en: 'Rehabilitation', color: 'var(--w-rehab)',
    question: 'كيف يُعالَج الوتر؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'football', name: 'كرة القدم', en: 'Football', color: 'var(--w-football)',
    question: 'لماذا تتراكم الإصابة بصمت؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'nutrition', name: 'الغذاء', en: 'Nutrition', color: 'var(--w-nutrition)',
    question: 'ما العلاقة بين الطبق والركبة؟',
    status: 'soon', lessons: null,
  },
];

// المسار المقترح بالخريطة (والغذاء بالتوازي)
export const suggestedPath = ['anatomy', 'movement', 'rehab', 'football'];
