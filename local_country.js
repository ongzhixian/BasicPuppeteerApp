// Script for testing

const fs = require('fs');
const {EOL} = require('os');

const log = function(message) {
    fs.writeFile('local_country.log', `${message}${EOL}`, { flag: 'a' }, _err=>{ /** Do nothing */});
}

log("-- Start --");

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

    page.on('console', (msg) => console.log('PAGE_LOG:', msg.text()));

    // What we will be doing:
    // 1. Go to page (and wait for page to load)
    // 2. Get information on page

    await page.goto('http://localhost:31000/shared-data/country-test?page=1');

    await page.waitForSelector('table');

    const maxPage = 10;

    console.log(`Number of pages: ${maxPage}`);

    let pageIndex = 0;

    for (pageIndex = 0; pageIndex < maxPage; ) {

        try {
            console.log(`Page index: ${pageIndex} (actual page number: ${pageIndex + 1})`);

            let response = await page.goto(`http://localhost:31000/shared-data/country-test?page=${pageIndex + 1}`);
    
            if (!response.ok())
            {
                console.log(`Something is wrong. (received HTTP ${response.status()}); wait for 5 seconds before retrying`);
                await new Promise(function(resolve) { setTimeout(resolve, 5000) });
                continue;
            }

            await page.waitForSelector('table', {timeout: 0});
    
            let data = await getDataFromPage(page);
    
            data.forEach((val, idx , arr) => {
                console.log(`Length: ${val.length}, [${[...val]}]`);
            })

            pageIndex++;
        } catch (error) {
            console.log(error);
            await new Promise(() => setTimeout(() => {}, 5000));
        }

    }

    console.log("Close browser.");
    await browser.close();
})();


async function getDataFromPage(page) {
    
    return page.evaluate(() => {

        // Find the element that contains the number of records
        let table_rows = document.querySelectorAll("table tbody tr");

        console.log("table_rows:", table_rows.length);

        let data = [];
        table_rows.forEach(function(tr) {
            let row_data = [];
            tr.querySelectorAll('td').forEach(function(td) {
                row_data.push(td.innerText);
            });
            data.push(row_data);
        });

        return data;
    });
}


// async function parseAirlineCodes(page) {
    
//     return await page.evaluate(() => {

//         let expectedAirlineCodesCount = -1;

//         // Find the element that contains the number of records
//         let checkElement = document.querySelector("div.airlinecodessearchblock p.registry-result-text");
        
//         if (!checkElement)
//             return expectedAirlineCodesCount;
        
//         // Otherwise, we have element and we expect the innerText to have a format like 'Found 1126 Airline Codes'
//         let textRegex = /Found (\d*) Airline Codes/;
//         let matches = checkElement.innerText.match(textRegex);

//         if (matches)
//             return matches[1];
        
//         return expectedAirlineCodesCount;
//     });
// }

// async function parseMaxPage(page) {
//     return await page.evaluate(() => {

//         // Find the element that contains the number of pages
//         const pageText = document.querySelector("div.airlinecodessearchblock div.row a.pagination-link:nth-of-type(2)");

//         if (pageText)
//             return parseInt(pageText.innerText, 10);

//         return -1;

//         // let expectedAirlineCodesCount = -1;
//         // // Find the element that contains the number of records
//         // let checkElement = document.querySelector("div.airlinecodessearchblock p.registry-result-text");
//         // if (!checkElement)
//         //     return expectedAirlineCodesCount;
//         // // Otherwise, we have element and we expect the innerText to have a format like 'Found 1126 Airline Codes'
//         // let textRegex = /Found (\d*) Airline Codes/;
//         // let matches = checkElement.innerText.match(textRegex);
//         // if (matches)
//         //     return matches[1];
//         // return expectedAirlineCodesCount;
//     });
// }

// async function parseAirlineCodes(page) {
//     return await page.evaluate(() => {

//         // Browser context
//         console.log(`url is ${location.href}`);
//         let datatables = document.querySelectorAll("table.datatable");

//         // The last we check (tlwc), there are 2 datatables on the page; we want the first one
//         console.log(`Number of datatables: ${datatables.length}`);

//         let airline_datatable = datatables[0];

//         let header_element_names = [];
//         let expected_header_element_names = [
//             'COMPANY NAME',
//             'COUNTRY / TERRITORY',
//             '2-LETTER CODE',
//             'ACCOUNTING CODE (PAX)',
//             'AIRLINE PREFIX CODE'
//         ];

//         airline_datatable.querySelectorAll('thead tr').forEach(function(tr) {
//             tr.querySelectorAll('td').forEach(function(td) {
//                 header_element_names.push(td.innerText);
//             });
//         });

//         // Compare if header_element_names is the same as we expect
//         let hasExpectedHeaders = header_element_names.length === expected_header_element_names.length 
//             && header_element_names.every((value, index) => value === expected_header_element_names[index]);

//         if (!hasExpectedHeaders) {
//             return; // Stop if we do no have the expected headers; implication here is that the page that we know may have changed
//         }

//         let rows = [];

//         airline_datatable.querySelectorAll('tbody tr').forEach(function(tr) {
//             let row_data = [];
//             tr.querySelectorAll('td').forEach(function(td) {
//                 row_data.push(td.innerText);
//             });
//             rows.push(row_data);
//         });

//         return rows;

//         // console.log(`Number of rows: ${rows.length}`);

//         // rows.forEach((val, idx , arr) => {
//         //     console.log(`Length: ${val.length}, [${[...val]}]`);
//         // })

//     });
// }