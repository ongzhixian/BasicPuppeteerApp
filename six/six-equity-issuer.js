// Script for running

const fs = require('fs');
const {EOL} = require('os');

const path = require('path');
const downloadPath = path.resolve('./download');


const log = function(message) {
    fs.writeFile('sgx-isin.log', `${message}${EOL}`, { flag: 'a' }, _err=>{ /** Do nothing */});
}

log("Start");

const puppeteer = require('puppeteer');
const headlessMode = true; // set to true (default) if you want to run the browser without a GUI
const debugging = false;

(async () => {
    const browser = await puppeteer.launch({
        headless: headlessMode,
        devtools: debugging,
        defaultViewport: null, // set to null if you want to use the default viewport
        // args:[
        //     '--start-maximized' // you can also use '--start-fullscreen'
        // ]
    });

    const targetPageList = [];

    const page = (await browser.pages())[0]; // get reference to first tab in browser

    const pageTarget = page.target();

    page.on('console', (msg) =>{
        console.log(`PAGE_LOG (${msg.type()}): ${msg.text()}`);
    });

    // set user agent (override the default headless User Agent) -- navigator.userAgent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36');

    // https://www.six-group.com/en/products-services/the-swiss-stock-exchange/market-data/shares/companies.html
    // https://www.six-group.com/sheldon/equity_issuers/v1/equity_issuers.csv
    await page.goto('https://www.sgx.com/research-education/securities');

    await page.waitForSelector('widget-research-and-reports-download a.widget-download-list-item-link');

    // This page click will create a new tab on browser; we want the results in the new tab
    page.click('widget-research-and-reports-download a.widget-download-list-item-link');

    const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget);

    const newPage = await newTarget.page();

    console.log(newPage.url());

    // Get data off page in new tab

    // KIV: See below
    //await newPage.waitForNetworkIdle(); // wait for network request to complete
    await newPage.waitForSelector('body pre',  {visible: true}); 
    // await newPage.waitForSelector('body pre'); 
    
    // Note: Sometimes, it looks as if waitForSelector may return prematurely.
    //       This will result in newPage.evaluate to not have complete data.
    //       A fix maybe to wait for network request to complete.
    //       Another way maybe to waitForSelector with visible:true option 
    //       (untested; since this looks like like intermittent behavior; possibly network related)
    
    const result = await newPage.evaluate(() => {
        let element = document.querySelector("body pre");
        if (element)
            return element.innerText;
    });

    console.log(result);

    fs.writeFile('sgx-isin.txt', result, { flag: 'w' }, _err=>{ /** Do nothing */});

    console.log("Close browser.");
    await browser.close();
})();
