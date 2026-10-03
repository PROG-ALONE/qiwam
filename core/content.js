// تحميل المحتوى عند الطلب: هيكل الجناح، والدرس، وبنك الأسئلة.
// المعرّف يحدد مكانه: 'body.l1.c1.levels' ← content/body/lessons/body.l1.c1.levels.js

const STRUCTURES = {
  body: () => import('../content/body/structure.js'),
};

export const hasStructure = (wing) => wing in STRUCTURES;

export async function loadStructure(wing) {
  if (!STRUCTURES[wing]) return null;
  return (await STRUCTURES[wing]()).default;
}

const wingOf = (id) => id.split('.')[0];

export async function loadLesson(id) {
  return (await import(`../content/${wingOf(id)}/lessons/${id}.js`)).default;
}

export async function loadQuestions(id) {
  try { return (await import(`../content/${wingOf(id)}/questions/${id}.js`)).default; }
  catch { return []; }
}

export async function loadVisual(id) {
  return (await import(`./viz/visuals/${id}.js`)).default;
}

/** 'body.l1.c1.levels' ← '#/body/l1/c1/levels' */
export const lessonHref = (id) => '#/' + id.split('.').join('/');
export const lessonIdFrom = ({ wing, level, course, lesson }) => [wing, level, course, lesson].join('.');

/** كل الدروس في هيكل الجناح، بالترتيب، مع موقعها */
export function flatLessons(structure) {
  const out = [];
  for (const lv of structure.levels) for (const c of lv.courses) for (const l of c.lessons) out.push({ ...l, level: lv, course: c });
  return out;
}
