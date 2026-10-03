// تقدّم المتعلّم في الدروس، وآخر درس، وربط الدروس بالأسئلة المعلقة من القصة.
import * as store from './store.js';
import questions from '../content/journey/questions.js';
import { answer } from '../journey/journey.js';

export const lessonState = (id) => store.get('lesson', id, { status: 'new', best: null, scroll: 0 });

export function markVisited(lesson, href) {
  store.update('lesson', lesson.id, s => ({ ...s, status: s.status === 'new' ? 'started' : s.status, seenAt: Date.now() }), { status: 'new', best: null });
  store.set('progress', 'lastLesson', { id: lesson.id, title: lesson.title, href });
}

export function recordQuiz(lessonId, score) {
  return store.update('lesson', lessonId, s => {
    const best = Math.max(score, s.best ?? 0);
    const status = best >= 0.7 ? 'done' : s.status === 'new' ? 'started' : s.status;
    if (status === 'done') onComplete(lessonId);
    return { ...s, best, status };
  }, { status: 'new', best: null });
}

export function markDone(lessonId) {
  store.update('lesson', lessonId, s => ({ ...s, status: 'done' }), { status: 'new', best: null });
  onComplete(lessonId);
}

function onComplete(lessonId) {
  for (const [qid, q] of Object.entries(questions)) if (q.answeredBy.includes(lessonId)) answer(qid);
}
