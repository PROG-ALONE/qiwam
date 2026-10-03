// المراجعة المتباعدة: البطاقات المستحقة اليوم، والأسئلة التي أخطأت فيها.
import { h } from './ui/dom.js';
import { header } from './ui/header.js';
import { dueCards } from './srs.js';
import { flashDeck } from './lesson/flashcards.js';
import { lessonHref } from './content.js';

export function render(root) {
  const due = dueCards();
  const cards = due.filter(c => c.kind === 'card');
  const mistakes = due.filter(c => c.kind === 'question');
  const lessons = [...new Set(mistakes.map(m => m.lesson).filter(Boolean))];
  root.append(header(), h('main.page',
    h('h1', 'المراجعة'),
    cards.length ? [h('h2', `بطاقات مستحقة اليوم (${cards.length})`), flashDeck(cards.map(c => ({ id: c.id, front: c.front, back: c.back })))] : h('p.empty', 'لا بطاقات مستحقة الآن. ادرس درسًا جديدًا، أو عد غدًا.'),
    mistakes.length ? h('section.panel', h('h2', `أسئلة أخطأت فيها (${mistakes.length})`), h('p', 'أعد اختبار الدروس التالية:'), h('ul', lessons.map(l => h('li', h('a', { href: `${lessonHref(l)}?s=quiz` }, l))))) : null));
}
