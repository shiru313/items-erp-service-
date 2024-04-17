var firebaseConfig = {
  apiKey: "AIzaSyBs5HAeKd4BJVe73HNuAUgbMXZsywXlvMk",
  authDomain: "save-feedback.firebaseapp.com",
  databaseURL: "https://save-feedback-default-rtdb.firebaseio.com",
  projectId: "save-feedback",
  storageBucket: "save-feedback.appspot.com",
  messagingSenderId: "892913337670",
  appId: "1:892913337670:web:555b299ff99f7bd79b5147",
  measurementId: "G-6REBBM5ZE6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

// Remove all content from the 'products' node
database.ref('products').remove()
  .then(function () {
      console.log("All content deleted from 'products' node.");

      var isScanning = false;
      var scannedBarcodes = [];

      function displayLatestData() {
          var resultDiv = document.getElementById('result');

          database.ref('products').orderByKey().limitToLast(1).on('child_added', function (snapshot) {
              var data = snapshot.val();
              var displayText = "";

              if (data) {
                  if (data.error) {
                      displayText += data.error;
                  }

                  if (data.price) {
                      if (displayText !== "") {
                          displayText += " ";
                      }
                      displayText += "YRP: " + data.price;
                  }
              }

              resultDiv.textContent = displayText || "No data available";
          });
      }

      displayLatestData();

      navigator.mediaDevices.getUserMedia({
          video: {
              facingMode: "environment",
              focusMode: "continuous" // Set focus mode to continuous for better focus
          }
      })
      .then(function (stream) {
          var video = document.getElementById('video');
          video.srcObject = stream;
          video.onloadedmetadata = function (e) {
              video.play();
          };
      })
      .catch(function (err) {
          console.error('Error accessing camera:', err);
      });

      Quagga.init({
          inputStream: {
              name: "Live",
              type: "LiveStream",
              target: document.querySelector("#video")
          },
          decoder: {
              readers: ["code_128_reader", "ean_reader", "ean_8_reader", "code_39_reader", "code_39_vin_reader", "codabar_reader", "upc_reader", "upc_e_reader"]
          }
      }, function (err) {
          if (err) {
              console.error("Failed to initialize Quagga: ", err);
              return;
          }
          console.log("Quagga initialized successfully");

          Quagga.start();

          Quagga.onDetected(function (result) {
              if (!isScanning) { // Check if not already scanning
                  isScanning = true;
                  var scannedBarcode = result.codeResult.code;

                  if (scannedBarcodes.length === 3 && scannedBarcodes.every(code => code === scannedBarcode)) {
                      console.log("Barcode scanned three times consecutively:", scannedBarcode);
                      isScanning = false; // Reset scanning
                      scannedBarcodes = []; // Clear scanned barcodes array
                      return; // Exit the function without processing the barcode
                  }

                  scannedBarcodes.push(scannedBarcode); // Add the scanned barcode to the array

                  console.log("Scanned Barcode:", scannedBarcode);

                  database.ref('barcodes').push().set({
                      barcode: scannedBarcode
                  }).then(function () {
                      console.log("Barcode stored to Firebase successfully");
                  }).catch(function (error) {
                      console.error("Error storing barcode to Firebase:", error);
                  });

                  setTimeout(function () {
                      isScanning = false;
                  }, 5000);
              }
          });
      });
  })
  .catch(function (error) {
      console.error("Error deleting content:", error);
  });

var refreshButton = document.getElementById('refreshButton');

// Add event listener for click event
refreshButton.addEventListener('click', function () {
  // Reload the page
  location.reload();
});

setInterval(function () {
  var scanMessage = document.getElementById("scanMessage");
  scanMessage.textContent = scanMessage.textContent === "Click logo to get offers" ? "scan any product" : "Click logo to get offers";
}, 6000);
