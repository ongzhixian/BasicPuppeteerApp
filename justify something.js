const puppeteer = require('puppeteer'); // v13.0.0 or later

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const timeout = 5000;
    page.setDefaultTimeout(timeout);

    async function waitForSelectors(selectors, frame, options) {
      for (const selector of selectors) {
        try {
          return await waitForSelector(selector, frame, options);
        } catch (err) {
          console.error(err);
        }
      }
      throw new Error('Could not find element for selectors: ' + JSON.stringify(selectors));
    }

    async function scrollIntoViewIfNeeded(element, timeout) {
      await waitForConnected(element, timeout);
      const isInViewport = await element.isIntersectingViewport({threshold: 0});
      if (isInViewport) {
        return;
      }
      await element.evaluate(element => {
        element.scrollIntoView({
          block: 'center',
          inline: 'center',
          behavior: 'auto',
        });
      });
      await waitForInViewport(element, timeout);
    }

    async function waitForConnected(element, timeout) {
      await waitForFunction(async () => {
        return await element.getProperty('isConnected');
      }, timeout);
    }

    async function waitForInViewport(element, timeout) {
      await waitForFunction(async () => {
        return await element.isIntersectingViewport({threshold: 0});
      }, timeout);
    }

    async function waitForSelector(selector, frame, options) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to waitForSelector');
      }
      let element = null;
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (element) {
          element = await element.waitForSelector(part, options);
        } else {
          element = await frame.waitForSelector(part, options);
        }
        if (!element) {
          throw new Error('Could not find element: ' + selector.join('>>'));
        }
        if (i < selector.length - 1) {
          element = (await element.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
        }
      }
      if (!element) {
        throw new Error('Could not find element: ' + selector.join('|'));
      }
      return element;
    }

    async function waitForElement(step, frame, timeout) {
      const count = step.count || 1;
      const operator = step.operator || '>=';
      const comp = {
        '==': (a, b) => a === b,
        '>=': (a, b) => a >= b,
        '<=': (a, b) => a <= b,
      };
      const compFn = comp[operator];
      await waitForFunction(async () => {
        const elements = await querySelectorsAll(step.selectors, frame);
        return compFn(elements.length, count);
      }, timeout);
    }

    async function querySelectorsAll(selectors, frame) {
      for (const selector of selectors) {
        const result = await querySelectorAll(selector, frame);
        if (result.length) {
          return result;
        }
      }
      return [];
    }

    async function querySelectorAll(selector, frame) {
      if (!Array.isArray(selector)) {
        selector = [selector];
      }
      if (!selector.length) {
        throw new Error('Empty selector provided to querySelectorAll');
      }
      let elements = [];
      for (let i = 0; i < selector.length; i++) {
        const part = selector[i];
        if (i === 0) {
          elements = await frame.$$(part);
        } else {
          const tmpElements = elements;
          elements = [];
          for (const el of tmpElements) {
            elements.push(...(await el.$$(part)));
          }
        }
        if (elements.length === 0) {
          return [];
        }
        if (i < selector.length - 1) {
          const tmpElements = [];
          for (const el of elements) {
            const newEl = (await el.evaluateHandle(el => el.shadowRoot ? el.shadowRoot : el)).asElement();
            if (newEl) {
              tmpElements.push(newEl);
            }
          }
          elements = tmpElements;
        }
      }
      return elements;
    }

    async function waitForFunction(fn, timeout) {
      let isActive = true;
      setTimeout(() => {
        isActive = false;
      }, timeout);
      while (isActive) {
        const result = await fn();
        if (result) {
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      throw new Error('Timed out');
    }
    {
        const targetPage = page;
        await targetPage.setViewport({"width":1903,"height":1068})
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto("https://www.google.com/search?q=test+query&source=hp&ei=Y1GpYrCFFcPfz7sP8MmJqAE&iflsig=AJiK0e8AAAAAYqlfcxqUfkwGAPAk0EyWtVHyI2BX1m5N&ved=0ahUKEwjwwoixwa74AhXD73MBHfBkAhUQ4dUDCAk&uact=5&oq=test+query&gs_lcp=Cgdnd3Mtd2l6EAMyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDIFCAAQgAQyBQgAEIAEOg4IABCPARDqAhCMAxDlAjoOCC4QjwEQ6gIQjAMQ5QI6CwgAEIAEELEDEIMBOg4ILhCABBCxAxCDARDUAjoRCC4QgAQQsQMQgwEQxwEQ0QM6EQguEIAEELEDEIMBEMcBEKMCOggILhCxAxCDAToICAAQsQMQgwE6BQgAELEDOggIABCABBCxA1D5F1ilSWCMTmgBcAB4AIABowGIAfIDkgEDOS4xmAEAoAEBsAEK&sclient=gws-wiz");
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("Alt");
    }
    {
        const targetPage = page;
        await targetPage.keyboard.down("d");
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        await targetPage.goto("https://localhost/BJB.IAP.ClientBook/web/");
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const promises = [];
        promises.push(targetPage.waitForNavigation());
        const element = await waitForSelectors([["aria/LOCAL LOGIN"],["[data-testid=local-login]"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 74, y: 10.21875} });
        await Promise.all(promises);
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-select-value-1 > span > mat-select-trigger > span"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 144.109375, y: 8.5} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-option-69 > span > span"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 108.109375, y: 6.5} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/(Undisclosed) 9900.0168 15,050,500 CHF 10,000,000 CHF 3 4 16.05.2022 –","aria/15,050,500 CHF"],["body > iap-root > iap-layout > ng-component > div > ng-component > div.master-view > iap-client-list > iap-datatable > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(3)"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 20.46875, y: 21.3125} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["body > iap-root > iap-layout > ng-component > div > ng-component > div.detail-view > ng-component > div > ng-component > div > iap-portfolio-list > iap-portfolio-list-item > iap-portfolio-list-item-details > iap-notification-groups > iap-expansion-panel > div > i"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 8.328125, y: 7} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#expansion-container-7 > div > iap-notification-group:nth-child(1) > iap-notification-type:nth-child(3) > iap-notification > div > button"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 29.96875, y: 27} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-dialog-0 > ng-component > div > form > div.main-content > div.justification > iap-justification > mat-form-field.mat-form-field.ng-tns-c116-65.mat-primary.mat-form-field-type-mat-input.mat-form-field-appearance-legacy.mat-form-field-can-float.mat-form-field-has-label.mat-form-field-hide-placeholder.ng-star-inserted"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 297, y: 8.78125} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-dialog-0 > ng-component > div > form > div.main-content > div.justification > iap-justification > div.ng-star-inserted > div:nth-child(1)"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 299, y: 9.78125} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/COMMENT"],["#mat-input-1"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 117, y: 21.0625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/COMMENT"],["#mat-input-1"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type("ClientAcceptsRisk test");
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "ClientAcceptsRisk test");
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-select-value-9"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 82, y: 6.90625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-option-86 > span"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 77, y: 8.90625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/COMMENT"],["#mat-input-1"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 224, y: 16.0625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["aria/COMMENT"],["#mat-input-1"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        const type = await element.evaluate(el => el.type);
        if (["textarea","select-one","text","url","tel","search","password","number","email"].includes(type)) {
          await element.type("ClientAcceptsRisk test 3monsnoo");
        } else {
          await element.focus();
          await element.evaluate((el, value) => {
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }, "ClientAcceptsRisk test 3monsnoo");
        }
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#resolutionNoteQualifiedContactNo > label > span.mat-radio-label-content"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 5.5, y: 10.625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-dialog-0 > ng-component > div > form > div.actions > button:nth-child(2) > span.mat-button-wrapper"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 24.71875, y: 10.5625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#contactNoteClientRepresentatives > div > div.mat-select-arrow-wrapper.ng-tns-c168-79"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 2, y: 0.5625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-option-108 > span"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 419.5, y: 10.5625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#contactNoteClientRepresentativeButton > span.mat-button-wrapper"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 13.484375, y: 14.5625} });
    }
    {
        const targetPage = page;
        const element = await waitForSelectors([["#mat-dialog-0 > ng-component > div > form > div.actions > button:nth-child(2) > span.mat-button-wrapper"]], targetPage, { timeout, visible: true });
        await scrollIntoViewIfNeeded(element, timeout);
        await element.click({ offset: { x: 17.71875, y: 12.5625} });
    }

    await browser.close();
})();
