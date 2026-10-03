// مشغّل رسم متحرك موحّد: تشغيل وإيقاف، وإعادة، وسرعة 0.5× و1× و2×، وشريط سحب.
// يبدأ موقوفًا دائمًا (ويبقى كذلك مع prefers-reduced-motion حتى يشغّله المتعلم).
import { h } from '../ui/dom.js';

export function animPlayer({ duration = 4000, onFrame, loop = false, label = 'رسم متحرك' }) {
  let t = 0, speed = 1, playing = false, last = 0, raf = 0;

  const playBtn = h('button.ap-btn', { type: 'button', 'aria-label': 'تشغيل' }, '▶');
  const restart = h('button.ap-btn', { type: 'button', 'aria-label': 'إعادة' }, '↺');
  const scrub = h('input.ap-scrub', { type: 'range', min: 0, max: 1000, value: 0, 'aria-label': `${label}: الموضع`, 'data-drag': '' });
  const speeds = h('div.ap-speeds', { role: 'radiogroup', 'aria-label': 'السرعة' },
    [0.5, 1, 2].map(v => {
      const b = h('button.ap-speed', { type: 'button', role: 'radio', 'aria-checked': String(v === 1), 'aria-label': `السرعة ${v}` }, h('bdi', { dir: 'ltr' }, `${v}×`));
      b.addEventListener('click', () => { speed = v; speeds.querySelectorAll('.ap-speed').forEach(x => x.setAttribute('aria-checked', String(x === b))); });
      return b;
    }));

  const el = h('div.ap', { role: 'group', 'aria-label': label }, playBtn, restart, h('span.ap-track', scrub), speeds);

  const render = () => { scrub.value = Math.round(t * 1000); onFrame?.(t); };
  const tick = (now) => {
    if (!playing) return;
    const dt = now - last; last = now;
    t += (dt / duration) * speed;
    if (t >= 1) { if (loop) t = 0; else { t = 1; pause(); } }
    render();
    if (playing) raf = requestAnimationFrame(tick);
  };
  function play() { if (t >= 1) t = 0; playing = true; last = performance.now(); playBtn.textContent = '❚❚'; playBtn.setAttribute('aria-label', 'إيقاف'); raf = requestAnimationFrame(tick); }
  function pause() { playing = false; cancelAnimationFrame(raf); playBtn.textContent = '▶'; playBtn.setAttribute('aria-label', 'تشغيل'); }
  function seek(v) { t = Math.max(0, Math.min(1, v)); render(); }

  playBtn.addEventListener('click', () => (playing ? pause() : play()));
  restart.addEventListener('click', () => { seek(0); if (!playing) play(); });
  scrub.addEventListener('input', () => { pause(); seek(+scrub.value / 1000); });
  render();
  return { el, play, pause, seek, get t() { return t; } };
}
