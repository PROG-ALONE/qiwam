// أدوات مشتركة لسكربتات الفحص: قراءة كل الدروس والأسئلة من مجلد المحتوى.
import { readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const imp = async (rel) => (await import(pathToFileURL(path.join(ROOT, rel)).href)).default;
export const impAll = async (rel) => import(pathToFileURL(path.join(ROOT, rel)).href);

export async function allLessons() {
  const out = [];
  for (const wing of await readdir(path.join(ROOT, 'content'), { withFileTypes: true })) {
    if (!wing.isDirectory()) continue;
    const dir = path.join(ROOT, 'content', wing.name, 'lessons');
    if (!existsSync(dir)) continue;
    for (const f of await readdir(dir)) if (f.endsWith('.js')) out.push({ file: `content/${wing.name}/lessons/${f}`, lesson: await imp(`content/${wing.name}/lessons/${f}`) });
  }
  return out;
}

export async function questionsFor(id) {
  const rel = `content/${id.split('.')[0]}/questions/${id}.js`;
  return existsSync(path.join(ROOT, rel)) ? { file: rel, questions: await imp(rel) } : null;
}

export const cites = (html) => [...html.matchAll(/<cite r="([^"]+)"\s*\/?>/g)].map(m => m[1]);
export const ents = (html) => [...html.matchAll(/<e id="([^"]+)">/g)].map(m => m[1]);
export const refcards = (html) => [...html.matchAll(/<ref-card entity="([^"]+)">/g)].map(m => m[1]);
export const words = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;

export function reporter(name) {
  const errors = [], warnings = [];
  return {
    error: (m) => errors.push(m), warn: (m) => warnings.push(m),
    done() {
      warnings.forEach(w => console.log(`⚠️  ${w}`));
      errors.forEach(e => console.log(`❌ ${e}`));
      console.log(`${name}: ${errors.length} خطأ، ${warnings.length} تحذير`);
      process.exitCode = errors.length ? 1 : 0;
      return { errors, warnings };
    },
  };
}
