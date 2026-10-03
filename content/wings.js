// سجل الأجنحة (العلوم). status: 'soon' | 'open'
// desc: ما ستتعلمه في هذا العلم، بلغة تناسب أي متعلّم.
// question: سؤال فضولي يمثّل العلم.

export default [
  {
    id: 'body', name: 'الجسم من الداخل', en: 'Inside the Body', color: 'var(--w-body)',
    desc: 'من الخلية إلى النسيج إلى العضو إلى الجهاز: كيف تعمل الأعضاء الداخلية، وأين يذهب الماء والطعام، وكيف يصفّي الكبد ويُصنع الدم، وما أمراضها وكيف تُشخَّص وتُعالَج.',
    question: 'أين تذهب لقمتك بعد أن تبلعها؟',
    status: 'open', lessons: 1,
  },
  {
    id: 'anatomy', name: 'التشريح', en: 'Anatomy', color: 'var(--w-anatomy)',
    desc: 'العظام والمفاصل والعضلات والأعصاب، كما يدرسها طالب العلاج الطبيعي: الأسماء، والمواقع، والوظائف، وكيف تلمسها في جسمك.',
    question: 'كيف يبني العظم نفسه؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'movement', name: 'الحركة', en: 'Movement', color: 'var(--w-movement)',
    desc: 'كيف ينتج الجسم الحركة والطاقة ويتكيّف: الإحماء، والمرونة، والمدى الحركي، والقوة، والسرعة، ومكتبة تمارين مرسومة.',
    question: 'لماذا لا تقتصر المرونة على العضلة؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'rehab', name: 'التأهيل', en: 'Rehabilitation', color: 'var(--w-rehab)',
    desc: 'الإصابات وكيف تلتئم الأنسجة، والفحص السريري، ووسائل العلاج وقوة أدلّتها، وخطط التأهيل والعودة إلى النشاط.',
    question: 'كيف يُعالَج الوتر؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'nutrition', name: 'الغذاء', en: 'Nutrition', color: 'var(--w-nutrition)',
    desc: 'التغذية من الأساس: المغذيات، والطاقة ومعادلاتها، وتركيب الجسم، والتغذية الرياضية، وتخطيط وجبات من المطبخ العراقي.',
    question: 'ما العلاقة بين الطبق والركبة؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'football', name: 'كرة القدم', en: 'Football', color: 'var(--w-football)',
    desc: 'العلوم كلها في خدمة لاعب: متطلبات اللعبة، والوقاية، وتنظيم الأسبوع والموسم، واختبارات اللياقة.',
    question: 'لماذا تتراكم الإصابة بصمت؟',
    status: 'soon', lessons: null,
  },
  {
    id: 'story', name: 'قصتي', en: 'My Story', color: 'var(--w-story)',
    desc: 'القصة التي بدأت منها المنصة كاملة: التواريخ، والأطباء، والأشعة، والطريق إلى السجدة.',
    question: 'كيف صارت أبسط حركة أصعبها؟',
    status: 'soon', lessons: null,
  },
];

// المسار المقترح لمن يريد أن يمر بالعلوم كلها (والغذاء بالتوازي)
export const suggestedPath = ['body', 'anatomy', 'movement', 'rehab', 'football'];
