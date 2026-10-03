// مكدس الرجوع: حين تنقلك إحالة إلى جناح آخر، يعيدك زر "رجوع" إلى المكان نفسه.
import { h } from './ui/dom.js';
import { go, currentPath } from './router.js';

const stack = [];

export function pushReturn(label) {
  stack.push({ path: location.hash || '#/', label: label || document.title.split(' — ')[0] });
  if (stack.length > 20) stack.shift();
}

/** زر رجوع يظهر فقط إن وُجد مكان سابق */
export function backButton() {
  if (!stack.length) return null;
  const top = stack[stack.length - 1];
  const b = h('button.btn.btn--quiet.back-btn', { type: 'button' }, `→ رجوع إلى: ${top.label}`);
  b.addEventListener('click', () => { stack.pop(); go(top.path); });
  return b;
}

/** رابط داخلي يحفظ مكان الرجوع قبل الانتقال */
export function linkWithReturn(href, ...children) {
  const a = h('a', { href }, ...children);
  a.addEventListener('click', () => pushReturn());
  return a;
}

export { currentPath };
