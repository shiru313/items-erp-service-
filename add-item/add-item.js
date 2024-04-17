document.getElementById('submit').addEventListener('click', function() {
	var barcode = document.getElementById('barcode').value;
	var price = document.getElementById('price').value;
  
	// Send the barcode and price to the server
	fetch('/add-item', {
	  method: 'POST',
	  headers: {
		'Content-Type': 'application/json'
	  },
	  body: JSON.stringify({ barcode: barcode, price: price })
	})
	.then(response => {
	  if (response.ok) {
		console.log('Item added successfully.');
		document.getElementById('overlay').style.display = 'none';
	  } else {
		console.error('Failed to add item.');
	  }
	})
	.catch(error => {
	  console.error('Error adding item:', error);
	});
  });
  
  document.getElementById('button1').addEventListener('click', function() {
	document.getElementById('overlay').style.display = 'block';
  });
  
  document.getElementById('cancel').addEventListener('click', function() {
	document.getElementById('overlay').style.display = 'none';
  });
  