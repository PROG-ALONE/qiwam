// محرك الاختبار: سؤال تلو سؤال، تحقق، شرح الجواب الصحيح والخاطئ، ثم النتيجة.
// الأسئلة تُبدَّل عشوائيًا في كل محاولة، والأخطاء تذهب إلى المراجعة المتباعدة.

import { h } from '../ui/dom.js';
import { TYPES, TYPE_NAMES, shuffle } from './types.js';
import * as store from '../store.js';
import { addMistake } from '../srs.js';

export function runQuiz(container, questions, { scope, title = 'اختبار الدرس', onFinish, onCite } = {}) {
  const order = shuffle(questions);
  let i = 0, score = 0;
  const results = [];
  const wrap = h('section.qz', { 'aria-label': title });
  container.replaceChildren(wrap);

  const head = h('div.qz-head');
  const body = h('div.qz-body');
  const feedback = h('div.qz-feedback', { 'aria-live': 'polite' });
  const action = h('button.btn.btn--primary.qz-action', { type: 'button', disabled: true }, 'تحقق');
  wrap.append(head, body, feedback, h('div.qz-actions', action));

  let current = null, checked = false;

  async function show() {
    const q = order[i];
    checked = false;
    feedback.replaceChildren();
    head.replaceChildren(
      h('span.qz-count', `السؤال ${i + 1} من ${order.length}`),
      h('span.qz-type', TYPE_NAMES[q.type] || q.type),
      h('span.qz-diff', { title: 'الصعوبة' }, '●'.repeat(q.difficulty || 1)));
    body.replaceChildren();
    const el = h('div.qz-q', { 'data-type': q.type, 'data-qid': q.id });
    body.append(el);
    if (q.type !== 'tf-why') el.append(h('p.qz-stem', q.stem));
    current = await TYPES[q.type](q, el);
    action.textContent = 'تحقق';
    action.disabled = true;
    const poll = () => { if (!checked && document.body.contains(el)) { action.disabled = !current.ready(); requestAnimationFrame(poll); } };
    poll();
    el.querySelector('input, button, [tabindex]')?.focus({ preventScroll: true });
  }

  function check() {
    const q = order[i];
    const r = current.check();
    current.lock();
    checked = true;
    if (r.correct) score++;
    else addMistake(q.id, { lesson: scope });
    results.push({ id: q.id, correct: r.correct });
    const why = r.correct ? q.explain?.correct : (q.explain?.wrong?.[r.key] || q.explain?.wrong?.default);
    feedback.replaceChildren(...[
      h('p.qz-verdict', { class: r.correct ? 'is-right' : 'is-wrong' }, r.correct ? 'إجابة صحيحة.' : 'ليست صحيحة.'),
      why ? h('p.qz-why', why) : null,
      !r.correct && q.explain?.correct ? h('p.qz-why.qz-why--right', h('strong', 'الصواب: '), q.explain.correct) : null,
      q.refs?.length ? h('p.qz-refs', 'المرجع: ', q.refs.map((ref, k) => [k ? '، ' : '', h('button.cite-link', { type: 'button', onclick: () => onCite?.(ref) }, 'افتح')])) : null].filter(Boolean));
    action.textContent = i < order.length - 1 ? 'السؤال التالي' : 'النتيجة';
    action.disabled = false;
    action.focus({ preventScroll: true });
  }

  function finish() {
    const pct = score / order.length;
    const attempt = { scope, at: Date.now(), score, total: order.length, results };
    store.update('quiz', 'attempts', a => [...a.slice(-199), attempt], []);
    head.replaceChildren(h('span.qz-count', 'النتيجة'));
    body.replaceChildren(h('div.qz-result',
      h('p.qz-score', h('span.ltr', `${score} / ${order.length}`)),
      h('p', pct >= 0.7 ? 'أحسنت. اجتزت الاختبار، واكتمل الدرس.' : 'لم تبلغ 70% بعد. الأسئلة التي أخطأت فيها أضيفت إلى المراجعة، وتستطيع الإعادة الآن.')));
    feedback.replaceChildren();
    action.textContent = 'أعد الاختبار';
    action.disabled = false;
    onFinish?.(pct, attempt);
  }

  action.addEventListener('click', () => {
    if (action.textContent === 'أعد الاختبار') return runQuiz(container, questions, { scope, title, onFinish, onCite });
    if (!checked) return check();
    if (i < order.length - 1) { i++; show(); } else finish();
  });

  show();
}
