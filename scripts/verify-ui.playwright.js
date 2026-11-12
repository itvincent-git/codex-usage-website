// Run against `pnpm preview` with:
// playwright-cli open http://127.0.0.1:4322
// playwright-cli run-code --filename scripts/verify-ui.playwright.js
async (page) => {
  const origin = page.url().split('/').slice(0, 3).join('/');
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  assert(await page.evaluate(() => !document.querySelector('script[src*="/@vite/client"]')), 'Run against the production preview, not the development server');
  const locales = [
    ['', 'Close menu', 'Skip to main content'],
    ['/zh', '关闭菜单', '跳到主要内容'],
    ['/zh-tw', '關閉選單', '跳至主要內容'],
    ['/ja', 'メニューを閉じる', 'メインコンテンツへ移動'],
    ['/ko', '메뉴 닫기', '본문으로 바로가기'],
    ['/de', 'Menü schließen', 'Zum Hauptinhalt springen'],
  ];
  const go = async (prefix = '', section = '') => {
    await page.goto(`${origin}${prefix}/${section}`, { waitUntil: 'domcontentloaded' });
    await page.locator('.header-controls:not(.header-fallback)').waitFor();
  };
  const contrast = async (selector, surfaceSelector) => page.locator(selector).first().evaluate((el, surface) => {
    const channels = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number).map((n) => {
      n /= 255;
      return n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4;
    });
    const luminance = (color) => channels(color).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
    const fg = luminance(getComputedStyle(el).color);
    const bg = luminance(getComputedStyle(document.querySelector(surface)).backgroundColor);
    return (Math.max(fg, bg) + .05) / (Math.min(fg, bg) + .05);
  }, surfaceSelector);
  const ratios = [];

  await page.setViewportSize({ width: 1440, height: 1000 });
  await go('/zh');
  const nav = page.locator('.feature-nav');
  const trigger = nav.locator('summary');
  const bounds = await nav.boundingBox();
  await page.mouse.move(bounds.x + 15, bounds.y + bounds.height / 2);
  for (let y = bounds.y + bounds.height / 2; y <= bounds.y + bounds.height + 25; y += 1) {
    await page.mouse.move(bounds.x + 15, y);
  }
  assert(await nav.locator('details').getAttribute('open') !== null, 'Slow hover closed feature disclosure');
  await page.keyboard.press('Escape');
  assert(await nav.locator('details').getAttribute('open') === null, 'Escape did not close hover disclosure');
  assert(await trigger.evaluate((el) => el === document.activeElement), 'Feature focus was lost');
  await page.mouse.move(1400, 800);
  await trigger.press('Enter');
  await page.keyboard.press('Tab');
  assert(await nav.locator('.feature-nav-popover a').first().evaluate((el) => el === document.activeElement), 'Feature links are not tabbable');
  await page.keyboard.press('Escape');
  await nav.locator('a').first().hover();
  const itemBox = await nav.locator('.feature-nav-popover a').first().boundingBox();
  const start = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  for (let step = 0; step <= 40; step++) {
    await page.mouse.move(start.x + (itemBox.x + itemBox.width / 2 - start.x) * step / 40, start.y + (itemBox.y + itemBox.height / 2 - start.y) * step / 40);
  }
  assert(await nav.locator('details').getAttribute('open') !== null, 'Diagonal hover closed feature disclosure');
  await nav.locator('.feature-nav-popover a').first().click();
  assert(page.url().slice(origin.length) === '/zh/usage-tracking/', 'Feature link did not navigate');

  for (const [prefix, closeLabel, skipLabel] of locales) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await go(prefix, 'docs/quota/');
    await page.locator('.language-trigger').click();
    for (const [target] of locales) {
      assert(await page.locator(`.language-menu a[href="${target}/docs/quota/"]`).isVisible(), `Language equivalent: ${prefix} → ${target}`);
    }
    const target = prefix === '/ko' ? '/de' : '/ko';
    await page.locator(`.language-menu a[href="${target}/docs/quota/"]`).click();
    assert(page.url().slice(origin.length) === `${target}/docs/quota/`, 'Language switch did not preserve guide');
    await go(prefix, 'docs/getting-started/');
    await page.keyboard.press('Tab');
    assert(await page.locator('.skip-link').evaluate((el) => el === document.activeElement), 'Skip link was not first');
    assert(await page.locator('.skip-link').textContent() === skipLabel, 'Skip link is not localized');
    await page.keyboard.press('Enter');
    assert(await page.locator('article#main-content').evaluate((el) => el === document.activeElement), 'Skip did not focus article');
    await page.keyboard.press('Tab');
    assert(await page.locator('article').evaluate((el) => el.contains(document.activeElement)), 'Tab did not continue in article');

    for (const colorScheme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme });
      for (const width of [375, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await go(prefix, 'session-analysis/');
        for (const [selector, min] of [['.session-detail-section h2', 3], ['.session-detail-section .section-heading p', 4.5], ['.session-detail-section > .wrap > .visual-note', 4.5]]) {
          const ratio = await contrast(selector, '.session-detail-section');
          assert(ratio >= min, `${selector} contrast ${ratio} in ${colorScheme}`);
          if (!prefix && width === 1440) ratios.push({ selector, colorScheme, ratio: ratio.toFixed(2) });
        }
      }
      await go(prefix, 'docs/');
      for (const state of ['normal', 'hover', 'focus']) {
        const card = page.locator('.doc-card').first();
        if (state === 'hover') await card.hover();
        if (state === 'focus') await card.focus();
        assert(await contrast('.doc-card span', '.doc-card') >= 4.5, `Doc card contrast: ${state}/${colorScheme}`);
      }
      assert(await contrast('.footer-bottom', '.site-footer') >= 4.5, 'Footer contrast');
      await go(prefix, 'docs/getting-started/');
      assert(await contrast('.docs-sidebar h2', 'body') >= 4.5, 'Sidebar heading contrast');
    }

    for (const size of [{ width: 667, height: 320 }, { width: 375, height: 812 }]) {
      await page.setViewportSize(size);
      await go(prefix);
      assert(await page.locator('.hero .demo-chart').isHidden(), 'Mobile hero did not prioritize key metrics');
      assert(await page.locator('.hero .demo-summary > em').evaluate((el) => parseFloat(getComputedStyle(el).fontSize)) >= 16, 'Mobile token total is too small');
      for (const selector of ['.language-trigger', '.mobile-trigger']) {
        const box = await page.locator(selector).boundingBox();
        assert(box.width >= 44 && box.height >= 44, `${selector} touch target`);
      }
      await page.locator('.mobile-trigger').click();
      const close = page.getByRole('button', { name: closeLabel, exact: true });
      const closeBox = await close.boundingBox();
      assert(closeBox.width >= 44 && closeBox.height >= 44, 'Close touch target');
      assert(await page.locator('body').evaluate((el) => getComputedStyle(el).overflow === 'hidden'), 'Background is not locked');
      await page.locator('.mobile-download').focus();
      const downloadBox = await page.locator('.mobile-download').boundingBox();
      assert(downloadBox.y >= 0 && downloadBox.y + downloadBox.height <= size.height, 'Download is clipped after focus scroll');
      await page.keyboard.press('Escape');
      assert(await page.locator('.mobile-panel').count() === 0, 'Mobile Escape did not close');
      assert(await page.locator('.mobile-trigger').evaluate((el) => el === document.activeElement), 'Mobile focus did not return');
    }
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await go();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior) === 'auto', 'Reduced-motion scroll');
  for (const selector of ['.hero-actions .button', '.feature-card']) {
    const el = page.locator(selector).first();
    await el.hover();
    const style = await el.evaluate((el) => { const s = getComputedStyle(el); return { transition: s.transitionDuration, transform: s.transform, translate: s.translate }; });
    assert(style.transition === '0s' && style.transform === 'none' && style.translate === 'none', `Reduced-motion hover: ${selector}`);
  }
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  assert(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior) === 'smooth', 'Normal smooth scrolling changed');

  const browser = page.context().browser();
  const mac = await browser.newContext({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/130.0 Safari/537.36', viewport: { width: 1440, height: 1000 } });
  const macPage = await mac.newPage();
  for (const section of ['', 'session-analysis/']) {
    await macPage.goto(`${origin}/zh/${section}`, { waitUntil: 'domcontentloaded' });
    const widget = macPage.locator('[data-download-widget]').first();
    const button = widget.locator('button');
    await button.waitFor();
    assert((await button.textContent()).includes('macOS'), 'Mac CTA platform label');
    for (const key of ['Enter', 'Space']) {
      await button.press(key);
      assert(await button.getAttribute('aria-expanded') === 'true', `${key} did not open Mac options`);
      assert(await button.getAttribute('aria-controls') === await widget.locator('.mac-choices').getAttribute('id'), 'Mac disclosure association');
      await macPage.keyboard.press('Tab');
      assert(await widget.locator('.mac-choices a').first().evaluate((el) => el === document.activeElement), 'Mac links are not tabbable');
      await macPage.keyboard.press('Escape');
      assert(await button.getAttribute('aria-expanded') === 'false' && await button.evaluate((el) => el === document.activeElement), 'Mac Escape/focus');
    }
    await button.click();
    await macPage.locator('main h1').first().click();
    assert(await button.getAttribute('aria-expanded') === 'false', 'Mac outside click');
    await button.press('Enter');
    await macPage.keyboard.press('Tab');
    await macPage.keyboard.press('Tab');
    await macPage.keyboard.press('Tab');
    assert(await button.getAttribute('aria-expanded') === 'false', 'Mac tab-out left popover open');
  }
  await mac.close();

  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });
  const fallback = await noJS.newPage();
  for (const [prefix] of locales) {
    await fallback.goto(`${origin}${prefix}/docs/quota/`, { waitUntil: 'domcontentloaded' });
    await fallback.locator('.fallback-mobile summary').click();
    for (const suffix of ['/#features', '/docs/', '/download/']) {
      const link = fallback.locator(`.fallback-mobile a[href="${prefix}${suffix}"]`);
      assert(await link.isVisible(), `No-JS mobile link: ${prefix}${suffix}`);
    }
    await fallback.locator(`.fallback-mobile a[href="${prefix}/download/"]`).click();
    assert(fallback.url().slice(origin.length) === `${prefix}/download/`, 'No-JS mobile navigation');
    await fallback.goto(`${origin}${prefix}/docs/quota/`, { waitUntil: 'domcontentloaded' });
    await fallback.locator('.fallback-language summary').click();
    for (const [target] of locales) assert(await fallback.locator(`.fallback-language a[href="${target}/docs/quota/"]`).isVisible(), 'No-JS language equivalent');
    const target = prefix === '/ja' ? '/zh' : '/ja';
    await fallback.locator(`.fallback-language a[href="${target}/docs/quota/"]`).click();
    assert(fallback.url().slice(origin.length) === `${target}/docs/quota/`, 'No-JS language navigation');
    await fallback.goto(`${origin}${prefix}/`, { waitUntil: 'domcontentloaded' });
    assert(await fallback.locator('[data-primary-download]').first().getAttribute('href') === `${prefix}/download/`, 'No-JS download fallback');
  }
  await noJS.close();
  // Check every language at the shared layout breakpoints.
  for (const [prefix] of locales) {
    for (const width of [375, 700, 701, 768, 900, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const section of ['', 'download/', 'docs/', 'docs/getting-started/', 'session-analysis/', 'cost-analysis/']) {
        await go(prefix, section);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow: ${prefix}/${section} at ${width}`);
        assert(await page.locator('.site-header').evaluate((header) => [...header.querySelectorAll('a, button, summary')].every((el) => {
          const rect = el.getBoundingClientRect();
          return !rect.width || !el.getClientRects().length || (rect.left >= 0 && rect.right <= innerWidth);
        })), `Clipped header control: ${prefix}/${section} at ${width}`);
      }
    }
  }

  return { passed: `${locales.length * 6 * 6} layouts; six-language switching, contrast, skip links and mobile dialogs; desktop disclosure; reduced motion; Mac downloads; no-JS navigation`, ratios };
}
