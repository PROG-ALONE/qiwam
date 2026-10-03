import { h } from './ui/dom.js';
import { header } from './ui/header.js';
import * as store from './store.js';
import { applyTheme } from './theme.js';
import { go } from './router.js';

export function render(root) {
  const theme = store.get('prefs', 'theme', 'auto');
  const opts = [['auto', 'حسب الجهاز'], ['light', 'فاتح'], ['dark', 'داكن']];
  const group = h('div.seg', { role: 'radiogroup', 'aria-label': 'المظهر' },
    opts.map(([v, label]) => {
      const b = h('button.seg-btn', { type: 'button', role: 'radio', 'aria-checked': String(v === theme) }, label);
      b.addEventListener('click', () => {
        store.set('prefs', 'theme', v); applyTheme();
        group.querySelectorAll('.seg-btn').forEach(x => x.setAttribute('aria-checked', String(x === b)));
      });
      return b;
    }));

  // مسح البيانات: ضغطتين بدل نافذة تأكيد
  const wipe = h('button.btn', { type: 'button' }, 'امسح تقدّمي من هذا الجهاز');
  let armed = false;
  wipe.addEventListener('click', () => {
    if (!armed) { armed = true; wipe.textContent = 'اضغط مرة أخرى للتأكيد'; wipe.classList.add('is-danger'); setTimeout(() => { armed = false; wipe.textContent = 'امسح تقدّمي من هذا الجهاز'; wipe.classList.remove('is-danger'); }, 4000); return; }
    store.clearAll(); applyTheme(); go('#/journey/1');
  });

  root.append(header(), h('main.page',
    h('h1', 'الإعدادات'),
    h('section.panel', h('h2', 'المظهر'), group),
    h('section.panel', h('h2', 'القصة'), h('p', 'يمكنك إعادة المدخل في أي وقت، وتبقى الخريطة مفتوحة.'), h('a.btn', { href: '#/journey/1' }, 'أعد القصة')),
    h('section.panel', h('h2', 'البيانات'), h('p', 'تقدّمك محفوظ على هذا الجهاز فقط. التصدير والاستيراد في مرحلة لاحقة.'), wipe),
    h('section.panel.about', h('h2', 'عن قِوام'),
      h('p', 'منصة لتعلّم علوم جسم الإنسان بالعربية، لكل من يريد أن يستثمر وقته في علم نافع. المحتوى تعليمي، ولا يغني عن الطبيب أو المعالج الطبيعي.'))));
}
