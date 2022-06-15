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

    //const page = await browser.newPage(); // browser.newPage() opens a new tab
    // To reference the first tab when browser is opened, use browser.pages[0]
    const page = (await browser.pages())[0]; // this reference the first tab

    await page.goto('https://yahoo.com');
    
    await page.screenshot({ path: './screendumps/yahoo.png' });

    await browser.close();
})();
