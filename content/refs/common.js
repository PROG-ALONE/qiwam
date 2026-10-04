// سجل المراجع المشتركة. القاعدة: لا مرجع بلا تحقق (انظر tools/verify-refs.mjs).
// cites: مواضع داخل المرجع (فصل/قسم/صفحة) تُستخدم في <cite r="ref.id:الموضع">.

export default {
  'ref.openstax-ap2e': {
    apa: 'Betts, J. G., Young, K. A., Wise, J. A., Johnson, E., Poe, B., Kruse, D. H., Korol, O., Johnson, J. E., Womble, M., & DeSaix, P. (2022). <i>Anatomy and physiology 2e</i>. OpenStax. https://openstax.org/details/books/anatomy-and-physiology-2e',
    short: 'Betts وآخرون، 2022 (OpenStax)',
    type: 'book', evidence: 'textbook',
    doi: null, pmid: null, pmcid: null,
    url: 'https://openstax.org/details/books/anatomy-and-physiology-2e',
    access: 'open', license: 'CC BY-NC-SA 4.0',
    pdf: null, // الكتاب كامل كبير جدًا؛ نحيل إلى صفحات الأقسام
    cites: {
      '1.2': { title: '1.2 Structural Organization of the Human Body', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/1-2-structural-organization-of-the-human-body' },
      '1.7': { title: '1.7 Medical Imaging', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/1-7-medical-imaging' },
      '3.2': { title: '3.2 The Cytoplasm and Cellular Organelles', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/3-2-the-cytoplasm-and-cellular-organelles' },
      '3.3': { title: '3.3 The Nucleus and DNA Replication', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/3-3-the-nucleus-and-dna-replication' },
      '4.1': { title: '4.1 Types of Tissues', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/4-1-types-of-tissues' },
      '4.3': { title: '4.3 Connective Tissue Supports and Protects', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/4-3-connective-tissue-supports-and-protects' },
      '18.3': { title: '18.3 Erythrocytes', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/18-3-erythrocytes' },
      '19.1': { title: '19.1 Heart Anatomy', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy' },
      '19.4': { title: '19.4 Cardiac Physiology', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/19-4-cardiac-physiology' },
      '20.2': { title: '20.2 Blood Flow, Blood Pressure, and Resistance', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/20-2-blood-flow-blood-pressure-and-resistance' },
      '23.4': { title: '23.4 The Stomach', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach' },
      '23.6': { title: '23.6 Accessory Organs in Digestion: The Liver, Pancreas, and Gallbladder', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/23-6-accessory-organs-in-digestion-the-liver-pancreas-and-gallbladder' },
      '25.3': { title: '25.3 Gross Anatomy of the Kidney', url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/25-3-gross-anatomy-of-the-kidney' },
    },
    verified: { by: 'openstax.org (عنوان الكتاب والمؤلفون والسنة والترخيص)', date: '2026-10-03', status: 'ok' },
  },

  'ref.sender2016': {
    apa: 'Sender, R., Fuchs, S., & Milo, R. (2016). Revised estimates for the number of human and bacteria cells in the body. <i>PLOS Biology, 14</i>(8), e1002533. https://doi.org/10.1371/journal.pbio.1002533',
    short: 'Sender وآخرون، 2016',
    type: 'article', evidence: 'review', // مراجعة وتجميع للبيانات المنشورة لتقدير الأعداد
    doi: '10.1371/journal.pbio.1002533', pmid: null, pmcid: null, // PMID يملؤه verify-refs
    url: 'https://doi.org/10.1371/journal.pbio.1002533',
    access: 'open', license: 'CC BY 4.0',
    pdf: 'refs/pdf/sender2016.pdf', // ينزّله tools/fetch-pdfs.mjs؛ وإن لم يوجد يُعرض رابط DOI
    pdfSource: 'https://journals.plos.org/plosbiology/article/file?id=10.1371/journal.pbio.1002533&type=printable',
    verified: { by: 'crossref (العنوان، والمؤلفون، والمجلة، والمجلد، والعدد، والسنة، والترخيص)', date: '2026-10-03', status: 'ok' },
  },
};

export const EVIDENCE = {
  'systematic-review': 'مراجعة منهجية',
  'review': 'مراجعة علمية',
  'rct': 'تجربة عشوائية محكمة',
  'cohort': 'دراسة أترابية',
  'consensus': 'بيان إجماع',
  'guideline': 'إرشاد سريري',
  'textbook': 'كتاب مرجعي',
  'expert': 'رأي خبراء',
};
