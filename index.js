/*
  For any ask just need read the Google sheets API:
  https://developers.google.com/sheets/api/guides/values#javascript

*/

function redeemDataFromGoogleSheet() {
    const baseUrl = "https://spreadsheets.google.com/feeds/worksheets/";
    const spreadsheetId = "...";

    const fetchSheetsData = `${baseUrl}${spreadsheetId}/public/basic?alt=json`;

    return fetch(fetchSheetsData)
        .then((data) => data.json())
        .then((values) => {
            const entries = values?.feed.entry.shift();
            const getCellsLink = entries.link[1];
            return getCellsLink.href;
        });
}

async function fetchSingleImage() {
    // This return a XML data
    const cellsUrl = await redeemDataFromGoogleSheet();

    return fetch(`${cellsUrl}?alt=json`)
        .then((response) => response.json())
        .then((values) => {
            const entries = values?.feed.entry.slice(1, 2).pop();
            return  entries.content.$t;
        });
}

async function fetchAndFillGroupImages() {
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     This return a XML data, so... we need put '?alt=json' on the last.
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const cellsUrl = await redeemDataFromGoogleSheet();

    return fetch(`${cellsUrl}?alt=json`)
        .then((response) => response.json())
        .then((values) => {
            const entries = values?.feed.entry.slice(3, 9);

            return entries.reduce((list, entry) => {
                const image = entry.content.$t;
                list.push(image);

                return list;
            }, []);
        });
}


window.onload = async function () {
    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     Images can be changed by Google Sheet, Just change third row onwards.
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    const images = await fetchAndFillGroupImages();

    document
        .querySelectorAll(".container1")
        .forEach((element, index) => {
            return (element.src = images[index]);
        });


    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     Images can be changed by Google Sheet, Just change third row onwards.
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

    document.getElementById("container2")
        .src = await fetchSingleImage();

};
