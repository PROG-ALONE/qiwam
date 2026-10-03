// زر "شاهد شرح فيديو": بحث يوتيوب بالمصطلح الإنكليزي الدقيق، وزر ثانٍ للبحث العربي.
// إن وُجد رابط فيديو محدد، يظهر أولًا مع اسم القناة.
import { h } from './dom.js';

export function videoButtons(en, ar, video) {
  const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  return h('div.video-btns',
    video ? h('a.btn.btn--primary', { href: video.url, target: '_blank', rel: 'noopener' }, `شاهد: ${video.title} (${video.channel})`) : null,
    en ? h('a.btn', { href: yt(en), target: '_blank', rel: 'noopener' }, 'شرح فيديو بالإنكليزية') : null,
    ar ? h('a.btn', { href: yt(ar), target: '_blank', rel: 'noopener' }, 'شرح فيديو بالعربية') : null);
}
