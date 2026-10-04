# يختبر الدرس بالخطوات: المحتويات، والخطوات ورسومها التفاعلية، والفحص السريع، والإحالة والرجوع إلى الخطوة نفسها،
# ولوحة المرجع، والاختبار بأنواعه العشرة، والبطاقات، والبحث، والمسرد، والمكتبة.
import sys, asyncio
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/shots'
SEED = "localStorage.setItem('qiwam.journey.completed', JSON.stringify({v:true,updatedAt:1})); localStorage.setItem('qiwam.journey.reached', JSON.stringify({v:12,updatedAt:1}));"

async def interact(pg, key):
    v = pg.locator('.lsn-visual')
    if key == 'atoms':
        for i in range(2): await v.locator('.mol-h').nth(i).dispatch_event('click')
    elif key == 'cell':
        for p in ['membrane', 'nucleus', 'mito', 'golgi']: await v.locator(f'g[data-part="{p}"]').first.dispatch_event('click')
        await pg.locator('.lsn-more summary').click()
    elif key == 'tissue':
        await v.locator('input[type=range]').fill('20')
    elif key == 'four':
        for i in range(4): await v.locator('.ft-card').nth(i).click()
    elif key == 'organ':
        await v.locator('[data-e="organ.liver"]').dispatch_event('click')
    elif key == 'count':
        await v.locator('.cc-tabs button').nth(1).click()
    elif key == 'percent':
        await v.locator('.fx-slider input').first.fill('20')
        assert '66.7' in await v.locator('.fx-result').inner_text(), 'formula result wrong'
        await v.locator('.cc-tabs button').nth(1).click()
        await v.locator('.fx-practice input').fill('50'); await v.locator('.fx-practice .btn--primary').click()
        await v.locator('.fx-pfb .qz-verdict').wait_for()
    elif key == 'recap':
        n = await pg.locator('.rc-dots li').count()
        for i in range(n):
            await pg.locator('.rc-reveal').click(); await pg.locator('.rc-ok' if i % 3 else '.rc-miss').click()
        await pg.locator('.rc-miss-list').wait_for()
        assert await pg.locator('.cm-node').count() >= 8, 'concept map missing'
    elif key == 'pulse':
        await v.locator('.pl .cite-link').click(); await v.locator('.pl-res').wait_for()
        assert '72' in await v.locator('.pl-res').inner_text(), 'pulse calc wrong'
        await v.locator('.pl-fx .fx-result').wait_for()
    elif key == 'sickle':
        await v.locator('.sk .cc-tabs button').nth(1).click()
        for i in range(5): await v.locator('.sk-step').nth(i).click()
        assert 'الإنسان' in await v.locator('.sk-cap').inner_text()
    if await pg.locator('.qc-opt').count():
        await pg.locator('.qc-opt').first.click()

async def answer(pg, t):
    q = pg.locator('.qz-q')
    if t in ('mcq', 'case', 'image'): await q.locator('.qz-opt').first.click()
    elif t == 'multi': await q.locator('.qz-opt').nth(0).click(); await q.locator('.qz-opt').nth(1).click()
    elif t == 'hotspot': await q.locator('[data-e="organ.heart"]').click()
    elif t == 'name-it': await q.locator('input').fill('الكبد')
    elif t == 'drag-label':
        for e in ['organ.lungs', 'organ.stomach', 'organ.kidneys']:
            await q.locator(f'.qz-chip[data-e="{e}"]').click(); await q.locator(f'path[data-e="{e}"]').first.dispatch_event('click')
    elif t == 'match':
        for l, r in {'cell': 'خلية دم حمراء واحدة', 'tissue': 'النسيج العضلي القلبي في جدار القلب', 'organ': 'المعدة', 'system': 'الجهاز الهضمي'}.items():
            await q.locator(f'.qz-m[data-side="l"][data-id="{l}"]').click(); await q.locator('.qz-m[data-side="r"]', has_text=r).click()
    elif t == 'tf-why':
        await q.locator('.qz-tf .qz-opt[data-id="false"]').click(); await q.locator('.qz-options .qz-opt[data-id="r2"]').click()
    elif t == 'calc': await q.locator('input').fill('72' if await q.get_attribute('data-qid') == 'q.levels.12' else '83')

async def run(name, opts):
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await (await b.new_context(**opts, locale='ar')).new_page()
        pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE); await pg.evaluate(SEED)
        await pg.goto(BASE + '#/body'); await pg.wait_for_selector('.wh-lesson')
        await pg.click('.wh-lesson'); await pg.wait_for_selector('.lsn-toc')
        await pg.screenshot(path=f'{OUT}/{name}-00-overview.png', full_page=True)
        await pg.click('.lsn-go')
        keys = []
        for i in range(20):
            await pg.wait_for_selector('.lsn-step'); await pg.wait_for_timeout(250)
            url = pg.url; key = url.split('?s=')[-1] if '?s=' in url else '?'
            keys.append(key)
            if key == 'quiz': break
            await interact(pg, key); await pg.wait_for_timeout(350)
            await pg.screenshot(path=f'{OUT}/{name}-{i+1:02d}-{key}.png', full_page=True)
            if key == 'pulse':
                await pg.locator('.refcard-go').click(); await pg.wait_for_selector('.entity-page')
                await pg.click('.back-btn'); await pg.wait_for_selector('.lsn-step'); await pg.wait_for_timeout(300)
                assert '?s=pulse' in pg.url, 'back did not return to step: ' + pg.url
            if key == 'ladder':
                await pg.locator('.lsn-text .cite').first.click(); await pg.wait_for_selector('.ref-panel.is-open'); await pg.click('.rp-close')
            await pg.locator('.lsn-nav .btn--primary').click()
        await pg.locator('.ls-quiz .btn--primary').click()
        types = []
        await pg.wait_for_selector('.qz-count'); n_q = int((await pg.locator('.qz-count').inner_text()).split()[-1])
        for i in range(n_q):
            await pg.wait_for_selector('.qz-q'); await pg.wait_for_timeout(120)
            t = await pg.locator('.qz-q').get_attribute('data-type'); types.append(t)
            await answer(pg, t); await pg.wait_for_timeout(100)
            await pg.click('.qz-action'); await pg.wait_for_selector('.qz-verdict', timeout=5000)
            await pg.click('.qz-action')
        await pg.wait_for_selector('.qz-result'); score = await pg.locator('.qz-score').inner_text()
        await pg.locator('.lsn-nav .btn--primary').click(); await pg.wait_for_selector('.ls-refs')
        await pg.screenshot(path=f'{OUT}/{name}-refs.png', full_page=True)
        await pg.locator('.lsn-nav .btn--primary').click(); await pg.wait_for_selector('.lsn-toc')
        await pg.goto(BASE + '#/body'); await pg.wait_for_selector('.wh-review'); await pg.click('.wh-review')
        await pg.wait_for_selector('.lvr-lesson'); await pg.locator('.lvr-recall summary').first.click()
        await pg.screenshot(path=f'{OUT}/{name}-level-review.png', full_page=True)
        await pg.locator('.lvr-test .btn--primary').click(); await pg.wait_for_selector('.qz-q')
        for path, sel in [('#/search?q=الكبد', '.search-group'), ('#/glossary', '.gl-item'), ('#/library', '.lib-item'), ('#/review', 'main.page'), ('#/map', '.sci')]:
            await pg.goto(BASE + path); await pg.wait_for_selector(sel)
        await b.close()
    print(name, 'steps:', keys, '| types:', len(set(types)), '| score:', score, '| errors:', errs or 'none')

DEV = {'ipad': dict(viewport={'width': 820, 'height': 1180}, is_mobile=True, has_touch=True),
       'phone': dict(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True),
       'laptop': dict(viewport={'width': 1366, 'height': 860})}
async def main():
    for n in (sys.argv[3].split(',') if len(sys.argv) > 3 else DEV): await run(n, DEV[n])
asyncio.run(main())
