# BasicPuppeteerApp

A basic puppeteer console application.


## Setup

```
npm init -y
npm i puppeteer
```

## Run

node <script-filename>

Example:

node .\index.js

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


## 

(node:39376) UnhandledPromiseRejectionWarning: TimeoutError: Navigation timeout of 30000 ms exceeded
    at LifecycleWatcher._LifecycleWatcher_createTimeoutPromise (D:\src\github\BasicPuppeteerApp\node_modules\puppeteer\lib\cjs\puppeteer\common\LifecycleWatcher.js:140:12)
    at async FrameManager.waitForFrameNavigation (D:\src\github\BasicPuppeteerApp\node_modules\puppeteer\lib\cjs\puppeteer\common\FrameManager.js:209:23)
    at async Frame.waitForNavigation (D:\src\github\BasicPuppeteerApp\node_modules\puppeteer\lib\cjs\puppeteer\common\FrameManager.js:584:16)
    at async Page.waitForNavigation (D:\src\github\BasicPuppeteerApp\node_modules\puppeteer\lib\cjs\puppeteer\common\Page.js:1121:16)
    at async D:\src\github\BasicPuppeteerApp\airline.js:44:5
(Use `node --trace-warnings ...` to show where the warning was created)
(node:39376) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:39376) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.