// سجل المعادلات: كل معادلة لها متغيرات قابلة للتحريك، وخطوات تعويض، وتمارين بأرقام عشوائية.
// تُستخدم في أداة vis.formula، وفي أسئلة الحساب. (معادلات الطاقة والوزن تُضاف هنا مع جناح الغذاء.)

const r1 = (x) => Math.round(x * 10) / 10;
const rnd = (a, b, step = 1) => a + Math.floor(Math.random() * ((b - a) / step + 1)) * step;

export default {
  'formula.percentage': {
    title: 'النسبة المئوية',
    en: 'Percentage',
    // يُعرض: النسبة = (الجزء ÷ الكل) × 100
    parts: [{ v: 'part' }, '÷', { v: 'whole' }, '×', '100'],
    result: { ar: 'النسبة', unit: '%' },
    vars: [
      { id: 'part', ar: 'الجزء', unit: 'تريليون', value: 25, min: 1, max: 60, step: 1, color: '#b23a3a' },
      { id: 'whole', ar: 'الكل', unit: 'تريليون', value: 30, min: 1, max: 60, step: 1, color: '#6b4a8c' },
    ],
    valid: ({ part, whole }) => (part <= whole ? null : 'الجزء لا يمكن أن يكون أكبر من الكل.'),
    compute: ({ part, whole }) => (part / whole) * 100,
    steps: ({ part, whole }) => [
      `نقسم الجزء على الكل: ${part} ÷ ${whole} = ${(part / whole).toFixed(3)}`,
      `نضرب في 100 لنحوّله إلى نسبة مئوية: ${(part / whole).toFixed(3)} × 100 = ${r1((part / whole) * 100)}%`,
    ],
    picture: 'pie', // رسم يوضح الجزء من الكل
    practice: () => {
      const whole = rnd(20, 60, 2), part = rnd(2, whole, 1);
      return { vars: { part, whole }, text: `في عيّنة من ${whole} خلية، كان منها ${part} خلية دم حمراء. ما نسبة خلايا الدم الحمراء؟`, answer: r1((part / whole) * 100), tolerance: 1, unit: '%' };
    },
  },
};
