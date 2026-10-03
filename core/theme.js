import * as store from './store.js';

export function applyTheme() {
  const t = store.get('prefs', 'theme', 'auto');
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}
