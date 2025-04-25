const qrcode = require('qrcode');
const express = require('express');
const router = express.Router();

let qrImage = null;

/**
 * This function sets the latest QR code.
 * It's used inside the main bot code when QR is generated.
 */
function updateQR(qr) {
  qrcode.toDataURL(qr, (err, url) => {
    if (!err) {
      qrImage = url;
    }
  });
}

/**
 * Route to get the latest QR code.
 */
router.get('/paircode', (req, res) => {
  if (qrImage) {
    res.send(`<img src="${qrImage}" alt="QR Code" />`);
  } else {
    res.send('QR code not generated yet. Please refresh in a moment.');
  }
});

module.exports = { router, updateQR };
