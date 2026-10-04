// هيكل جناح «الجسم من الداخل»: المستويات والكورسات والدروس (المفتوح منها والمخطط له).
// status: 'open' درس منشور | 'soon' مخطط له

export default {
  wing: 'body',
  levels: [
    { n: 1, title: 'الخلية', courses: [
      { id: 'c1', title: 'من الذرة إلى الإنسان', lessons: [
        { id: 'body.l1.c1.levels', title: 'مستويات التنظيم: من الذرة إلى الإنسان', minutes: 25, status: 'open' },
        { id: 'body.l1.c1.membrane', title: 'غشاء الخلية والنقل عبره', status: 'soon' },
        { id: 'body.l1.c1.organelles', title: 'العضيّات ووظائفها', status: 'soon' },
        { id: 'body.l1.c1.dna-protein', title: 'من DNA إلى البروتين', status: 'soon' },
        { id: 'body.l1.c1.energy', title: 'طاقة الخلية', status: 'soon' },
        { id: 'body.l1.c1.division', title: 'الانقسام والتجدد والموت المبرمج', status: 'soon' },
        { id: 'body.l1.c1.signals', title: 'التواصل بين الخلايا', status: 'soon' },
        { id: 'body.l1.c1.cancer', title: 'عندما تخطئ الخلية: مدخل إلى السرطان', status: 'soon' },
      ] },
    ] },
    { n: 2, title: 'الأنسجة', courses: [
      { id: 'c1', title: 'الأنسجة الأربعة', lessons: [
        { id: 'body.l2.c1.epithelial', title: 'النسيج الطلائي', status: 'soon' },
        { id: 'body.l2.c1.connective', title: 'النسيج الضام', status: 'soon' },
        { id: 'body.l2.c1.muscle', title: 'النسيج العضلي', status: 'soon' },
        { id: 'body.l2.c1.nervous', title: 'النسيج العصبي', status: 'soon' },
        { id: 'body.l2.c1.membranes', title: 'الأغشية', status: 'soon' },
        { id: 'body.l2.c1.inflammation', title: 'الالتهاب: كيف يستجيب النسيج للأذى', status: 'soon' },
      ] },
    ] },
    { n: 3, title: 'من العضو إلى الجسم', courses: [
      { id: 'c1', title: 'العضو والجهاز والاتزان', lessons: [
        { id: 'body.l3.c1.organ-system', title: 'العضو والجهاز', status: 'soon' },
        { id: 'body.l3.c1.organ-map', title: 'خريطة الأعضاء الداخلية', status: 'soon' },
        { id: 'body.l3.c1.homeostasis', title: 'الاتزان الداخلي', status: 'soon' },
        { id: 'body.l3.c1.feedback', title: 'التغذية الراجعة', status: 'soon' },
        { id: 'body.l3.c1.fluids', title: 'سوائل الجسم والأملاح', status: 'soon' },
      ] },
    ] },
    { n: 4, title: 'الأجهزة', courses: [
      { id: 'c1', title: 'القلب والأوعية الدموية', lessons: [] },
      { id: 'c2', title: 'الدم ونخاع العظم', lessons: [] },
      { id: 'c3', title: 'المناعة والجهاز اللمفي والطحال', lessons: [] },
      { id: 'c4', title: 'الجهاز التنفسي', lessons: [] },
      { id: 'c5', title: 'الجهاز الهضمي: من الفم إلى القولون', lessons: [] },
      { id: 'c6', title: 'الكبد والمرارة والبنكرياس', lessons: [] },
      { id: 'c7', title: 'الكلى والجهاز البولي', lessons: [] },
      { id: 'c8', title: 'الغدد الصماء', lessons: [] },
      { id: 'c9', title: 'الجهاز العصبي الذاتي والنوم والإجهاد', lessons: [] },
      { id: 'c10', title: 'الجلد والحرارة والتعرق', lessons: [] },
    ] },
    { n: 5, title: 'الرحلات داخل الجسم', courses: [
      { id: 'c1', title: 'ثماني رحلات', lessons: [
        { id: 'body.l5.c1.water', title: 'رحلة قطرة الماء', status: 'soon' },
        { id: 'body.l5.c1.bite', title: 'لقمة الطعام: من الطبق إلى الخلية', status: 'soon' },
        { id: 'body.l5.c1.glucose', title: 'الجلوكوز: من الخبز إلى الطاقة', status: 'soon' },
        { id: 'body.l5.c1.liver', title: 'كيف يصفّي الكبد', status: 'soon' },
        { id: 'body.l5.c1.blood', title: 'إنتاج الدم وعمر الكرية الحمراء', status: 'soon' },
        { id: 'body.l5.c1.oxygen', title: 'رحلة الأكسجين', status: 'soon' },
        { id: 'body.l5.c1.drug', title: 'الدواء في الجسم', status: 'soon' },
        { id: 'body.l5.c1.protein', title: 'البروتين: من اللحم إلى العضلة', status: 'soon' },
      ] },
    ] },
    { n: 6, title: 'التشخيص العملي', courses: [
      { id: 'c1', title: 'قراءة الفحوصات', lessons: [] },
    ] },
  ],
};
