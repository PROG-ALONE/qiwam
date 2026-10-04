// فحص بنية المحتوى: القالب الإلزامي، والمراجع ومواضعها، والرسوم، والأسئلة وأنواعها.
// node tools/lint-content.mjs
import { existsSync } from 'node:fs';
import path from 'node:path';
import { allLessons, questionsFor, imp, impAll, cites, ROOT, reporter } from './lib.mjs';

const { REFS } = await impAll('content/refs/index.js');
const formulas = await imp('content/formulas/index.js');
const glossary = await imp('content/glossary.js');
const R = reporter('فحص المحتوى');

const TYPES = ['mcq', 'multi', 'hotspot', 'name-it', 'drag-label', 'match', 'order', 'tf-why', 'case', 'image', 'calc'];
const BLOOM = ['remember', 'understand', 'apply', 'analyze'];
const checkCite = (where, c) => {
  const [id, loc] = c.split(':');
  if (!REFS[id]) return R.error(`${where}: مرجع غير موجود ${id}`);
  if (loc && !REFS[id].cites?.[loc]) R.error(`${where}: الموضع «${loc}» غير معرّف في ${id}.cites`);
  if (REFS[id].verified?.status !== 'ok') R.error(`${where}: المرجع ${id} غير متحقق منه`);
};

const STEP_WORDS = 90; // الخطوة فكرة واحدة: نص قصير
for (const { file, lesson: L } of await allLessons()) {
  for (const k of ['id', 'wing', 'title', 'minutes', 'objectives', 'steps', 'summary']) if (L[k] == null) R.error(`${file}: الحقل ${k} مفقود`);
  if (L.objectives.length < 3 || L.objectives.length > 5) R.warn(`${file}: الأهداف ${L.objectives.length} (المطلوب 3–5)`);
  const kinds = new Set(L.steps.map(s => s.kind));
  if (!kinds.has('science')) R.error(`${file}: لا توجد خطوة علمية (kind: 'science')`);
  if (!kinds.has('practical')) R.error(`${file}: لا توجد خطوة عملية`);
  if (!kinds.has('case') && !kinds.has('futsal')) R.error(`${file}: لا توجد خطوة تطبيق`);
  const stepIds = new Set();
  for (const s of L.steps) {
    const w = `${file} [${s.id}]`;
    if (stepIds.has(s.id)) R.error(`${w}: معرّف خطوة مكرر`); stepIds.add(s.id);
    if (!s.visual) R.warn(`${w}: خطوة بلا رسم تفاعلي`);
    else if (!existsSync(path.join(ROOT, 'core/viz/visuals', `${s.visual.id}.js`))) R.error(`${w}: الرسم ${s.visual.id} غير موجود`);
    const n = s.html.replace(/<ref-card[^>]*><\/ref-card>/g, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    if (n > STEP_WORDS) R.warn(`${w}: ${n} كلمة. الخطوة فكرة واحدة؛ اختصر إلى ${STEP_WORDS} أو قسّمها.`);
    // القالب الموسّع: الفكرة في سطر، وسؤال تذكّر للمراجعة الموجهة، و«اشرح أكثر» (معفى من حد الكلمات)
    if (!s.key) R.error(`${w}: لا توجد «الفكرة في سطر» (key)`);
    if (!s.recall?.q || !s.recall?.a) R.error(`${w}: لا يوجد سؤال تذكّر (recall: {q, a})`);
    if (!s.more) R.warn(`${w}: لا يوجد «اشرح أكثر» (more)`);
    if (s.visual?.id === 'vis.formula') {
      const F = formulas[s.visual.props?.formula];
      if (!F) R.error(`${w}: المعادلة ${s.visual.props?.formula} غير موجودة في content/formulas`);
      else for (const k of ['vars', 'parts', 'compute', 'steps', 'practice']) if (!F[k]) R.error(`${w}: المعادلة ينقصها ${k}`);
    }
    const cs = [...cites(s.html), ...cites(s.more || '')];
    if (s.kind === 'science' && !cs.length) R.error(`${w}: خطوة علمية بلا مراجع`);
    cs.forEach(c => checkCite(w, c));
    if (s.check && (!s.check.options?.some(o => o.id === s.check.correct) || !s.check.explain)) R.error(`${w}: الفحص السريع ناقص (الجواب أو الشرح)`);
  }
  // خريطة الدرس: كل عقدة تشير إلى خطوة موجودة
  const walk = (n) => { if (!stepIds.has(n.step)) R.error(`${file}: عقدة في خريطة الدرس تشير إلى خطوة غير موجودة «${n.step}»`); (n.kids || []).forEach(walk); };
  if (L.map) walk(L.map); else R.warn(`${file}: لا توجد خريطة للدرس (map)`);
  for (const g of L.glossary || []) if (!glossary.find(x => x.id === g)) R.error(`${file}: مصطلح غير موجود في المسرد ${g}`);
  (L.flashcards || []).forEach((f, i) => f.ref && checkCite(`${file} بطاقة ${i + 1}`, f.ref));

  const Q = await questionsFor(L.quiz || L.id);
  if (!Q) { R.error(`${file}: لا يوجد بنك أسئلة`); continue; }
  const ids = new Set();
  if (Q.questions.length < 5 || Q.questions.length > 12) R.warn(`${Q.file}: ${Q.questions.length} سؤالًا (المطلوب للدرس 5–10)`);
  for (const q of Q.questions) {
    const w = `${Q.file} ${q.id}`;
    if (ids.has(q.id)) R.error(`${w}: معرّف مكرر`); ids.add(q.id);
    if (!TYPES.includes(q.type)) R.error(`${w}: نوع غير معروف ${q.type}`);
    if (![1, 2, 3].includes(q.difficulty)) R.error(`${w}: الصعوبة يجب أن تكون 1–3`);
    if (!BLOOM.includes(q.bloom)) R.error(`${w}: مستوى بلوم غير صالح`);
    if (!q.explain?.correct) R.error(`${w}: لا يوجد شرح للجواب الصحيح`);
    if (['mcq', 'case', 'image', 'multi'].includes(q.type)) {
      const correct = [].concat(q.correct);
      for (const o of q.options) if (!correct.includes(o.id) && !q.explain?.wrong?.[o.id] && !q.explain?.wrong?.default) R.error(`${w}: لا يوجد شرح للخيار الخاطئ ${o.id}`);
    }
    (q.refs || []).forEach(c => checkCite(w, c));
    if (q.visual && !existsSync(path.join(ROOT, 'core/viz/visuals', `${q.visual}.js`))) R.error(`${w}: الرسم ${q.visual} غير موجود`);
    if (q.img && !existsSync(path.join(ROOT, q.img.src))) R.error(`${w}: الصورة ${q.img.src} غير موجودة`);
  }
}
R.done();
