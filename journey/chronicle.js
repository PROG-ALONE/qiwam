// سرد على مراحل: بطاقات تظهر واحدة تلو الأخرى بزر واحد يتغير اسمه.
import { h } from '../core/ui/dom.js';

/**
 * chronicle(container, steps, onDone)
 * steps: [{ label: 'نص الزر الذي يكشف هذه البطاقة', node: عنصر }]
 */
export function chronicle(container, steps, onDone) {
  const list = h('div.j-chron');
  const btn = h('button.btn.j-chron-next', { type: 'button' }, steps[0].label);
  container.append(list, h('div.j-row', btn));
  let i = 0;
  const reveal = () => {
    if (i >= steps.length) return;
    const node = steps[i].node;
    node.classList.add('j-chron-item');
    list.append(node);
    i++;
    if (i < steps.length) btn.textContent = steps[i].label;
    else { btn.hidden = true; onDone(); }
    requestAnimationFrame(() => node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  };
  btn.addEventListener('click', reveal);
  return { revealAll: () => { while (i < steps.length) reveal(); } };
}

/** بطاقة طبيب: العنوان، وما حدث، والجملة التي قالها، وما غاب. */
export function doctorCard({ who, when, body, quote, missing, extra }) {
  return h('article.j-doc',
    h('header.j-doc-head', h('h2.j-doc-who', who), when ? h('span.j-doc-when', when) : null),
    body.map(p => h('p.j-doc-body', p)),
    quote ? h('blockquote.j-doc-quote', `«${quote}»`) : null,
    extra || null,
    missing ? h('p.j-doc-missing', h('strong', 'ما غاب: '), missing) : null);
}
