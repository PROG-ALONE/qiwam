# يمشي على المدخل كامل ويصور كل مشهد، ويجمع أخطاء الـ Console.
import sys, asyncio
from playwright.async_api import async_playwright
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
OUT = sys.argv[2] if len(sys.argv) > 2 else '/tmp/claude-0/shots'
DEVICES = {'ipad': dict(viewport={'width': 820, 'height': 1180}, device_scale_factor=1, is_mobile=True, has_touch=True),
           'phone': dict(viewport={'width': 390, 'height': 844}, device_scale_factor=1, is_mobile=True, has_touch=True),
           'laptop': dict(viewport={'width': 1366, 'height': 860})}
async def run(name, opts, scheme):
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch()
        ctx = await b.new_context(**opts, color_scheme=scheme, locale='ar')
        pg = await ctx.new_page()
        pg.on('console', lambda m: m.type == 'error' and errs.append(m.text))
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto(BASE); await pg.wait_for_timeout(900)
        assert '#/journey/1' in pg.url, pg.url
        # الخريطة مقفولة
        await pg.goto(BASE + '#/map'); await pg.wait_for_timeout(400)
        assert '#/journey/1' in pg.url, 'map not locked: ' + pg.url
        for n in range(1, 13):
            await pg.wait_for_selector(f'.journey[data-scene="{n}"]')
            await pg.wait_for_timeout(700)
            await pg.screenshot(path=f'{OUT}/{name}-{scheme}-{n:02d}a.png')
            if await pg.locator('.j-skip').is_visible():
                await pg.click('.j-skip')
            await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'{OUT}/{name}-{scheme}-{n:02d}b.png')
            await pg.click('.j-next')
        await pg.wait_for_selector('.bridge'); await pg.wait_for_timeout(500)
        await pg.screenshot(path=f'{OUT}/{name}-{scheme}-11-bridge.png', full_page=True)
        await pg.click('.bridge-go'); await pg.wait_for_selector('.map'); await pg.wait_for_timeout(600)
        await pg.screenshot(path=f'{OUT}/{name}-{scheme}-12-map.png', full_page=True)
        await pg.click('a.sci[href="#/body"]')
        await pg.wait_for_selector('.wing-soon'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=f'{OUT}/{name}-{scheme}-13-wing.png', full_page=True)
        # زائر راجع يفتح على الخريطة
        await pg.goto(BASE); await pg.wait_for_timeout(600)
        assert '#/map' in pg.url, 'returning visitor: ' + pg.url
        await b.close()
    print(name, scheme, 'errors:', errs or 'none')
async def main():
    which = sys.argv[3].split(',') if len(sys.argv) > 3 else ['ipad', 'phone', 'laptop']
    for n in which:
        for sch in (['dark', 'light'] if n == 'ipad' else ['dark']):
            await run(n, DEVICES[n], sch)
asyncio.run(main())
