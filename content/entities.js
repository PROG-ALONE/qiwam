// السجل المركزي للكيانات: لكل كيان بيت واحد (owner) يشرحه بعمق، والأجنحة الأخرى تحيل إليه.
// home: '<lessonId>#<sectionId>' إن كان الدرس موجودًا، وإلا null (تظهر الإحالة "قريبًا").

const E = {
  // ——— الجسم من الداخل ———
  'concept.levels_of_organization': { owner: 'body', home: 'body.l1.c1.levels#ladder', ar: 'مستويات التنظيم', en: 'Levels of organization', hook: 'من الذرة إلى الإنسان: كيف يُبنى جسمك طبقة فوق طبقة؟', refs: ['ref.openstax-ap2e:1.2'] },
  'cell.human':        { owner: 'body', home: 'body.l1.c1.levels#cell', ar: 'الخلية', en: 'Cell', la: 'Cellula', hook: 'أصغر وحدة حية تعمل بنفسها.', refs: ['ref.openstax-ap2e:1.2'] },
  'cell.organelle':    { owner: 'body', home: null, ar: 'العضيّة', en: 'Organelle', hook: 'مصانع صغيرة داخل كل خلية.', refs: ['ref.openstax-ap2e:1.2'] },
  'tissue.epithelial': { owner: 'body', home: null, ar: 'النسيج الطلائي', en: 'Epithelial tissue', la: 'Textus epithelialis', hook: 'الغطاء والبطانة: من الجلد إلى بطانة الأمعاء.', refs: ['ref.openstax-ap2e:4.1'] },
  'tissue.connective': { owner: 'body', home: null, ar: 'النسيج الضام', en: 'Connective tissue', la: 'Textus connectivus', hook: 'النسيج الذي يربط ويدعم: ومنه الأوتار والعظم والدم.', refs: ['ref.openstax-ap2e:4.1'] },
  'tissue.muscle':     { owner: 'body', home: null, ar: 'النسيج العضلي', en: 'Muscle tissue', la: 'Textus muscularis', hook: 'ثلاثة أنواع من العضلات: أيّها يطيعك؟', refs: ['ref.openstax-ap2e:4.1'] },
  'tissue.nervous':    { owner: 'body', home: null, ar: 'النسيج العصبي', en: 'Nervous tissue', la: 'Textus nervosus', hook: 'النسيج الذي يحمل الإشارات في الجسم.', refs: ['ref.openstax-ap2e:4.1'] },
  'organ.heart':   { owner: 'body', home: null, ar: 'القلب', en: 'Heart', la: 'Cor', hook: 'مضخة لا تستريح.', refs: ['ref.openstax-ap2e:19.1'] },
  'organ.lungs':   { owner: 'body', home: null, ar: 'الرئتان', en: 'Lungs', la: 'Pulmones', hook: 'حيث يلتقي الهواء بالدم.', refs: [] },
  'organ.liver':   { owner: 'body', home: null, ar: 'الكبد', en: 'Liver', la: 'Hepar', hook: 'كيف يصفّي الكبد ما يصل إليه؟', refs: ['ref.openstax-ap2e:23.6'] },
  'organ.stomach': { owner: 'body', home: null, ar: 'المعدة', en: 'Stomach', la: 'Gaster', hook: 'كيف لا تهضم المعدة نفسها؟', refs: ['ref.openstax-ap2e:23.4'] },
  'organ.kidneys': { owner: 'body', home: null, ar: 'الكليتان', en: 'Kidneys', la: 'Renes', hook: 'كيف تُصفّي الكلية الدم؟', refs: ['ref.openstax-ap2e:25.3'] },
  'organ.brain':   { owner: 'body', home: null, ar: 'الدماغ', en: 'Brain', la: 'Encephalon', hook: 'العضو الذي يتعلم الآن.', refs: [] },
  'system.digestive': { owner: 'body', home: null, ar: 'الجهاز الهضمي', en: 'Digestive system', hook: 'رحلة اللقمة من الفم إلى الخلية.', refs: [] },

  // ——— التشريح ———
  'cell.rbc':        { owner: 'body', home: null, ar: 'خلية الدم الحمراء', en: 'Erythrocyte', la: 'Erythrocytus', hook: 'قرص مرن يعيش نحو 120 يومًا.', refs: ['ref.openstax-ap2e:18.3'] },
  'disease.sickle_cell': { owner: 'body', home: 'body.l1.c1.levels#sickle', ar: 'فقر الدم المنجلي', en: 'Sickle cell disease', hook: 'خلل في جزيء واحد يصعد السلّم حتى الإنسان كله.', refs: ['ref.openstax-ap2e:18.3'] },
  'concept.pulse':   { owner: 'body', home: 'body.l1.c1.levels#pulse', ar: 'النبض', en: 'Pulse', hook: 'كيف تقيس قلبك بإصبعين؟', refs: ['ref.openstax-ap2e:20.2'] },
  'tendon.patellar': { owner: 'anatomy', home: null, ar: 'الوتر الرضفي', en: 'Patellar tendon', la: 'Ligamentum patellae', hook: 'لماذا يتأخر بالشفاء أكثر من العضلة نفسها؟', refs: ['ref.openstax-ap2e:4.3'] },
};

export default E;
export const get = (id) => E[id] || null;
