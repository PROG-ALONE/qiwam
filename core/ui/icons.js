// رموز الأجنحة: خطوط بسيطة 24×24 بلون الجناح.
import { s } from './dom.js';

const PATHS = {
  story:     'M5 20c3-1 4-4 4-8V5M9 12c3 0 6 1 7 4l1 4M4 20h16',                     // ركبة بخط واحد
  anatomy:   'M7 4c-2 0-3 2-2 3l3 3-3 3c-1 1 0 3 2 3M17 20c2 0 3-2 2-3l-3-3 3-3c1-1 0-3-2-3M8 10l8 4', // عظمة
  movement:  'M6 18a8 8 0 0 1 12-10M12 18l-4-8M12 18h7M16 6l2 2-2 2',                // مفصل وقوس حركة
  rehab:     'M3 17l5-5 4 3 8-8M15 7h5v5',                                           // خط تعافي صاعد
  football:  'M4 6h16v12H4zM12 6v12M12 12m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0',  // ملعب
  nutrition: 'M12 21V9M12 9c-3 0-5-2-5-5 3 0 5 2 5 5zM12 13c3 0 5-2 5-5-3 0-5 2-5 5zM12 17c-3 0-5-2-5-5 3 0 5 2 5 5z', // سنبلة
  qiwam:     'M12 7v11M7 18h10M12 3.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3',
};

export function wingIcon(id, size = 24) {
  return s('svg', { viewBox: '0 0 24 24', width: size, height: size, class: 'wing-icon', 'aria-hidden': 'true' },
    s('path', { d: PATHS[id] || PATHS.qiwam }));
}
