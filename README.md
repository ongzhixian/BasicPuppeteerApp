# BasicPuppeteerApp

A basic puppeteer console application.


## Setup

```
npm init -y
npm i puppeteer
```

## Authoring

You can use page.waitForNavigation() as an alternative to jQuery's document.ready() function:

```js ; ref: https://stackoverflow.com/questions/53017788/function-similar-to-document-ready-in-puppeteer
await page.waitForNavigation({waitUntil: 'load'});             // consider navigation to be finished when the load event is fired.
await page.waitForNavigation({waitUntil: 'domcontentloaded'}); // consider navigation to be finished when the DOMContentLoaded event is fired.
await page.waitForNavigation({waitUntil: 'networkidle0'});     // consider navigation to be finished when there are no more than 0 network connections for at least 500 ms.
await page.waitForNavigation({waitUntil: 'networkidle2'});     // consider navigation to be finished when there are no more than 2 network connections for at least 500 ms.
```

Or this?:

`await page.waitForFunction(() => document.readyState === "complete");`


## Reference

https://developers.google.com/web/tools/puppeteer/get-started

https://github.com/puppeteer/recorder
