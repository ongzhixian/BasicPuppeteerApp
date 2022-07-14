// Script for running

const fs = require('fs');
const {EOL} = require('os');
const { parse } = require('path');

const log = function(message) {
    fs.writeFile('airline.log', `${message}${EOL}`, { flag: 'a' }, _err=>{ /** Do nothing */});
}

const csv = function(message) {
    if (Array.isArray(message)) {
        message.forEach((m, idx, arr) => {
            arr[idx] = `"${m.replace(/\"/g, '\"\"')}"`;
            // if (m.indexOf(',') >= 0) {
            //     arr[idx] = `"${m.replace(/\"/g, '\"\"')}"`;
            // } else {
            //     arr[idx] = m.replace(/\"/g, '\"\"');
            // }
        });
    }
    debugger;
    return message;
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

    // page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    page.on('console', (msg) =>{
        console.log(`PAGE_LOG(${msg.type()}): ${msg.text()}`);
    });

    // What we will be doing:
    // 1. Go to page (and wait for page to load)
    // 2. Get information on page

    await page.goto('https://www.iata.org/en/publications/directories/code-search/');
    //await page.goto('https://www.iata.org/en/publications/directories/code-search/?airline.page=5&airline.search=');

    // There is something wrong with the page; it does not load properly and and there's a constant AJAX requests.
    // try {
    //      await page.waitForNavigation({waitUntil: 'networkidle0'});
    //     await page.waitForNavigation({ waitUntil: 'load' });
    // } catch (error) {
    //     console.log('ya some error occured');
    // }

    // await page.waitForSelector('table.datatable');

    await page.waitForSelector('div.airlinecodessearchblock');

    // We want to know number of records

    // const numRecords = await page.evaluate(() => {
    //     let expectedAirlineCodesCount = -1;
    //     // Find the element that contains the number of records
    //     let checkElement = document.querySelector("div.airlinecodessearchblock p.registry-result-text");
    //     if (!checkElement)
    //         return expectedAirlineCodesCount;
    //     // Otherwise, we have element and we expect the innerText to have a format like 'Found 1126 Airline Codes'
    //     let textRegex = /Found (\d*) Airline Codes/;
    //     let matches = checkElement.innerText.match(textRegex);
    //     if (matches)
    //         return matches[1];
    //     return expectedAirlineCodesCount;
    // });

    const numRecords = await parseAirlineCodes(page);

    console.log(`Number of airline codes: ${numRecords}`);

    // We want to know max number of pages
    
    // page.evaluate(() => {
    //     // Find the element that contains the number of pages
    //     const pageText = document.querySelector("div.airlinecodessearchblock div.row a.pagination-link:nth-of-type(2)");
    //     if (pageText)
    //         return parseInt(pageText.innerText, 10);
    //     return -1;
    //     // let expectedAirlineCodesCount = -1;
    //     // // Find the element that contains the number of records
    //     // let checkElement = document.querySelector("div.airlinecodessearchblock p.registry-result-text");
    //     // if (!checkElement)
    //     //     return expectedAirlineCodesCount;
    //     // // Otherwise, we have element and we expect the innerText to have a format like 'Found 1126 Airline Codes'
    //     // let textRegex = /Found (\d*) Airline Codes/;
    //     // let matches = checkElement.innerText.match(textRegex);
    //     // if (matches)
    //     //     return matches[1];
    //     // return expectedAirlineCodesCount;
    // });

    const maxPage = await parseMaxPage(page);

    console.log(`Number of pages: ${maxPage}`);

    let pageIndex = 0;

    for (pageIndex = 0; pageIndex < 5; ) {

        try {
            console.log(`Page index: ${pageIndex} (actual page number: ${pageIndex + 1})`);

            let response = await page.goto(`https://www.iata.org/en/publications/directories/code-search/?airline.page=${pageIndex + 1}&airline.search=`);
    
            // let res = await page.waitForResponse(response => {
            //     return response.status() === 200;
            // });

            // let res = await page.waitForResponse(_ => {});
            // console.log("OK");

            if (!response.ok())
            {
                console.log(`Something is wrong. (received HTTP ${response.status()}); wait for 5 seconds before retrying`);
                await new Promise(function(resolve) { setTimeout(resolve, 5000) });
                continue;
            }

            await page.waitForSelector('div.airlinecodessearchblock', {timeout: 0});
    
            let data = await parseAirlineCodes(page);
    
            data.forEach((val, idx , arr) => {
                console.log(`Length: ${val.length}, [${[...val]}]`);
                log(`${csv([...val])}`);
            })

            pageIndex++;
        } catch (error) {
            console.log(error);
            await new Promise(() => setTimeout(() => {}, 5000));
        }

        
        // let data = await page.evaluate(() => {

        //     // Browser context
        //     console.log(`url is ${location.href}`);
        //     let datatables = document.querySelectorAll("table.datatable");
    
        //     // The last we check (tlwc), there are 2 datatables on the page; we want the first one
        //     console.log(`Number of datatables: ${datatables.length}`);
    
        //     let airline_datatable = datatables[0];
    
        //     let header_element_names = [];
        //     let expected_header_element_names = [
        //         'COMPANY NAME',
        //         'COUNTRY / TERRITORY',
        //         '2-LETTER CODE',
        //         'ACCOUNTING CODE (PAX)',
        //         'AIRLINE PREFIX CODE'
        //     ];
    
        //     airline_datatable.querySelectorAll('thead tr').forEach(function(tr) {
        //         tr.querySelectorAll('td').forEach(function(td) {
        //             header_element_names.push(td.innerText);
        //         });
        //     });
    
        //     // Compare if header_element_names is the same as we expect
        //     let hasExpectedHeaders = header_element_names.length === expected_header_element_names.length 
        //         && header_element_names.every((value, index) => value === expected_header_element_names[index]);
    
        //     if (!hasExpectedHeaders) {
        //         return; // Stop if we do no have the expected headers; implication here is that the page that we know may have changed
        //     }
    
        //     let rows = [];
    
        //     airline_datatable.querySelectorAll('tbody tr').forEach(function(tr) {
        //         let row_data = [];
        //         tr.querySelectorAll('td').forEach(function(td) {
        //             row_data.push(td.innerText);
        //         });
        //         rows.push(row_data);
        //     });
    
        //     console.log(`Number of rows: ${rows.length}`);

        //     rows.forEach((val, idx , arr) => {
        //         console.log(`Length: ${val.length}, [${[...val]}]`);
        //     })
    
        // });
    }
    

    
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
})();


async function parseAirlineCodes(page) {
    
    return page.evaluate(() => {

        let expectedAirlineCodesCount = -1;

        // Find the element that contains the number of records
        let checkElement = document.querySelector("div.airlinecodessearchblock p.registry-result-text");
        
        if (!checkElement)
            return expectedAirlineCodesCount;
        
        // Otherwise, we have element and we expect the innerText to have a format like 'Found 1126 Airline Codes'
        let textRegex = /Found (\d*) Airline Codes/;
        let matches = checkElement.innerText.match(textRegex);

        if (matches)
            return matches[1];
        
        return expectedAirlineCodesCount;
    });
}

async function parseMaxPage(page) {
    return page.evaluate(() => {

        // Find the element that contains the number of pages
        const pageText = document.querySelector("div.airlinecodessearchblock div.row a.pagination-link:nth-of-type(2)");

        if (pageText)
            return parseInt(pageText.innerText, 10);

        return -1;

        // let expectedAirlineCodesCount = -1;
        // // Find the element that contains the number of records
        // let checkElement = document.querySelector("div.airlinecodessearchblock p.registry-result-text");
        // if (!checkElement)
        //     return expectedAirlineCodesCount;
        // // Otherwise, we have element and we expect the innerText to have a format like 'Found 1126 Airline Codes'
        // let textRegex = /Found (\d*) Airline Codes/;
        // let matches = checkElement.innerText.match(textRegex);
        // if (matches)
        //     return matches[1];
        // return expectedAirlineCodesCount;
    });
}

async function parseAirlineCodes(page) {
    return page.evaluate(() => {

        // Browser context
        console.log(`url is ${location.href}`);
        let datatables = document.querySelectorAll("table.datatable");

        // The last we check (tlwc), there are 2 datatables on the page; we want the first one
        console.log(`Number of datatables: ${datatables.length}`);

        let airline_datatable = datatables[0];

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

        return rows;

        // console.log(`Number of rows: ${rows.length}`);

        // rows.forEach((val, idx , arr) => {
        //     console.log(`Length: ${val.length}, [${[...val]}]`);
        // })

    });
}