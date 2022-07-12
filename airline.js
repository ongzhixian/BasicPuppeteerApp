// Script for running

const fs = require('fs');
const {EOL} = require('os');

var log = function(message) {
    fs.writeFile('airline.log', `${message}${EOL}`, { flag: 'w' }, _err=>{ /** Do nothing */});
}

// KIV: The idea here is to create a function that does logging using writestreams (using a readstream as a intermediary).
// var logstream = fs.createWriteStream('./airline.logstream');
// logstream.on('error', function (err) {
//     console.log(err);
// });


log("Start");

const puppeteer = require('puppeteer');
const headlessMode = true; // set to true (default) if you want to run the browser without a GUI
const debugging = false;

var fresult = {};

(async (fresult) => {
    const browser = await puppeteer.launch({
        headless: headlessMode, 
        devtools: debugging,
        defaultViewport: null, // set to null if you want to use the default viewport
        // args:[
        //     '--start-maximized' // you can also use '--start-fullscreen'
        // ]
    });

    const page = (await browser.pages())[0]; // get reference to first tab in browser

    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));

    // What we will be doing:
    // 1. Go to page (and wait for page to load)
    // 2. Get information on page

    // await page.goto('https://www.iata.org/en/publications/directories/code-search/');
    await page.goto('https://www.iata.org/en/publications/directories/code-search/?airline.page=5&airline.search=');

    // await page.waitForNavigation({waitUntil: 'networkidle0'});

    // try {
    //     await page.waitForNavigation({ waitUntil: 'load' });
    // } catch (error) {
    //     console.log('ya some error occured');
    // }


    await page.waitForSelector('table.datatable');
    
    let data = await page.evaluate(() => {

        // Browser context
        console.log(`url is ${location.href}`);
        let datatables = document.querySelectorAll("table.datatable");

        // The last we check (tlwc), there are 2 datatables on the page; we want the first one
        console.log(`Number of datatables: ${datatables.length}`);

        let airline_datatable = datatables[0];

        // console.log(airline_datatable);

        let header_element_names = [];
        let expected_header_element_names = [
            'COMPANY NAME',
            'COUNTRY / TERRITORY',
            '2-LETTER CODE',
            'ACCOUNTING CODE (PAX)',
            'AIRLINE PREFIX CODE'
        ];

        airline_datatable.querySelectorAll('thead tr').forEach(function(tr) {
            tr.querySelectorAll('td').forEach(function(td) {
                header_element_names.push(td.innerText);
            });
        });

        // Compare if header_element_names is the same as we expect
        let hasExpectedHeaders = header_element_names.length === expected_header_element_names.length 
            && header_element_names.every((value, index) => value === expected_header_element_names[index]);

        if (!hasExpectedHeaders) {
            return; // Stop if we do no have the expected headers; implication here is that the page that we know may have changed
        }

        let rows = [];

        airline_datatable.querySelectorAll('tbody tr').forEach(function(tr) {
            let row_data = [];
            tr.querySelectorAll('td').forEach(function(td) {
                row_data.push(td.innerText);
            });
            rows.push(row_data);
        });

        console.log(`Number of rows: ${rows.length}`)
        rows.forEach((val, idx , arr) => {
            console.log(`Length: ${val.length}, [${[...val]}]`);
        })

    });
    
    // let data = await page.evaluate(() => {
    //     console.log(`url is ${location.href}`);

    //     let results = [];
    //     let items = document.querySelectorAll("table.datatable");
    //     items.forEach((item) => {
    //         console.log(item);
    //         log(item);
    //     });
        

    //     // document.querySelectorAll("table.datatable")[0]
        

    //     // items.forEach((item) => {
    //     //     results.push({
    //     //         url: item.getAttribute('data-url'),
    //     //         title: item.querySelector('.title').innerText,
    //     //     })
    //     // })
    //     return items
    // })

    


    // await page.goto('https://www.iata.org/en/publications/directories/code-search/?airline.page=1&airline.search=');
    // await page.waitForNavigation({waitUntil: 'networkidle0'});

    // await page.goto('https://www.iata.org/en/publications/directories/code-search/?airline.page=2&airline.search=');
    // await page.waitForNavigation({waitUntil: 'networkidle0'});

    // await page.click("button[value=login]");
    
    // await page.waitForNavigation({waitUntil: 'networkidle0'});

    
    // await page.screenshot({ path: './screendumps/dias.png' });


    console.log("Close browser.");
    await browser.close();
})(fresult).then((a) => {
    console.log(a);
});

// log(fresult);
// debugger;