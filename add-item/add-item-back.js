const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/add-item', (req, res) => {
  const { barcode, price } = req.body;

  // Read the existing data file
  fs.readFile('sample.json', 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading existing data file:", err);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Parse the existing data JSON
    let existingData = [];
    try {
      existingData = JSON.parse(data);
    } catch (parseError) {
      console.error("Error parsing existing data JSON:", parseError);
      res.status(500).send('Internal Server Error');
      return;
    }

    // Create new data object
    const newData = {
      "BatchBarcode": barcode,
      "Taxed Sale Rate": price
    };

    // Add the new data to the existing data
    existingData.push(newData);

    // Write the updated data back to the file
    fs.writeFile('sample.json', JSON.stringify(existingData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error("Error writing updated data file:", err);
        res.status(500).send('Internal Server Error');
        return;
      }
      console.log("Data successfully updated.");
      res.sendStatus(200);
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
