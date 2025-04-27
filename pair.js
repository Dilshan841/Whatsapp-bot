const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const pairFilePath = path.join(__dirname, 'pair.html');

app.get('/', (req, res) => {
    fs.readFile(pairFilePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error loading Pair page.');
        } else {
            res.send(data);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Pair server running at http://localhost:${PORT}`);
});
