// عارض PDF داخلي (pdf.js محلي): يفتح الملف على الصفحة المحددة.
import { h } from '../ui/dom.js';
import { header } from '../ui/header.js';
import { backButton } from '../nav.js';

export async function render(root) {
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  const file = params.get('file');
  let page = Math.max(1, parseInt(params.get('page') || '1', 10));
  const title = params.get('title') || 'ملف PDF';
  const canvas = h('canvas.pdf-canvas');
  const status = h('p.pdf-status', 'جارٍ تحميل الملف…');
  const prev = h('button.btn', { type: 'button' }, 'الصفحة السابقة');
  const next = h('button.btn', { type: 'button' }, 'الصفحة التالية');
  const info = h('span.pdf-info.ltr');
  root.append(header(), h('main.page.page--wide.pdf-page', backButton(), h('h1', title), h('div.pdf-bar', prev, info, next), status, h('div.pdf-wrap', canvas)));
  if (!file || !/^refs\/pdf\/[\w.-]+\.pdf$/.test(file)) { status.textContent = 'الملف غير صالح.'; return; }

  const pdfjs = await import('../../vendor/pdfjs/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('../../vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
  let doc;
  try { doc = await pdfjs.getDocument(file).promise; }
  catch { status.textContent = 'لم يُعثر على الملف. شغّل tools/fetch-pdfs.mjs على جهازك لتنزيل الملفات المفتوحة، أو افتح المرجع برابط DOI.'; return; }
  status.remove();
  page = Math.min(page, doc.numPages);
  async function draw() {
    const p = await doc.getPage(page);
    const width = Math.min(root.clientWidth - 32, 900);
    const vp0 = p.getViewport({ scale: 1 });
    const scale = width / vp0.width;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const vp = p.getViewport({ scale: scale * dpr });
    canvas.width = vp.width; canvas.height = vp.height;
    canvas.style.width = `${vp.width / dpr}px`;
    await p.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
    info.textContent = `${page} / ${doc.numPages}`;
    prev.disabled = page <= 1; next.disabled = page >= doc.numPages;
  }
  prev.addEventListener('click', () => { page--; draw(); });
  next.addEventListener('click', () => { page++; draw(); });
  draw();
}
