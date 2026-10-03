import test from 'node:test';
import assert from 'node:assert/strict';
globalThis.localStorage = { _: {}, getItem(k) { return this._[k] ?? null; }, setItem(k, v) { this._[k] = v; }, removeItem(k) { delete this._[k]; } };
const { review, getCards, dueCards } = await import('../../core/srs.js');

test('SM-2: فترات 1 ثم 6 أيام للإجابات الجيدة، ثم تعود إلى يوم عند النسيان', () => {
  review('x', 5); assert.equal(getCards().x.interval, 1);
  review('x', 5); assert.equal(getCards().x.interval, 6);
  review('x', 1); assert.equal(getCards().x.interval, 1);
  assert.ok(getCards().x.ef >= 1.3);
});
test('البطاقة غير المستحقة لا تظهر في المراجعة', () => {
  review('y', 5);
  assert.ok(!dueCards().some(c => c.id === 'y'));
  assert.ok(dueCards(Date.now() + 2 * 864e5).some(c => c.id === 'y'));
});
