const express = require('express');
const bodyParser = require('body-parser');

const { getStoredItems, storeItems } = require('./data/items');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/items', async (req, res) => {
  try {
    const storedItems = await getStoredItems();
    res.json({ items: storedItems });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items.', error: error.message });
  }
});

app.get('/items/:id', async (req, res) => {
  try {
    const storedItems = await getStoredItems();
    const item = storedItems.find((item) => item.id === req.params.id);
    if (item) {
      res.json({ item });
    } else {
      res.status(404).json({ message: 'Item not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch item.', error: error.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const existingItems = await getStoredItems();
    const itemData = req.body;
    const newItem = {
      ...itemData,
      id: Math.random().toString(36).substr(2, 9), // Generates a shorter random ID
    };
    const updatedItems = [newItem, ...existingItems];
    await storeItems(updatedItems);
    res.status(201).json({ message: 'Stored new item.', item: newItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to store item.', error: error.message });
  }
});

app.listen(8080, () => {
  console.log('Server is running on port 8080.');
});
