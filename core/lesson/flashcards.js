// بطاقات المراجعة: تتولّد من مسرد الدرس ومن البطاقات المكتوبة فيه، وتدخل التكرار المتباعد.
import { h } from '../ui/dom.js';
import glossary from '../../content/glossary.js';
import { review } from '../srs.js';

export function lessonCards(lesson) {
  const g = (lesson.glossary || []).map(id => glossary.find(x => x.id === id)).filter(Boolean)
    .map(t => ({ id: `fc:${lesson.id}:g:${t.id}`, front: t.ar, back: `${t.en}${t.la ? ` · ${t.la}` : ''}\n${t.def}` }));
  const x = (lesson.flashcards || []).map((c, i) => ({ id: `fc:${lesson.id}:${i}`, front: c.front, back: c.back }));
  return [...x, ...g];
}

export function flashDeck(cards, { lesson } = {}) {
  let i = 0, flipped = false;
  const face = h('button.fc-card', { type: 'button', 'aria-live': 'polite' });
  const count = h('span.fc-count');
  const rate = h('div.fc-rate', { hidden: true },
    [['صعبة', 2], ['جيدة', 4], ['سهلة', 5]].map(([t, q]) => h('button.btn', { type: 'button', onclick: () => { const c = cards[i]; review(c.id, q, { kind: 'card', front: c.front, back: c.back, lesson }); next(); } }, t)));
  const draw = () => {
    const c = cards[i];
    face.classList.toggle('is-flipped', flipped);
    face.replaceChildren(h('span.fc-side', flipped ? c.back : c.front), h('span.fc-hint', flipped ? '' : 'اضغط لترى الجواب'));
    count.textContent = `${i + 1} / ${cards.length}`;
    rate.hidden = !flipped;
  };
  const next = () => { i = (i + 1) % cards.length; flipped = false; draw(); };
  face.addEventListener('click', () => { flipped = !flipped; draw(); });
  draw();
  return h('div.fc', face, h('div.fc-bar', count, rate));
}
