// محرك الدرس: يعرض القالب الإلزامي (الأهداف، والمتطلبات، والشرح النظري والعلمي والعملي، والتطبيق،
// والرسوم، والملخص، وبطاقات المراجعة، والاختبار، والمراجع)، ويربط الكيانات والمراجع داخل النص.

import { h } from '../ui/dom.js';
import { header } from '../ui/header.js';
import wings from '../../content/wings.js';
import entities from '../../content/entities.js';
import { loadLesson, loadQuestions, loadStructure, loadVisual, lessonHref, lessonIdFrom, flatLessons } from '../content.js';
import { refCard, entityTarget } from '../entities/refcard.js';
import { openRef } from '../refs/panel.js';
import { getRef, parseCite, evidenceName } from '../refs/registry.js';
import { runQuiz } from '../quiz/quiz.js';
import { markVisited, recordQuiz, lessonState } from '../progress.js';
import { lessonCards, flashDeck } from './flashcards.js';
import { videoButtons } from '../ui/video.js';
import { backButton, pushReturn } from '../nav.js';
import { go } from '../router.js';

const SECTION_NAMES = { theory: 'الشرح النظري', science: 'الشرح العلمي', practical: 'الشرح العملي', futsal: 'التطبيق على كرة القدم', case: 'التطبيق' };

export async function render(root, params) {
  const id = lessonIdFrom(params);
  let lesson;
  try { lesson = await loadLesson(id); } catch { return go(`#/${params.wing}`, { replace: true }); }
  const w = wings.find(x => x.id === lesson.wing);
  const structure = await loadStructure(lesson.wing);
  const flat = flatLessons(structure).filter(l => l.status === 'open');
  const pos = flat.findIndex(l => l.id === id);
  const meta = flat[pos];
  const href = lessonHref(id);
  markVisited(lesson, href);

  // ترقيم المراجع بترتيب أول ظهور
  const refNums = new Map();
  const numFor = (refId) => { if (!refNums.has(refId)) refNums.set(refId, refNums.size + 1); return refNums.get(refId); };

  const enhance = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html;
    t.content.querySelectorAll('e').forEach(e => {
      const eid = e.getAttribute('id'); const ent = entities[eid];
      const a = document.createElement('a');
      a.className = 'ent'; a.textContent = e.textContent;
      if (ent) {
        const tgt = entityTarget(eid);
        const sameLesson = ent.home && ent.home.split('#')[0] === id;
        a.href = sameLesson ? `#` : tgt.href;
        a.title = `${ent.en || ''}${ent.hook ? ` — ${ent.hook}` : ''}`;
        a.dataset.entity = eid;
        if (sameLesson) a.addEventListener('click', ev => { ev.preventDefault(); document.getElementById(ent.home.split('#')[1])?.scrollIntoView({ behavior: 'smooth' }); });
        else a.addEventListener('click', () => pushReturn(lesson.title));
        if (ent.owner !== lesson.wing) a.classList.add('is-foreign');
      }
      e.replaceWith(a);
    });
    t.content.querySelectorAll('cite').forEach(c => {
      const r = c.getAttribute('r'); const n = numFor(parseCite(r).id);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'cite'; b.textContent = n;
      b.setAttribute('aria-label', `المرجع ${n}`);
      b.addEventListener('click', () => openRef(r, { number: n }));
      const sup = document.createElement('sup'); sup.append(b);
      c.replaceWith(sup);
    });
    t.content.querySelectorAll('ref-card').forEach(rc => rc.replaceWith(refCard(rc.getAttribute('entity'))));
    return t.content;
  };

  const toc = [];
  const block = (sid, title, ...children) => { toc.push({ sid, title }); return h('section.ls-block', { id: sid, 'aria-labelledby': `${sid}-h` }, h('h2', { id: `${sid}-h` }, title), ...children); };

  const visualsAfter = (sid) => (lesson.visuals || []).filter(v => v.after === sid).map(v => {
    const fig = h('figure.ls-visual', { 'data-visual': v.id });
    const cap = v.caption ? h('figcaption', v.caption) : null;
    loadVisual(v.id).then(mod => { mod.mount(fig, v.props || {}); if (cap) fig.append(cap); });
    return fig;
  });

  const objectivesBlock = block('objectives', 'الأهداف التعليمية', h('p', 'بنهاية هذا الدرس تستطيع:'), h('ol.ls-goals', lesson.objectives.map(o => h('li', o))));
  const prereqBlock = block('prereq', 'المتطلبات السابقة', lesson.prerequisites.length
    ? h('ul', lesson.prerequisites.map(p => h('li', h('a', { href: lessonHref(p) }, p))))
    : h('p', 'لا شيء. هذا درس بداية، يصلح لأي متعلّم.'));
  const sections = lesson.sections.map(s => block(s.id, s.title || SECTION_NAMES[s.type],
    h('p.ls-kind', SECTION_NAMES[s.type] || '', s.evidence ? h('span.ls-evidence', 'قوة الدليل: ', s.evidence.map(evidenceName).join('، ')) : null),
    h('div.ls-prose', enhance(s.html)),
    ...visualsAfter(s.id)));

  // المراجع (بعد معالجة النص حتى يكتمل الترقيم)
  (lesson.refs || []).forEach(numFor);
  const refList = h('ol.ls-refs', [...refNums.entries()].map(([rid, n]) => {
    const r = getRef(rid);
    return r ? h('li', { value: n }, h('span.ltr.ls-apa', { html: r.apa }), ' ', h('button.cite-link', { type: 'button', onclick: () => openRef(rid, { number: n }) }, 'التفاصيل')) : null;
  }));

  const questions = await loadQuestions(lesson.quiz || id);
  const quizBox = h('div.ls-quiz');
  const startQuiz = h('button.btn.btn--primary', { type: 'button' }, `ابدأ الاختبار (${questions.length} أسئلة)`);
  startQuiz.addEventListener('click', () => runQuiz(quizBox, questions, {
    scope: id,
    onCite: (c) => openRef(c),
    onFinish: (pct) => { recordQuiz(id, pct); statusChip.replaceWith(statusChip = chip()); },
  }));
  quizBox.append(h('p', 'اختبار قصير يغطي الدرس، بأنواع أسئلة مختلفة. تحتاج 70% ليكتمل الدرس.'), startQuiz);

  const chip = () => { const st = lessonState(id); return h('span.ls-status', { 'data-status': st.status }, st.status === 'done' ? `مكتمل${st.best != null ? ` (${Math.round(st.best * 100)}%)` : ''}` : st.status === 'started' ? 'قيد الدراسة' : 'جديد'); };
  let statusChip = chip();

  const article = h('article.ls-article',
    backButton(),
    h('nav.ls-crumbs', { 'aria-label': 'المسار' }, h('a', { href: `#/${w.id}` }, w.name), ' › ', meta ? `المستوى ${meta.level.n}: ${meta.level.title}` : '', ' › ', meta?.course.title || ''),
    h('header.ls-head',
      h('h1', lesson.title),
      h('p.ls-en.ltr', lesson.titleEn),
      h('p.ls-meta', `${lesson.minutes} دقيقة`, ' · ', statusChip)),
    videoButtons(lesson.videoQuery?.en, lesson.videoQuery?.ar, lesson.video),
    objectivesBlock,
    prereqBlock,
    ...sections,
    block('summary', 'الملخص', h('ul.ls-summary', lesson.summary.map(s => h('li', s)))),
    block('cards', 'بطاقات المراجعة', h('p', 'قيّم تذكّرك لكل بطاقة، فتعود إليك في الوقت المناسب للمراجعة.'), flashDeck(lessonCards(lesson), { lesson: id })),
    block('quiz', 'الاختبار', quizBox),
    block('refs', 'المراجع', refList, h('p.ls-note', 'اضغط على أي رقم صغير في النص لترى مرجعه.')),
    h('nav.ls-pager',
      flat[pos - 1] ? h('a.btn', { href: lessonHref(flat[pos - 1].id) }, `→ ${flat[pos - 1].title}`) : h('span'),
      flat[pos + 1] ? h('a.btn', { href: lessonHref(flat[pos + 1].id) }, `${flat[pos + 1].title} ←`) : h('a.btn', { href: `#/${w.id}` }, 'العودة إلى الجناح')),
  );

  const tocNav = h('nav.ls-toc', { 'aria-label': 'محتويات الدرس' }, h('p.ls-toc-title', 'في هذا الدرس'),
    h('ol', toc.map(t => h('li', h('a', { href: '#', 'data-sid': t.sid, onclick: (e) => { e.preventDefault(); document.getElementById(t.sid)?.scrollIntoView({ behavior: 'smooth' }); } }, t.title)))));

  root.append(header({ wing: w }), h('main.lesson', { style: { '--c': w.color } }, tocNav, article));

  // تتبع القسم الظاهر في المحتويات
  const io = new IntersectionObserver((entries) => entries.forEach(en => {
    if (en.isIntersecting) tocNav.querySelectorAll('a').forEach(a => a.classList.toggle('is-here', a.dataset.sid === en.target.id));
  }), { rootMargin: '-30% 0px -60% 0px' });
  article.querySelectorAll('.ls-block').forEach(b => io.observe(b));

  // الانتقال إلى قسم محدد (?s=)
  const s = new URLSearchParams(location.hash.split('?')[1] || '').get('s');
  if (s) requestAnimationFrame(() => document.getElementById(s)?.scrollIntoView());
}
