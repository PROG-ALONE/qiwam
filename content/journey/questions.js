// الأسئلة المعلّقة من المدخل.
// wings: الأجنحة اللي تحمل الجواب (للعرض بالخريطة).
// answeredBy: معرفات الدروس المخطط لها (من PLAN.md). السؤال يتحول لـ ✓ لما يكتمل أي واحد منها.
// 'journey:7' معناه إن الجواب داخل المدخل نفسه (المشهد 7).

export default {
  'q.what':      { text: 'شنو هي؟', scene: 1, wings: [], answeredBy: ['journey:7'] },
  'q.load':      { text: 'شكد تتحمل الركبة قبل لا تحچي؟', scene: 2, wings: ['anatomy', 'rehab'], answeredBy: ['anat.l4.c3.tendon', 'rehab.l1.c3.load-capacity'] },
  'q.bone':      { text: 'شلون العظم يبني نفسه؟', scene: 3, wings: ['anatomy'], answeredBy: ['anat.l2.c1.remodeling'] },
  'q.diagnosis': { text: 'ليش تشخيص الأوتار صعب؟ وشنو تشوف الأشعة وشنو ما تشوف؟', scene: 4, wings: ['rehab', 'anatomy'], answeredBy: ['rehab.l2.c6.imaging', 'anat.l6.c4.xray'] },
  'q.silent':    { text: 'ليش الإصابة تتجمع بصمت؟', scene: 5, wings: ['football', 'rehab'], answeredBy: ['foot.l2.c4.load-monitoring', 'rehab.l1.c3.load-capacity'] },
  'q.plate':     { text: 'شنو العلاقة بين الصحن والركبة؟', scene: 5, wings: ['nutrition'], answeredBy: ['nutr.l4.c4.fat-loss'] },
  'q.flex':      { text: 'ليش المرونة مو بس عضلة؟', scene: 6, wings: ['movement'], answeredBy: ['move.l3.c2.how-flexibility-improves'] },
  'q.xray':      { text: 'شنو تكدر تشوف الأشعة؟ وشنو اللي ما تكدر تشوفه؟', scene: 8, wings: ['anatomy'], answeredBy: ['anat.l6.c4.xray'] },
  'q.heal':      { text: 'شلون يتعالج وتر؟', scene: 9, wings: ['rehab'], answeredBy: ['rehab.l3.c2.tendon-rehab'] },
  'q.return':    { text: 'ومتى يرجع للملعب؟', scene: 9, wings: ['football', 'rehab'], answeredBy: ['foot.l5.patellar', 'rehab.l5.c2.rtp-criteria'] },
};
