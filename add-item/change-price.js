const fs = require('fs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Read the JSON file
fs.readFile('sample.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Parse the JSON data
    let jsonData = JSON.parse(data);

    // Function to update the "Taxed Sale Rate" based on BatchBarcode value
    function updateTaxedSaleRate(batchBarcode, newRate) {
        let barcodeFound = false;
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].BatchBarcode === batchBarcode) {
                jsonData[i]["Taxed Sale Rate"] = newRate;
                barcodeFound = true;
                break; // Assuming each barcode is unique, so we can exit loop once found
            }
        }
        if (!barcodeFound) {
            console.log(`Barcode ${batchBarcode} not found.`);
        }
    }

    // Function to get user input
    function getUserInput() {
        rl.question('Enter Barcode: ', (batchBarcode) => {
            rl.question('Sale Rate: ', (newRate) => {
                updateTaxedSaleRate(batchBarcode, newRate);
                // Convert the updated JSON back to string
                let updatedData = JSON.stringify(jsonData, null, 2);

                // Write the updated JSON back to the file
                fs.writeFile('sample.json', updatedData, 'utf8', (err) => {
                    if (err) {
                        console.error('Error writing file:', err);
                        return;
                    }
                    console.log('File updated successfully!');
                    rl.close();
                });
            });
        });
    }

    // Call function to get user input
    getUserInput();
});
