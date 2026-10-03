// قاعدة «كل معلومة لها بيت واحد»: يحذّر إذا شرح درسٌ كيانًا لا يملكه جناحه بأكثر من 80 كلمة.
// node tools/lint-ownership.mjs
import { allLessons, imp, ents, refcards, words, reporter } from './lib.mjs';

const LIMIT = 80;
const entities = await imp('content/entities.js');
const R = reporter('فحص الملكية');

for (const { file, lesson } of await allLessons()) {
  for (const s of lesson.sections) {
    for (const id of [...ents(s.html), ...refcards(s.html), ...(s.about || [])]) if (!entities[id]) R.error(`${file} [${s.id}]: كيان غير مسجّل ${id}`);
    for (const id of s.about || []) if (entities[id] && entities[id].owner !== lesson.wing) R.warn(`${file} [${s.id}]: القسم يشرح «${id}» ومالكه جناح ${entities[id].owner}. اكتفِ بجملة وبطاقة إحالة.`);
    // كل فقرة أو عنصر قائمة يذكر كيانًا غير مملوك ويطول أكثر من الحد
    for (const block of s.html.split(/<\/p>|<\/li>/)) {
      const foreign = ents(block).filter(id => entities[id] && entities[id].owner !== lesson.wing);
      if (foreign.length && words(block) > LIMIT) R.warn(`${file} [${s.id}]: فقرة من ${words(block)} كلمة تذكر ${foreign.join('، ')} (يملكه جناح آخر).`);
    }
  }
}
R.done();
