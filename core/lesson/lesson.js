// محرك الدرس بالخطوات: المحتويات أولًا، ثم فكرة واحدة لكل شاشة (رسم تفاعلي + نص قصير + فحص سريع)،
// ثم الخلاصة، وبطاقات المراجعة، والاختبار، والمراجع. يحقق القالب الإلزامي كله، لكن مقسّمًا.

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
import * as store from '../store.js';
import { lessonCards, flashDeck } from './flashcards.js';
import { videoButtons } from '../ui/video.js';
import { backButton, pushReturn } from '../nav.js';
import { go } from '../router.js';

const KIND = { theory: 'فكرة', science: 'علم ودليل', practical: 'جرّب بنفسك', case: 'تطبيق', futsal: 'تطبيق' };

export async function render(root, params) {
  const id = lessonIdFrom(params);
  let lesson;
  try { lesson = await loadLesson(id); } catch { return go(`#/${params.wing}`, { replace: true }); }
  const w = wings.find(x => x.id === lesson.wing);
  const flat = flatLessons(await loadStructure(lesson.wing)).filter(l => l.status === 'open');
  const pos = flat.findIndex(l => l.id === id);
  const meta = flat[pos];
  markVisited(lesson, lessonHref(id));
  const questions = await loadQuestions(lesson.quiz || id);

  // ترقيم المراجع بترتيب أول ظهور في الدرس كله
  const refNums = new Map();
  const numFor = (rid) => { if (!refNums.has(rid)) refNums.set(rid, refNums.size + 1); return refNums.get(rid); };
  for (const s of lesson.steps) for (const m of s.html.matchAll(/<cite r="([^"]+)"/g)) numFor(parseCite(m[1]).id);
  (lesson.refs || []).forEach(numFor);

  // الشاشات: الخطوات ثم الخاتمة
  const stages = [
    ...lesson.steps.map(s => ({ key: s.id, title: s.title, kind: s.kind, step: s })),
    { key: 'summary', title: 'الخلاصة', kind: 'end' },
    { key: 'cards', title: 'راجع بالبطاقات', kind: 'end' },
    { key: 'quiz', title: 'اختبر نفسك', kind: 'end' },
    { key: 'refs', title: 'المراجع', kind: 'end' },
  ];

  const saved = () => store.get('lesson', id, {});
  const setSaved = (patch) => store.update('lesson', id, s => ({ ...s, ...patch }), { status: 'started', best: null });
  const visited = new Set(saved().visited || []);

  const main = h('main.lsn', { style: { '--c': w.color } });
  root.append(header({ wing: w }), main);

  // ——— معالجة النص: الكيانات، والمراجع، وبطاقات الإحالة ———
  const enhance = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html;
    t.content.querySelectorAll('e').forEach(e => {
      const eid = e.getAttribute('id'); const ent = entities[eid];
      const a = document.createElement('a');
      a.className = 'ent'; a.textContent = e.textContent;
      if (ent) {
        const sameLesson = ent.home && ent.home.split('#')[0] === id;
        a.href = sameLesson ? '#' : entityTarget(eid).href;
        a.title = `${ent.en || ''}${ent.hook ? ` — ${ent.hook}` : ''}`;
        if (sameLesson) a.addEventListener('click', ev => ev.preventDefault());
        else { a.classList.add('is-foreign'); a.addEventListener('click', () => pushReturn(lesson.title)); }
      }
      e.replaceWith(a);
    });
    t.content.querySelectorAll('cite').forEach(c => {
      const r = c.getAttribute('r'); const n = numFor(parseCite(r).id);
      const b = h('button.cite', { type: 'button', 'aria-label': `المرجع ${n}`, onclick: () => openRef(r, { number: n }) }, String(n));
      const sup = document.createElement('sup'); sup.append(b);
      c.replaceWith(sup);
    });
    t.content.querySelectorAll('ref-card').forEach(rc => rc.replaceWith(refCard(rc.getAttribute('entity'))));
    return t.content;
  };

  const chip = () => { const st = lessonState(id); return h('span.ls-status', { 'data-status': st.status }, st.status === 'done' ? `مكتمل${st.best != null ? ` (${Math.round(st.best * 100)}%)` : ''}` : st.status === 'started' ? 'قيد الدراسة' : 'جديد'); };

  // ——— شاشة المحتويات ———
  function overview() {
    history.replaceState(null, '', lessonHref(id));
    const s = saved();
    const resume = Number.isInteger(s.step) && s.step > 0 && s.step < stages.length;
    main.replaceChildren(h('div.lsn-over',
      backButton(),
      h('nav.ls-crumbs', { 'aria-label': 'المسار' }, h('a', { href: `#/${w.id}` }, w.name), meta ? ` › المستوى ${meta.level.n}: ${meta.level.title}` : ''),
      h('header.lsn-hero',
        h('h1', lesson.title),
        h('p.ls-en.ltr', lesson.titleEn),
        h('p.ls-meta', `${lesson.minutes} دقيقة · ${lesson.steps.length} خطوات · `, chip())),
      h('section.lsn-goals', h('h2', 'ستتعلم في هذا الدرس'), h('ul', lesson.objectives.map(o => h('li', o)))),
      h('section.lsn-toc',
        h('h2', 'محتويات الدرس'),
        h('ol', stages.map((st, i) => h('li', h('button.lsn-toc-row', { type: 'button', class: visited.has(st.key) ? 'is-seen' : '', onclick: () => show(i) },
          h('span.lsn-toc-n', visited.has(st.key) ? '✓' : String(i + 1)),
          h('span.lsn-toc-t', st.title),
          st.kind !== 'end' ? h('span.lsn-toc-k', KIND[st.kind]) : null))))),
      h('div.lsn-start',
        h('button.btn.btn--primary.lsn-go', { type: 'button', onclick: () => show(resume ? s.step : 0) }, resume ? `تابِع من الخطوة ${s.step + 1}` : 'ابدأ الدرس'),
        lesson.prerequisites.length ? h('p.ls-note', 'يفضَّل قبله: ', lesson.prerequisites.map(p => h('a', { href: lessonHref(p) }, p))) : h('p.ls-note', 'لا يحتاج إلى معرفة سابقة.')),
      videoButtons(lesson.videoQuery?.en, lesson.videoQuery?.ar, lesson.video)));
    window.scrollTo(0, 0);
  }

  // ——— شاشة خطوة ———
  function show(i) {
    const st = stages[i];
    visited.add(st.key);
    setSaved({ step: i, visited: [...visited] });
    history.replaceState(null, '', `${lessonHref(id)}?s=${st.key}`); // حتى يعيدك زر الرجوع إلى الخطوة نفسها

    const bar = h('div.lsn-bar',
      h('button.btn.btn--quiet.lsn-menu', { type: 'button', onclick: overview, 'aria-label': 'محتويات الدرس' }, '☰ المحتويات'),
      h('ol.lsn-progress', { 'aria-label': `الخطوة ${i + 1} من ${stages.length}` }, stages.map((x, j) => h('li', { class: j < i ? 'is-past' : j === i ? 'is-now' : '' }))),
      h('span.lsn-count.ltr', `${i + 1} / ${stages.length}`));

    const body = h('section.lsn-step', { 'aria-labelledby': 'lsn-title' });
    const prev = h('button.btn', { type: 'button', disabled: i === 0, onclick: () => show(i - 1) }, '→ السابق');
    const next = i < stages.length - 1
      ? h('button.btn.btn--primary', { type: 'button', onclick: () => show(i + 1) }, `التالي: ${stages[i + 1].title} ←`)
      : h('button.btn.btn--primary', { type: 'button', onclick: overview }, 'أنهِ الدرس');
    main.replaceChildren(h('div.lsn-wrap', bar, body, h('nav.lsn-nav', prev, next)));

    if (st.step) {
      const s = st.step;
      const fig = h('figure.lsn-visual');
      body.append(...[
        h('p.lsn-kind', KIND[s.kind], s.evidence ? h('span.ls-evidence', ' · قوة الدليل: ', s.evidence.map(evidenceName).join('، ')) : null),
        h('h2#lsn-title', s.title),
        fig,
        h('div.lsn-text', enhance(s.html)),
        s.check ? quickCheck(s.check) : null].filter(Boolean));
      if (s.visual) loadVisual(s.visual.id).then(mod => mod.mount(fig, s.visual.props || {}));
      else fig.remove();
    } else if (st.key === 'summary') {
      body.append(h('h2#lsn-title', 'الخلاصة'), h('ol.lsn-summary', lesson.summary.map(x => h('li', x))));
    } else if (st.key === 'cards') {
      body.append(h('h2#lsn-title', 'راجع بالبطاقات'), h('p', 'اقلب البطاقة، ثم قيّم تذكّرك، فتعود إليك في الوقت المناسب.'), flashDeck(lessonCards(lesson), { lesson: id }));
    } else if (st.key === 'quiz') {
      const box = h('div.ls-quiz');
      const start = h('button.btn.btn--primary', { type: 'button' }, `ابدأ الاختبار (${questions.length} أسئلة)`);
      start.addEventListener('click', () => runQuiz(box, questions, { scope: id, onCite: (c) => openRef(c), onFinish: (pct) => recordQuiz(id, pct) }));
      box.append(h('p', 'أسئلة متنوعة تغطي الدرس. تحتاج 70% ليكتمل.'), start);
      body.append(h('h2#lsn-title', 'اختبر نفسك'), box);
    } else if (st.key === 'refs') {
      body.append(h('h2#lsn-title', 'المراجع'),
        h('ol.ls-refs', [...refNums.entries()].map(([rid, n]) => { const r = getRef(rid); return r ? h('li', { value: n }, h('span.ltr.ls-apa', { html: r.apa }), h('button.cite-link', { type: 'button', onclick: () => openRef(rid, { number: n }) }, 'التفاصيل')) : null; })),
        h('nav.ls-pager',
          flat[pos - 1] ? h('a.btn', { href: lessonHref(flat[pos - 1].id) }, `→ ${flat[pos - 1].title}`) : h('span'),
          flat[pos + 1] ? h('a.btn', { href: lessonHref(flat[pos + 1].id) }, `${flat[pos + 1].title} ←`) : h('a.btn', { href: `#/${w.id}` }, 'العودة إلى الجناح')));
    }
    window.scrollTo(0, 0);
    body.querySelector('h2')?.focus?.();
  }

  // فحص سريع داخل الخطوة: سؤال واحد بإجابة فورية
  function quickCheck(c) {
    const fb = h('p.qc-fb', { 'aria-live': 'polite' });
    const opts = h('div.qc-opts', c.options.map(o => h('button.qc-opt', { type: 'button', 'data-id': o.id, onclick: (e) => {
      opts.querySelectorAll('button').forEach(b => { b.disabled = true; b.classList.toggle('is-right', b.dataset.id === c.correct); });
      if (o.id !== c.correct) e.currentTarget.classList.add('is-wrong');
      fb.textContent = `${o.id === c.correct ? 'صحيح. ' : 'ليس تمامًا. '}${c.explain}`;
    } }, o.text)));
    return h('aside.qc', h('p.qc-q', h('span.qc-tag', 'فحص سريع'), c.q), opts, fb);
  }

  // لوحة المفاتيح: الأسهم للتنقل بين الخطوات
  const onKey = (e) => {
    if (!document.body.contains(main)) return document.removeEventListener('keydown', onKey);
    if (e.target.closest('input, textarea, [data-drag]')) return;
    const nav = main.querySelector('.lsn-nav'); if (!nav) return;
    if (e.key === 'ArrowLeft') nav.lastElementChild?.click();
    if (e.key === 'ArrowRight') nav.firstElementChild?.click();
  };
  document.addEventListener('keydown', onKey);

  const want = new URLSearchParams(location.hash.split('?')[1] || '').get('s');
  const wantIdx = stages.findIndex(s => s.key === want);
  if (wantIdx >= 0) show(wantIdx); else overview();
}
