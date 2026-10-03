// الجسم من الداخل — المستوى 1، الكورس 1، الدرس 1
// الدرس خطوات قصيرة: فكرة واحدة لكل خطوة، ورسم تفاعلي، وجملتان أو ثلاث، وفحص سريع أحيانًا.
// كل جملة علمية مربوطة بمرجع متحقق منه (content/refs/common.js).

const OS = 'ref.openstax-ap2e';

export default {
  id: 'body.l1.c1.levels',
  wing: 'body', level: 1, course: 'c1',
  title: 'مستويات التنظيم: من الذرة إلى الإنسان',
  titleEn: 'Levels of Organization',
  minutes: 15,
  objectives: [
    'ترتّب مستويات التنظيم من الذرة إلى الكائن الحي.',
    'تميّز بين الخلية والنسيج والعضو والجهاز بمثال لكل منها.',
    'تسمّي الأنواع الأربعة الكبرى للأنسجة.',
    'تعرف كم خلية في جسمك، وتصحّح خرافة «عشر بكتيريا لكل خلية».',
  ],
  prerequisites: [],
  glossary: ['atom', 'molecule', 'organelle', 'cell', 'tissue', 'organ', 'organ-system', 'organism', 'dense-regular-ct'],
  video: null,
  videoQuery: { en: 'levels of organization human body', ar: 'مستويات التنظيم في جسم الإنسان' },

  steps: [
    {
      id: 'ladder', kind: 'theory', title: 'جسمك بناء من طبقات',
      about: ['concept.levels_of_organization'],
      visual: { id: 'vis.levels-zoom' },
      html: `<p>جسمك ليس كتلة واحدة، بل طبقات، كل طبقة مصنوعة مما تحتها. هذا الترتيب اسمه <e id="concept.levels_of_organization">مستويات التنظيم</e> (Levels of organization)<cite r="${OS}:1.2"/>.</p>
<p class="step-try">شغّل الرحلة، أو اضغط على أي درجة.</p>`,
    },
    {
      id: 'atoms', kind: 'theory', title: 'من الذرة إلى الجزيء',
      visual: { id: 'vis.molecule' },
      html: `<p><strong>الذرة</strong> (Atom) أصغر وحدة من العنصر، كالأكسجين والهيدروجين. وحين ترتبط ذرتان أو أكثر يتكوّن <strong>جزيء</strong> (Molecule)، كجزيء الماء<cite r="${OS}:1.2"/>.</p>
<p class="step-try">اسحب ذرتَي الهيدروجين إلى ذرة الأكسجين.</p>`,
    },
    {
      id: 'cell', kind: 'theory', title: 'الخلية: أصغر وحدة حية',
      about: ['cell.human', 'cell.organelle'],
      visual: { id: 'vis.cell' },
      html: `<p><e id="cell.human">الخلية</e> (Cell) أصغر وحدة تعمل بنفسها في الكائن الحي. يحيط بها غشاء مرن، وفي داخلها سائل مائي اسمه السيتوبلازم، وفيه وحدات عاملة صغيرة اسمها <e id="cell.organelle">العضيّات</e> (Organelles)<cite r="${OS}:1.2"/>.</p>
<p class="step-try">اضغط على أجزاء الخلية لتعرف أسماءها.</p>`,
      check: {
        q: 'أين تقع العضيّات؟',
        options: [{ id: 'a', text: 'داخل الخلية' }, { id: 'b', text: 'بين الخلايا' }, { id: 'c', text: 'خارج الجسم' }],
        correct: 'a', explain: 'العضيّات وحدات صغيرة داخل الخلية، في السيتوبلازم.',
      },
    },
    {
      id: 'tissue', kind: 'theory', title: 'النسيج: خلايا تعمل معًا',
      visual: { id: 'vis.tissue' },
      html: `<p><strong>النسيج</strong> (Tissue) مجموعة من الخلايا المتشابهة تعمل معًا لأداء وظيفة محددة<cite r="${OS}:1.2"/>.</p>
<p class="step-try">اسحب الشريط واجمع الخلايا.</p>`,
    },
    {
      id: 'four', kind: 'science', title: 'الأنسجة الأربعة',
      evidence: ['textbook'],
      about: ['tissue.epithelial', 'tissue.connective', 'tissue.muscle', 'tissue.nervous'],
      visual: { id: 'vis.four-tissues' },
      html: `<p>كل خلايا الجسم، رغم تنوّعها، تنتظم في أربع فئات كبرى من الأنسجة: <e id="tissue.epithelial">الطلائي</e>، و<e id="tissue.connective">الضام</e>، و<e id="tissue.muscle">العضلي</e>، و<e id="tissue.nervous">العصبي</e><cite r="${OS}:4.1"/>.</p>
<p class="step-try">اقلب البطاقات الأربع.</p>`,
      check: {
        q: 'أيّ هذه ليس من الأنسجة الأربعة؟',
        options: [{ id: 'a', text: 'العضلي' }, { id: 'b', text: 'الكبدي' }, { id: 'c', text: 'العصبي' }],
        correct: 'b', explain: 'الأنسجة الأربعة: الطلائي والضام والعضلي والعصبي. والكبد عضو مبني من عدة أنسجة.',
      },
    },
    {
      id: 'organ', kind: 'theory', title: 'العضو والجهاز',
      visual: { id: 'vis.organ-map', props: { mode: 'explore' } },
      html: `<p><strong>العضو</strong> (Organ) بنية مستقلة تتكون من نوعين من الأنسجة أو أكثر. و<strong>الجهاز العضوي</strong> (Organ system) أعضاء تعمل معًا لأداء وظائف كبرى في الجسم<cite r="${OS}:1.2"/>. وفي الإنسان أحد عشر جهازًا<cite r="${OS}:1.2"/>.</p>
<p class="step-try">مرّر إصبعك على الأعضاء.</p>`,
      check: {
        q: 'المعدة عضو. فما هو الجهاز الهضمي؟',
        options: [{ id: 'a', text: 'نسيج' }, { id: 'b', text: 'جهاز عضوي يضم المعدة وأعضاء أخرى' }, { id: 'c', text: 'خلية كبيرة' }],
        correct: 'b', explain: 'الجهاز مجموعة أعضاء تعمل معًا، والمعدة واحد منها.',
      },
    },
    {
      id: 'organism', kind: 'theory', title: 'الكائن الحي: أنت',
      visual: { id: 'vis.levels-zoom', props: { start: 7, compact: true } },
      html: `<p>في قمة السلّم <strong>الكائن الحي</strong> (Organism): كائن ذو بنية خلوية يؤدي بنفسه كل الوظائف اللازمة للحياة<cite r="${OS}:1.2"/>.</p>
<p>الخلايا تجتمع في نسيج، والأنسجة في عضو، والأعضاء في جهاز، والأجهزة في إنسان.</p>`,
    },
    {
      id: 'count', kind: 'science', title: 'كم خلية فيك؟',
      evidence: ['review'],
      visual: { id: 'vis.cell-count' },
      html: `<p>في جسم رجل مرجعي (20 إلى 30 عامًا، 70 كيلوغرامًا) نحو <span class="ltr">30</span> تريليون خلية بشرية، منها نحو <span class="ltr">25</span> تريليونًا خلايا دم حمراء. ونحو <span class="ltr">38</span> تريليون بكتيريا: أي نحو 1.3 إلى 1، لا عشرة إلى واحد<cite r="ref.sender2016"/>.</p>
<p class="step-note">الأرقام تقديرات من تجميع بيانات منشورة، بهامش عدم يقين يقارب 25% للنسبة<cite r="ref.sender2016"/>.</p>`,
    },
    {
      id: 'touch', kind: 'practical', title: 'جرّبها على نفسك',
      visual: { id: 'vis.palpate' },
      html: `<p>اجلس واثنِ ركبتك قليلًا، وضع إصبعك تحت الرضفة مباشرة: الحبل المشدود هو <e id="tendon.patellar">الوتر الرضفي</e>. والأوتار مبنية من نسيج ضام كثيف منتظم<cite r="${OS}:4.3"/>.</p>
<ref-card entity="tendon.patellar"></ref-card>`,
    },
    {
      id: 'story', kind: 'case', title: 'التطبيق: لماذا غاب الوتر عن الأشعة؟',
      visual: { id: 'vis.xray-see' },
      html: `<p>الأشعة السينية تُظهر البنى الصلبة كالعظام بلون فاتح، أما الأنسجة الرخوة فتظهر رمادية باهتة<cite r="${OS}:1.7"/>. والوتر نسيج رخو، لذلك لا تكفي الأشعة وحدها لترى ما أصابه.</p>
<p class="step-try">بدّل بين «الركبة» و«ما تراه الأشعة».</p>`,
    },
  ],

  summary: [
    'ذرات ← جزيئات ← عضيّات ← خلايا ← أنسجة ← أعضاء ← أجهزة ← كائن حي.',
    'الخلية أصغر وحدة تعمل بنفسها، والنسيج خلايا متشابهة تعمل معًا.',
    'العضو يجمع نوعين من الأنسجة أو أكثر، والجهاز يجمع أعضاء.',
    'الأنسجة الأربعة: الطلائي، والضام، والعضلي، والعصبي.',
    'نحو 30 تريليون خلية بشرية، وبكتيريا بعدد مقارب (1.3 إلى 1).',
    'الأشعة السينية تُظهر العظم، والوتر لا يظهر فيها بوضوح.',
  ],

  flashcards: [
    { front: 'ما أصغر وحدة تعمل بنفسها في الكائن الحي؟', back: 'الخلية (Cell).', ref: `${OS}:1.2` },
    { front: 'ما الفرق بين النسيج والعضو؟', back: 'النسيج خلايا متشابهة تعمل معًا؛ والعضو بنية مستقلة من نوعين من الأنسجة أو أكثر.', ref: `${OS}:1.2` },
    { front: 'ما الأنسجة الأربعة الكبرى؟', back: 'الطلائي، والضام، والعضلي، والعصبي.', ref: `${OS}:4.1` },
    { front: 'كم تقريبًا نسبة البكتيريا إلى الخلايا البشرية في الجسم؟', back: 'نحو 1.3 إلى 1، لا 10 إلى 1.', ref: 'ref.sender2016' },
  ],

  quiz: 'body.l1.c1.levels',
  refs: [OS, 'ref.sender2016'],
  entities: ['concept.levels_of_organization', 'cell.human', 'cell.organelle', 'tissue.epithelial', 'tissue.connective', 'tissue.muscle', 'tissue.nervous', 'tendon.patellar'],
};
