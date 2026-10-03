// سجل الأجنحة. status: 'soon' | 'open'
// question: السؤال الفضولي اللي يمثل الجناح بالخريطة (مأخوذ من أسئلة المدخل).

export default [
  {
    id: 'story', name: 'قصتي', en: 'My Story', color: 'var(--w-story)',
    question: 'القصة كاملة: التواريخ، والأرقام، والأشعة، والطريق للسجدة.',
    status: 'soon', lessons: null,
  },
  {
    id: 'anatomy', name: 'التشريح', en: 'Anatomy', color: 'var(--w-anatomy)',
    question: 'شلون العظم يبني نفسه؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'movement', name: 'الحركة', en: 'Movement', color: 'var(--w-movement)',
    question: 'ليش المرونة مو بس عضلة؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'rehab', name: 'التأهيل', en: 'Rehabilitation', color: 'var(--w-rehab)',
    question: 'شلون يتعالج وتر؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'football', name: 'كرة القدم', en: 'Football', color: 'var(--w-football)',
    question: 'ليش الإصابة تتجمع بصمت؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'nutrition', name: 'الغذاء', en: 'Nutrition', color: 'var(--w-nutrition)',
    question: 'شنو العلاقة بين الصحن والركبة؟',
    status: 'soon', lessons: null,
  },
];

// المسار المقترح بالخريطة (والغذاء بالتوازي)
export const suggestedPath = ['anatomy', 'movement', 'rehab', 'football'];
