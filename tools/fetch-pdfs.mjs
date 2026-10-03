// تنزيل ملفات PDF المسموح بإرفاقها فقط (وصول مفتوح + ترخيص يسمح بإعادة النشر)، وتوثيقها في refs/LICENSES.md.
// node tools/fetch-pdfs.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { impAll, ROOT } from './lib.mjs';

const { REFS } = await impAll('content/refs/index.js');
await mkdir(path.join(ROOT, 'refs/pdf'), { recursive: true });
const rows = ['# تراخيص ملفات PDF المرفقة', '', '| الملف | المرجع | الترخيص | المصدر |', '|---|---|---|---|'];
for (const [id, r] of Object.entries(REFS)) {
  if (!r.pdf || !r.pdfSource) continue;
  if (r.access !== 'open' || !/^CC BY/.test(r.license || '')) { console.log(`⏭️  ${id}: لا يُرفق (الترخيص: ${r.license})`); continue; }
  const dest = path.join(ROOT, r.pdf);
  if (!existsSync(dest)) {
    const res = await fetch(r.pdfSource, { redirect: 'follow' });
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !type.includes('pdf')) { console.log(`❌ ${id}: فشل التنزيل (HTTP ${res.status}, ${type})`); continue; }
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    console.log(`✅ ${id}: نُزّل إلى ${r.pdf}`);
  } else console.log(`✓ ${id}: موجود`);
  rows.push(`| \`${r.pdf}\` | ${r.short || id} | ${r.license} | ${r.doi ? `https://doi.org/${r.doi}` : r.url} |`);
}
await writeFile(path.join(ROOT, 'refs/LICENSES.md'), rows.join('\n') + '\n');
console.log('حُدّث refs/LICENSES.md');
