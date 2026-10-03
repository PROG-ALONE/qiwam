// التحقق من المراجع: يطابق كل مرجع له DOI مع Crossref (العنوان، والسنة، والمجلة، والمؤلف الأول)،
// ويجلب PMID/PMCID من خدمة تحويل المعرّفات في NCBI، ويتأكد من حالة الوصول المفتوح عبر Unpaywall.
// يعمل على جهازك (يحتاج إنترنت). ولا يُنشر الموقع إلا والنتيجة صفر أخطاء.
//
//   node tools/verify-refs.mjs                 ← فحص كامل
//   QIWAM_EMAIL=you@mail.com node tools/verify-refs.mjs   ← مع Unpaywall (يتطلب بريدًا)
//   node tools/verify-refs.mjs --offline       ← فحص البنية فقط بلا إنترنت
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { impAll, ROOT, reporter } from './lib.mjs';

const { REFS } = await impAll('content/refs/index.js');
const R = reporter('التحقق من المراجع');
const offline = process.argv.includes('--offline');
const EMAIL = process.env.QIWAM_EMAIL;
const norm = (s = '') => s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const lines = ['# تقرير التحقق من المراجع', '', `التاريخ: ${new Date().toISOString().slice(0, 10)}`, ''];

async function json(url) {
  const r = await fetch(url, { headers: { 'User-Agent': `qiwam-verify/1.0 (mailto:${EMAIL || 'unknown'})` } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

for (const [id, r] of Object.entries(REFS)) {
  for (const k of ['apa', 'type', 'evidence', 'access', 'verified']) if (!r[k]) R.error(`${id}: الحقل ${k} مفقود`);
  if (r.pdf && r.access !== 'open') R.error(`${id}: PDF مرفق لمرجع غير مفتوح الوصول`);
  if (r.pdf && !/^CC BY|public domain|ملكية عامة/i.test(r.license || '')) R.error(`${id}: ترخيص لا يسمح بإعادة النشر: ${r.license}`);
  if (offline) continue;

  if (r.doi) {
    try {
      const m = (await json(`https://api.crossref.org/works/${encodeURIComponent(r.doi)}`)).message;
      const title = m.title?.[0] || '', year = m.issued?.['date-parts']?.[0]?.[0], first = m.author?.[0]?.family || '';
      const apa = norm(r.apa);
      const ok = { title: apa.includes(norm(title).slice(0, 40)), year: r.apa.includes(`(${year})`), author: apa.startsWith(norm(first)) };
      for (const [k, v] of Object.entries(ok)) if (!v) R.error(`${id}: لا يطابق Crossref في ${k} (Crossref: ${k === 'title' ? title : k === 'year' ? year : first})`);
      lines.push(`- ${id}: Crossref ${Object.values(ok).every(Boolean) ? '✓' : '✗'} — ${title} (${year})`);
    } catch (e) { R.error(`${id}: تعذّر الوصول إلى Crossref (${e.message})`); }

    try {
      const rec = (await json(`https://www.ncbi.nlm.nih.gov/pmc/utils/idconv/v1.0/?ids=${encodeURIComponent(r.doi)}&format=json&tool=qiwam`)).records?.[0];
      if (rec?.pmid && rec.pmid !== r.pmid) R.warn(`${id}: PMID حسب NCBI هو ${rec.pmid}${r.pmid ? ` (المسجّل ${r.pmid})` : ' — أضفه إلى السجل'}`);
      if (rec?.pmcid && rec.pmcid !== r.pmcid) R.warn(`${id}: PMCID حسب NCBI هو ${rec.pmcid} — أضفه إلى السجل`);
    } catch (e) { R.warn(`${id}: تعذّر الوصول إلى NCBI (${e.message})`); }

    if (EMAIL) {
      try {
        const u = await json(`https://api.unpaywall.org/v2/${encodeURIComponent(r.doi)}?email=${encodeURIComponent(EMAIL)}`);
        const lic = u.best_oa_location?.license;
        if (r.access === 'open' && !u.is_oa) R.error(`${id}: مسجّل مفتوح الوصول، وUnpaywall يقول إنه غير مفتوح`);
        if (lic && r.license && !norm(r.license).replace(/ /g, '-').includes(lic.replace('cc-', 'cc-'))) R.warn(`${id}: ترخيص Unpaywall «${lic}» والمسجّل «${r.license}»`);
      } catch (e) { R.warn(`${id}: تعذّر الوصول إلى Unpaywall (${e.message})`); }
    }
  } else if (r.url) {
    try { const res = await fetch(r.url, { method: 'HEAD', redirect: 'follow' }); if (!res.ok) R.error(`${id}: الرابط لا يعمل (HTTP ${res.status})`); else lines.push(`- ${id}: الرابط يعمل ✓`); }
    catch (e) { R.error(`${id}: تعذّر فتح الرابط (${e.message})`); }
  }
}
const out = R.done();
lines.push('', `الأخطاء: ${out.errors.length}`, ...out.errors.map(e => `- ❌ ${e}`), `التحذيرات: ${out.warnings.length}`, ...out.warnings.map(w => `- ⚠️ ${w}`));
await writeFile(path.join(ROOT, 'tools/reports/refs-report.md'), lines.join('\n'));
