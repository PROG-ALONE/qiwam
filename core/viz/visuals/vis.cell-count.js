// كم خلية فيك؟ مقارنة بين الرقم القديم الشائع (10 إلى 1) والتقدير الحديث (Sender وآخرون، 2016).
import { h } from '../../ui/dom.js';

export default {
  mount(el) {
    const MAX = 38; // للتحجيم: أكبر عمود في التقدير الحديث
    const bar = (cls, label) => { const fill = h(`span.cc-fill.${cls}`); const val = h('span.cc-val.ltr'); return { row: h('div.cc-row', h('span.cc-name', label), h('span.cc-bar', fill), val), fill, val }; };
    const human = bar('is-human', 'خلايا بشرية');
    const rbc = h('span.cc-rbc', { title: 'منها خلايا الدم الحمراء' });
    human.fill.append(rbc);
    const bact = bar('is-bact', 'بكتيريا');
    const note = h('p.cc-note', { 'aria-live': 'polite' });
    const modes = {
      old: { human: 30, bact: 300, text: 'الرقم القديم الشائع: البكتيريا عشرة أضعاف خلاياك. العمود لا يتسع له!' },
      new: { human: 30, bact: 38, text: 'التقدير الحديث: نحو 30 تريليون خلية بشرية (منها نحو 25 تريليونًا خلايا دم حمراء)، ونحو 38 تريليون بكتيريا.' },
    };
    const set = (m) => {
      const d = modes[m];
      human.fill.style.width = `${Math.min(100, (d.human / MAX) * 100)}%`;
      bact.fill.style.width = `${Math.min(100, (d.bact / MAX) * 100)}%`;
      bact.fill.classList.toggle('is-overflow', d.bact > MAX);
      rbc.style.width = `${(25 / 30) * 100}%`;
      human.val.textContent = `${d.human}×10¹² `;
      bact.val.textContent = `${d.bact}×10¹²`;
      note.textContent = d.text;
      tabs.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === m)));
    };
    const tabs = h('div.cc-tabs', [['old', 'الرقم القديم'], ['new', 'التقدير الحديث (2016)']].map(([m, t]) => h('button.btn', { type: 'button', 'data-m': m, onclick: () => set(m) }, t)));
    el.append(h('div.cc', tabs, human.row, bact.row, h('p.cc-legend', h('span.cc-key'), ' الجزء الداكن من خلاياك: خلايا الدم الحمراء'), note));
    set('old');
  },
};
