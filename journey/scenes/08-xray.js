import { h } from '../../core/ui/dom.js';

// الأشعة: الزائر يمسح بإصبعه فتنكشف الصورة. التسميات على الصورة نفسها (توضيحية).
export default {
  title: 'الأشعة',
  date: '3 آب 2026',
  tone: 'night',
  questions: ['q.xray'],
  mount(stage, { done }) {
    const img = h('img.j-xray-img', {
      src: 'media/xray/xray-both-annotated.jpg',
      alt: 'أشعة جانبية للركبتين بتاريخ 3 آب 2026. الركبة اليسرى المصابة، ودائرة على منطقة منشأ الوتر الرضفي، والركبة اليمنى للمقارنة.',
      width: 1600, height: 1266, decoding: 'async',
    });
    const canvas = h('canvas.j-xray-cover', { 'data-drag': '', 'aria-hidden': 'true' });
    const frame = h('div.j-xray', img, canvas);
    const hint = h('p.j-hint', 'امسح الصورة بإصبعك');
    const showAll = h('button.btn.btn--quiet.j-xray-all', { type: 'button' }, 'اكشف الصورة كاملة');

    stage.append(
      h('div.j-text.j-text--wide',
        h('p.j-line', 'صوّرتُ الأشعة. الركبتان جنبًا إلى جنب.')),
      h('figure.j-xray-fig', frame,
        h('figcaption',
          h('span', 'أشعة جانبية للركبتين. اليسرى هي المصابة.'),
          h('span.j-disclaimer', 'التسميات توضيحية، والتشخيص من اختصاص المعالج.'))),
      h('div.j-row', hint, showAll));

    const ctx = canvas.getContext('2d');
    let w = 0, hgt = 0, finished = false, strokes = 0;

    const paint = () => {
      const r = frame.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.width = Math.round(r.width * dpr);
      hgt = canvas.height = Math.round(r.height * dpr);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#121d28';
      ctx.fillRect(0, 0, w, hgt);
      // فيلم أشعة معتم مع إشارة خفيفة بالوسط
      ctx.strokeStyle = 'rgba(233,184,114,.18)'; ctx.lineWidth = 2 * dpr; ctx.setLineDash([6 * dpr, 10 * dpr]);
      ctx.strokeRect(14 * dpr, 14 * dpr, w - 28 * dpr, hgt - 28 * dpr);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(233,184,114,.55)';
      ctx.font = `${Math.round(18 * dpr)}px "Plex Arabic", sans-serif`;
      ctx.textAlign = 'center'; ctx.direction = 'rtl';
      ctx.fillText('امسح هنا', w / 2, hgt / 2);
      ctx.globalCompositeOperation = 'destination-out';
    };
    const ready = () => requestAnimationFrame(paint);
    if (img.complete) ready(); else img.addEventListener('load', ready, { once: true });

    let drawing = false, last = null;
    const pos = (e) => {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) * (w / r.width), y: (e.clientY - r.top) * (hgt / r.height) };
    };
    const brush = () => Math.max(28, w * 0.07);
    canvas.addEventListener('pointerdown', e => { drawing = true; canvas.setPointerCapture(e.pointerId); last = pos(e); scratch(last); });
    canvas.addEventListener('pointermove', e => {
      if (!drawing) return;
      const p = pos(e);
      ctx.lineCap = 'round'; ctx.lineWidth = brush() * 2;
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      last = p;
      if (++strokes % 12 === 0) check();
    });
    canvas.addEventListener('pointerup', () => { drawing = false; check(); });
    function scratch(p) { ctx.beginPath(); ctx.arc(p.x, p.y, brush(), 0, Math.PI * 2); ctx.fill(); }

    function check() {
      if (finished || !w) return;
      const data = ctx.getImageData(0, 0, w, hgt).data;
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 4 * 64) { total++; if (data[i] < 40) clear++; }
      if (clear / total > 0.5) finish();
    }
    function finish() {
      if (finished) return;
      finished = true;
      canvas.classList.add('is-gone');
      hint.hidden = true; showAll.hidden = true;
      done();
    }
    showAll.addEventListener('click', finish);
    return { finish };
  },
};
