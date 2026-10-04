// مراجعة المستوى: مراجعة موجهة متسلسلة لكل دروس المستوى المنشورة (الفكرة الأساسية لكل خطوة،
// وأسئلة التذكّر، وخريطة كل درس)، ثم اختبار المستوى من بنوك أسئلة الدروس (يكتمل بـ 70%).
import { h } from './ui/dom.js';
import { header } from './ui/header.js';
import wings from '../content/wings.js';
import { loadStructure, hasStructure, loadLesson, loadQuestions, lessonHref } from './content.js';
import { runQuiz } from './quiz/quiz.js';
import { openRef } from './refs/panel.js';
import { shuffle } from './quiz/types.js';
import * as store from './store.js';
import { go } from './router.js';

const MAX_Q = 15;

export async function render(root, { wing, level }) {
  const w = wings.find(x => x.id === wing);
  if (!w || !hasStructure(wing)) return go('#/map', { replace: true });
  const st = await loadStructure(wing);
  const lv = st.levels.find(l => String(l.n) === String(level));
  if (!lv) return go(`#/${wing}`, { replace: true });

  const all = lv.courses.flatMap(c => c.lessons);
  const open = all.filter(l => l.status === 'open');
  const lessons = await Promise.all(open.map(l => loadLesson(l.id)));
  const banks = await Promise.all(lessons.map(l => loadQuestions(l.quiz || l.id).catch(() => [])));
  const key = `${wing}.${lv.n}`;
  const rec = () => store.get('levelReview', key, { best: null });

  const main = h('main.page.lvr', { style: { '--c': w.color } });
  root.append(header({ wing: w }), main);

  if (!lessons.length) {
    main.append(h('h1', `مراجعة المستوى ${lv.n}: ${lv.title}`), h('p', 'لا توجد دروس منشورة في هذا المستوى بعد.'), h('a.btn', { href: `#/${wing}` }, 'العودة إلى الجناح'));
    return;
  }

  // 1) المراجعة الموجهة: درسًا درسًا، وخطوة خطوة
  const guided = h('section.lvr-guided',
    h('h2', '١. المراجعة الموجهة'),
    h('p', 'اقرأ الفكرة الأساسية لكل خطوة بالترتيب، ثم أجب عن سؤال التذكّر في ذهنك قبل أن تفتح الجواب. وإن احتجت، افتح الخطوة نفسها.'),
    lessons.map((l, li) => h('article.lvr-lesson',
      h('h3', h('span.lvr-n', `الدرس ${li + 1}`), l.title),
      h('ol.lvr-steps', l.steps.filter(s => s.key).map(s => h('li',
        h('p.lvr-key', h('a', { href: `${lessonHref(l.id)}?s=${s.id}` }, s.title), ': ', s.key),
        s.recall ? h('details.lvr-recall', h('summary', s.recall.q), h('p', s.recall.a)) : null))),
      l.map ? h('div.lvr-map', h('h4', 'خريطة الدرس'), h('ul.cm-tree', mapNode(l.map, l.id))) : null)));

  // 2) اختبار المستوى
  const pool = banks.flat();
  const box = h('div.ls-quiz');
  const status = h('p.lvr-status');
  const paint = () => { const b = rec().best; status.textContent = b == null ? 'لم تختبر نفسك في هذا المستوى بعد.' : `أفضل نتيجة: ${Math.round(b * 100)}%${b >= 0.7 ? ' — اجتزت المستوى.' : ' — تحتاج 70% لاجتياز المستوى.'}`; };
  paint();
  const start = h('button.btn.btn--primary', { type: 'button' }, `ابدأ اختبار المستوى (${Math.min(MAX_Q, pool.length)} سؤالًا)`);
  start.addEventListener('click', () => runQuiz(box, shuffle(pool).slice(0, MAX_Q), {
    scope: `level:${key}`, title: 'اختبار المستوى', onCite: (c) => openRef(c),
    onFinish: (pct) => { store.update('levelReview', key, s => ({ ...s, best: Math.max(s.best ?? 0, pct), last: pct }), { best: null }); paint(); },
  }));
  box.append(h('p', 'أسئلة مختارة عشوائيًا من كل دروس المستوى، وتتغير في كل محاولة.'), start);

  main.append(
    h('nav.ls-crumbs', { 'aria-label': 'المسار' }, h('a', { href: `#/${wing}` }, w.name), ` › المستوى ${lv.n}`),
    h('h1', `مراجعة المستوى ${lv.n}: ${lv.title}`),
    h('p.lvr-cover', `تغطي هذه المراجعة ${open.length} ${open.length === 1 ? 'درسًا منشورًا' : 'دروس منشورة'} من ${all.length} في هذا المستوى، وتتسع تلقائيًا مع كل درس جديد.`),
    guided,
    h('section.lvr-test', h('h2', '٢. اختبار المستوى'), status, box));
}

function mapNode(n, id) {
  return h('li', h('a.cm-node', { href: `${lessonHref(id)}?s=${n.step}` }, n.t), n.kids ? h('ul', n.kids.map(k => mapNode(k, id))) : null);
}
