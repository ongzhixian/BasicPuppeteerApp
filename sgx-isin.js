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
const headlessMode = false; // set to true (default) if you want to run the browser without a GUI
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

    const page = (await browser.pages())[0]; // get reference to first tab in browser

    // set user agent (override the default headless User Agent) -- navigator.userAgent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36');

    page.on('console', (msg) =>{
        console.log(`PAGE_LOG (${msg.type()}): ${msg.text()}`);
    });

    // await page._client.send('Page.setDownloadBehavior', {
    //     behavior: 'allow',
    //     downloadPath: downloadPath 
    // });

    await page.goto('https://www.sgx.com/research-education/securities');

    await page.waitForSelector('widget-research-and-reports-download a.widget-download-list-item-link');

    // let gotoUrl = await page.evaluate(() => {
    //     console.log("In gotoUrl");
    //     var ele = document.querySelector('widget-research-and-reports-download a.widget-download-list-item-link');
    //     console.log(ele)
    //     return ele.href;
    //     console.log(ele.href);
    // });

    // console.log(gotoUrl);
    // await page.goto(gotoUrl);

    try {
        //await page.click('widget-research-and-reports-download a.widget-download-list-item-link');
        await page.click('widget-research-and-reports-download a.widget-download-list-item-link');

        // waitForResponse is not a good wait for this link as it will load multiple elements that are not apparent
        // Uncomment the following chunk to see what I mean:
        await page.waitForResponse(response => {
            console.log(response.status(), response.url());
            console.log(response.request().url());
            return false; // return response.request().resourceType() === 'image';
        });

        // await page.waitForNetworkIdle();

        // const data = await page.evaluate(() => document.querySelector('*').outerHTML);

        // console.log(data);

    } catch (error) {
        console.log("Timeout waiting for hyperlink");
    }

    // try {
    // } catch (error) {
    //     console.log("YA got error");
    // }


    // console.log(ctn);
    

    //console.log("CLICKED");

    // await page.waitForNavigation({waitUntil: 'networkidle0'});

    // let response = await page.click('widget-research-and-reports-download a.widget-download-list-item-link');

    // console.log(response);

    // response = await page.waitForNavigation({waitUntil: 'networkidle0'});

    // console.log("response 2:", response);

    console.log("Close browser.");
    await browser.close();
})();
