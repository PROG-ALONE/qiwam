// الأسئلة المعلّقة من المدخل.
// wings: الأجنحة اللي تحمل الجواب (للعرض بالخريطة).
// answeredBy: معرفات الدروس المخطط لها (من PLAN.md). السؤال يتحول لـ ✓ لما يكتمل أي واحد منها.
// 'journey:7' معناه إن الجواب داخل المدخل نفسه (المشهد 7).

export default {
  'q.what':      { text: 'ما هي؟', scene: 1, wings: [], answeredBy: ['journey:7'] },
  'q.load':      { text: 'كم تتحمّل الركبة قبل أن تشتكي؟', scene: 2, wings: ['anatomy', 'rehab'], answeredBy: ['anat.l4.c3.tendon', 'rehab.l1.c3.load-capacity'] },
  'q.bone':      { text: 'كيف يبني العظم نفسه؟', scene: 3, wings: ['anatomy'], answeredBy: ['anat.l2.c1.remodeling'] },
  'q.diagnosis': { text: 'لماذا يصعب تشخيص الأوتار؟ وماذا تُظهر الأشعة، وماذا لا تُظهر؟', scene: 4, wings: ['rehab', 'anatomy'], answeredBy: ['rehab.l2.c6.imaging', 'anat.l6.c4.xray'] },
  'q.silent':    { text: 'لماذا تتراكم الإصابة بصمت؟', scene: 5, wings: ['football', 'rehab'], answeredBy: ['foot.l2.c4.load-monitoring', 'rehab.l1.c3.load-capacity'] },
  'q.plate':     { text: 'ما العلاقة بين الطبق والركبة؟', scene: 5, wings: ['nutrition'], answeredBy: ['nutr.l4.c4.fat-loss'] },
  'q.flex':      { text: 'لماذا لا تقتصر المرونة على العضلة؟', scene: 6, wings: ['movement'], answeredBy: ['move.l3.c2.how-flexibility-improves'] },
  'q.xray':      { text: 'ماذا تستطيع الأشعة أن تُظهر؟ وما الذي لا تستطيع إظهاره؟', scene: 8, wings: ['anatomy'], answeredBy: ['anat.l6.c4.xray'] },
  'q.heal':      { text: 'كيف يُعالَج الوتر؟', scene: 9, wings: ['rehab'], answeredBy: ['rehab.l3.c2.tendon-rehab'] },
  'q.return':    { text: 'ومتى يعود إلى الملعب؟', scene: 9, wings: ['football', 'rehab'], answeredBy: ['foot.l5.patellar', 'rehab.l5.c2.rtp-criteria'] },
};
