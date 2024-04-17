const fs = require('fs');

const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://save-feedback-default-rtdb.firebaseio.com"
});

const db = admin.database();

function listenForNewBarcodes() {
    const ref = db.ref('barcodes');
    ref.on('child_added', function(snapshot) {
        const newBarcode = snapshot.val().barcode;
        console.log("New Barcode Scanned:", newBarcode); 
        const price = getPriceFromBarcode('data.json', newBarcode);
        if (price !== null) {
            console.log(`YRP ${price}`);
            // Create a new folder for the barcode and store the price within that folder
            const barcodeRef = db.ref(`products/${newBarcode}`);
            barcodeRef.set({
                price: price
            }, function(error) {
                if (error) {
                    console.error("Error updating price:", error);
                } else {
                    console.log("Price updated successfully!");
                }
            });
        } else {
            console.log('Barcode not found');
            // Store "barcode not found" in the same folder
            const barcodeRef = db.ref(`products/${newBarcode}`);
            barcodeRef.set({
                error: 'barcode not found'
            }, function(error) {
                if (error) {
                    console.error("Error updating error:", error);
                } else {
                    console.log("Error updated successfully!");
                }
            });
        }
    });
}

listenForNewBarcodes();

function getPriceFromBarcode(jsonFilePath, barcode) {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    for (const item of jsonData) {
        if (item.BatchBarcode === barcode) {
            return item['Taxed Sale Rate'] || null;
        }
    }

    return null;
}
