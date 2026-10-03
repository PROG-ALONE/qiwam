// الإقلاع: الثيم، والمسارات، والحارس (المدخل إجباري أول مرة).

import { route, setGuard, start } from './router.js';
import { applyTheme } from './theme.js';
import { journeyState, SCENES } from '../journey/journey.js';

applyTheme();

const WINGS = ['body', 'story', 'anatomy', 'movement', 'rehab', 'football', 'nutrition'];

route('#/', async () => ({ render() {} }));
route('#/journey', async () => import('../journey/journey.js'));
route('#/journey/:n', async () => import('../journey/journey.js'));
route('#/bridge', async () => import('../journey/bridge.js'));
route('#/map', async () => import('../journey/map.js'));
route('#/settings', async () => import('./settings.js'));
route('#/:wing', async () => import('./wing-soon.js'));

setGuard((path) => {
  const st = journeyState();
  const seg = path.split('/')[1] || '';

  if (path === '#/' || path === '#' || path === '') {
    return st.completed ? '#/map' : `#/journey/${st.reached}`;
  }
  if (seg === 'journey' && !path.split('/')[2]) return `#/journey/${st.completed ? 1 : st.reached}`;
  if (seg === 'journey' || seg === 'settings') return null;
  // الجسر بعد ما يوصل الزائر لآخر مشهد
  if (seg === 'bridge') return st.completed || st.reached >= SCENES ? null : `#/journey/${st.reached}`;
  // كل شي ثاني مقفول لحد ما يكمل المدخل
  if (!st.completed) return `#/journey/${st.reached}`;
  if (seg !== 'map' && !WINGS.includes(seg)) return '#/map';
  return null;
});

start();

// Service Worker (العمل بدون إنترنت يكتمل بالمرحلة A3)
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
