import { h } from './dom.js';
import { wingIcon } from './icons.js';

export function header({ wing } = {}) {
  return h('header.site-header', { style: wing ? { '--c': wing.color } : null },
    h('a.brand', { href: '#/map', 'aria-label': 'قِوام: الخريطة' },
      h('span.brand-mark', wingIcon('qiwam', 22)),
      h('span.brand-name', 'قِوام')),
    wing ? h('span.brand-wing', wingIcon(wing.id, 20), wing.name) : null,
    h('nav.site-nav',
      h('a.btn.btn--quiet', { href: '#/map' }, 'الخريطة'),
      h('a.btn.btn--quiet', { href: '#/settings' }, 'الإعدادات')));
}
