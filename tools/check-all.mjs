// كل الفحوصات قبل النشر. node tools/check-all.mjs [--offline]
import { spawnSync } from 'node:child_process';
const off = process.argv.includes('--offline');
const steps = [
  ['فحص المحتوى', ['tools/lint-content.mjs']],
  ['فحص الملكية', ['tools/lint-ownership.mjs']],
  ['التحقق من المراجع', ['tools/verify-refs.mjs', ...(off ? ['--offline'] : [])]],
  ['اختبارات الوحدة', ['--test', 'tests/unit/*.test.mjs']],
];
let failed = 0;
for (const [name, args] of steps) {
  console.log(`\n══ ${name} ══`);
  const r = spawnSync(process.execPath, args, { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}
console.log(failed ? `\n❌ فشلت ${failed} خطوة. لا تنشر.` : '\n✅ كل الفحوصات نجحت.');
process.exit(failed ? 1 : 0);
