// Script for running Dias
const puppeteer = require('puppeteer');

const headlessMode = false; // set to true (default) if you want to run the browser without a GUI

(async () => {
    const browser = await puppeteer.launch({
        headless: headlessMode, 
        defaultViewport: null, // set to null if you want to use the default viewport
        // args:[
        //     '--start-maximized' // you can also use '--start-fullscreen'
        // ]
    });

    const page = (await browser.pages())[0]; // get reference to first tab in browser

    // Go to localhost
    // Click on Local Login button

    await page.goto('https://localhost');

    await page.waitForNavigation({waitUntil: 'networkidle0'});

    await page.click("button[value=login]");
    
    await page.waitForNavigation({waitUntil: 'networkidle0'});

    
    // await page.screenshot({ path: './screendumps/dias.png' });

    //await browser.close();
})();
