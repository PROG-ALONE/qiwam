// اللوحة الجانبية للمرجع: صيغة APA، ونوع الدليل، والموضع، وأزرار الفتح والنسخ.
import { h } from '../ui/dom.js';
import { getRef, parseCite, evidenceName, plainApa, pdfAvailable } from './registry.js';

let panel = null;
const arDate = (iso) => { try { return new Date(iso).toLocaleDateString('ar-IQ-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }); } catch { return iso; } };

export async function openRef(cite, { number } = {}) {
  const { id, loc } = parseCite(cite);
  const r = getRef(id);
  if (!r) return;
  closeRef();
  const where = loc && r.cites?.[loc];
  const copy = h('button.btn', { type: 'button' }, 'نسخ المرجع');
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(plainApa(r)); copy.textContent = 'نُسخ المرجع'; } catch { copy.textContent = 'تعذّر النسخ'; }
  });
  const actions = h('div.rp-actions', copy);
  if (r.doi) actions.append(h('a.btn', { href: `https://doi.org/${r.doi}`, target: '_blank', rel: 'noopener' }, 'رابط DOI'));
  if (r.pmid) actions.append(h('a.btn', { href: `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`, target: '_blank', rel: 'noopener' }, 'PubMed'));
  if (where?.url) actions.prepend(h('a.btn.btn--primary', { href: where.url, target: '_blank', rel: 'noopener' }, 'افتح القسم'));
  else if (!r.doi && r.url) actions.prepend(h('a.btn.btn--primary', { href: r.url, target: '_blank', rel: 'noopener' }, 'افتح المصدر'));
  pdfAvailable(r.pdf).then(ok => {
    if (!ok) return;
    const page = where?.page ? `&page=${where.page}` : '';
    actions.prepend(h('a.btn.btn--primary', { href: `#/pdf?file=${encodeURIComponent(r.pdf)}${page}&title=${encodeURIComponent(r.short || id)}` }, 'افتح PDF'));
  });

  panel = h('aside.ref-panel', { role: 'dialog', 'aria-modal': 'false', 'aria-label': 'المرجع' },
    h('div.rp-head', h('h2', number ? `المرجع [${number}]` : 'المرجع'), h('button.rp-close', { type: 'button', 'aria-label': 'إغلاق', onclick: closeRef }, '✕')),
    h('p.rp-apa.ltr', { html: r.apa }),
    h('dl.rp-meta',
      h('dt', 'نوع الدليل'), h('dd', evidenceName(r.evidence)),
      where ? [h('dt', 'الموضع'), h('dd.ltr', where.title)] : null,
      h('dt', 'الوصول'), h('dd', r.access === 'open' ? `مفتوح${r.license ? ` (${r.license})` : ''}` : 'محمي (رابط فقط)'),
      h('dt', 'التحقق'), h('dd', r.verified?.status === 'ok' ? `متحقق منه في ${arDate(r.verified.date)}` : 'بانتظار التحقق')),
    actions,
    h('a.rp-lib', { href: '#/library' }, 'كل المراجع في المكتبة'));
  document.body.append(panel);
  requestAnimationFrame(() => panel.classList.add('is-open'));
  panel.querySelector('.rp-close').focus();
  document.addEventListener('keydown', escClose);
}

function escClose(e) { if (e.key === 'Escape') closeRef(); }
export function closeRef() {
  document.removeEventListener('keydown', escClose);
  panel?.remove(); panel = null;
}
window.addEventListener('hashchange', closeRef);
