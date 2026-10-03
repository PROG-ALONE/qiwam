// فحص بنية المحتوى: القالب الإلزامي، والمراجع ومواضعها، والرسوم، والأسئلة وأنواعها.
// node tools/lint-content.mjs
import { existsSync } from 'node:fs';
import path from 'node:path';
import { allLessons, questionsFor, imp, impAll, cites, ROOT, reporter } from './lib.mjs';

const { REFS } = await impAll('content/refs/index.js');
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

for (const { file, lesson: L } of await allLessons()) {
  for (const k of ['id', 'wing', 'title', 'minutes', 'objectives', 'sections', 'summary']) if (L[k] == null) R.error(`${file}: الحقل ${k} مفقود`);
  if (L.objectives.length < 3 || L.objectives.length > 5) R.warn(`${file}: الأهداف ${L.objectives.length} (المطلوب 3–5)`);
  if (!L.sections.some(s => s.type === 'science')) R.error(`${file}: لا يوجد شرح علمي`);
  if (!L.sections.some(s => s.type === 'practical')) R.error(`${file}: لا يوجد شرح عملي`);
  if (!L.sections.some(s => s.type === 'case' || s.type === 'futsal')) R.error(`${file}: لا يوجد تطبيق`);
  if (!(L.visuals || []).length) R.error(`${file}: لا يوجد رسم تفاعلي`);
  for (const v of L.visuals || []) if (!existsSync(path.join(ROOT, 'core/viz/visuals', `${v.id}.js`))) R.error(`${file}: الرسم ${v.id} غير موجود`);
  for (const g of L.glossary || []) if (!glossary.find(x => x.id === g)) R.error(`${file}: مصطلح غير موجود في المسرد ${g}`);
  for (const s of L.sections) {
    const cs = cites(s.html);
    if (s.type === 'science' && !cs.length) R.error(`${file} [${s.id}]: شرح علمي بلا مراجع`);
    cs.forEach(c => checkCite(`${file} [${s.id}]`, c));
    // كل فقرة علمية تنتهي بمرجع
    if (s.type === 'science') for (const p of s.html.split('</p>')) if (/<p[ >]/.test(p) && !/<cite /.test(p) && p.replace(/<[^>]+>/g, '').trim().length > 40 && !/<h3/.test(p)) R.warn(`${file} [${s.id}]: فقرة علمية بلا مرجع: «${p.replace(/<[^>]+>/g, '').trim().slice(0, 50)}…»`);
  }
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
