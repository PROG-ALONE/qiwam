import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, fuzzyMatch, levenshtein } from '../../core/text/arabic.js';

test('تطبيع العربي يحذف التشكيل ويوحّد الألف والتاء المربوطة', () => {
  assert.equal(normalize('الكَبِدُ'), 'الكبد');
  assert.equal(normalize('أإآ'), 'ااا');
  assert.equal(normalize('رئة'), 'ريه');
});
test('المطابقة المتسامحة تقبل العربي والإنكليزي واللاتيني وخطأ إملائيًا بسيطًا', () => {
  const acc = ['الكبد', 'Liver', 'Hepar'];
  for (const x of ['كبد', 'الكبد', 'liver', 'LIVER', 'hepar', 'الكبت']) assert.ok(fuzzyMatch(x, acc), x);
  for (const x of ['المعدة', 'heart', '']) assert.ok(!fuzzyMatch(x, acc), x);
});
test('مسافة التحرير', () => { assert.equal(levenshtein('kitten', 'sitting'), 3); });
