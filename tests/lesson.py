# يختبر محركات المرحلة A2: الجناح، والدرس، والإحالة والرجوع، واللوحة الجانبية، والبحث، والمسرد، والمكتبة، والاختبار بأنواعه.
import sys, asyncio, json
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/shots'
SEED = "localStorage.setItem('qiwam.journey.completed', JSON.stringify({v:true,updatedAt:1})); localStorage.setItem('qiwam.journey.reached', JSON.stringify({v:12,updatedAt:1}));"

async def answer(pg, qtype):
    q = pg.locator('.qz-q')
    if qtype in ('mcq', 'case', 'image'):
        await q.locator('.qz-opt').first.click()
    elif qtype == 'multi':
        await q.locator('.qz-opt').nth(0).click(); await q.locator('.qz-opt').nth(1).click()
    elif qtype == 'hotspot':
        await q.locator('[data-e="organ.heart"]').click()
    elif qtype == 'name-it':
        await q.locator('input').fill('الكبد')
    elif qtype == 'drag-label':
        for e in ['organ.lungs', 'organ.stomach', 'organ.kidneys']:
            await q.locator(f'.qz-chip[data-e="{e}"]').click()
            await q.locator(f'path[data-e="{e}"]').first.dispatch_event('click')
    elif qtype == 'match':
        pairs = {'cell': 'خلية دم حمراء واحدة', 'tissue': 'النسيج الضام الكثيف المنتظم في الوتر', 'organ': 'المعدة', 'system': 'الجهاز الهضمي'}
        for l, r in pairs.items():
            await q.locator(f'.qz-m[data-side="l"][data-id="{l}"]').click()
            await q.locator('.qz-m[data-side="r"]', has_text=r).click()
    elif qtype == 'order':
        pass  # يكتفي بالترتيب الحالي (قد يكون خطأ)، المهم أن المحرك يعمل
    elif qtype == 'tf-why':
        await q.locator('.qz-tf .qz-opt[data-id="false"]').click()
        await q.locator('.qz-options .qz-opt[data-id="r2"]').click()
    elif qtype == 'calc':
        await q.locator('input').fill('83')

async def run(name, opts):
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(**opts, locale='ar')
        pg = await ctx.new_page()
        pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE); await pg.evaluate(SEED)
        await pg.goto(BASE + '#/body'); await pg.wait_for_selector('.wh-lesson')
        await pg.screenshot(path=f'{OUT}/{name}-wing.png', full_page=True)
        await pg.click('.wh-lesson'); await pg.wait_for_selector('.ls-article .ls-block#refs')
        await pg.wait_for_selector('.lz-step'); await pg.wait_for_selector('.organ-map')
        await pg.screenshot(path=f'{OUT}/{name}-lesson.png', full_page=True)
        # المرجع
        await pg.locator('.cite').first.click(); await pg.wait_for_selector('.ref-panel.is-open')
        await pg.screenshot(path=f'{OUT}/{name}-refpanel.png')
        await pg.click('.rp-close')
        # الإحالة والرجوع
        await pg.locator('.refcard-go').first.scroll_into_view_if_needed()
        y0 = await pg.evaluate('scrollY')
        await pg.locator('.refcard-go').first.click(); await pg.wait_for_selector('.entity-page')
        await pg.screenshot(path=f'{OUT}/{name}-entity.png', full_page=True)
        await pg.click('.back-btn'); await pg.wait_for_selector('.ls-article'); await pg.wait_for_timeout(500)
        y1 = await pg.evaluate('scrollY')
        print(name, 'scroll restore', y0, y1)
        # الاختبار
        await pg.locator('#quiz button.btn--primary').click()
        types = []
        for i in range(11):
            await pg.wait_for_selector('.qz-q'); await pg.wait_for_timeout(150)
            t = await pg.locator('.qz-q').get_attribute('data-type'); types.append(t)
            await answer(pg, t)
            await pg.wait_for_timeout(120)
            if t in ('hotspot', 'drag-label', 'name-it') and i < 3:
                await pg.screenshot(path=f'{OUT}/{name}-q-{t}.png')
            if await pg.locator('.qz-action').is_disabled():
                await pg.screenshot(path=f'{OUT}/{name}-STUCK-{t}.png'); print('STUCK on', t, errs); break
            await pg.click('.qz-action')  # تحقق
            try: await pg.wait_for_selector('.qz-verdict', timeout=4000)
            except Exception:
                await pg.screenshot(path=f'{OUT}/{name}-NOVERDICT-{t}.png'); print('NO VERDICT on', t, errs); raise
            if t in ('match', 'tf-why'): await pg.screenshot(path=f'{OUT}/{name}-q-{t}.png')
            await pg.click('.qz-action')  # التالي/النتيجة
        await pg.wait_for_selector('.qz-result')
        score = await pg.locator('.qz-score').inner_text()
        await pg.screenshot(path=f'{OUT}/{name}-result.png')
        # البطاقات
        await pg.locator('.fc-card').click(); await pg.locator('.fc-rate button').first.click()
        # البحث والمسرد والمكتبة
        await pg.goto(BASE + '#/search?q=الكبد'); await pg.wait_for_selector('.search-group')
        await pg.screenshot(path=f'{OUT}/{name}-search.png', full_page=True)
        await pg.goto(BASE + '#/glossary'); await pg.wait_for_selector('.gl-item')
        await pg.goto(BASE + '#/library'); await pg.wait_for_selector('.lib-item')
        await pg.screenshot(path=f'{OUT}/{name}-library.png', full_page=True)
        await pg.goto(BASE + '#/review'); await pg.wait_for_selector('main.page')
        await pg.goto(BASE + '#/map'); await pg.wait_for_selector('.sci')
        await b.close()
    print(name, 'types:', sorted(set(types)), 'score:', score, 'errors:', errs or 'none')

DEV = {'ipad': dict(viewport={'width': 820, 'height': 1180}, is_mobile=True, has_touch=True),
       'phone': dict(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True),
       'laptop': dict(viewport={'width': 1366, 'height': 860})}
async def main():
    for n in (sys.argv[3].split(',') if len(sys.argv) > 3 else DEV):
        await run(n, DEV[n])
asyncio.run(main())
