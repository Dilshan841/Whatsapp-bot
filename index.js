const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

let pairCode = null;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      qrcode.toDataURL(qr, (err, url) => {
        if (err) {
          console.error('QR Code generation error:', err);
        } else {
          pairCode = url;
        }
      });
    }
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
      if (shouldReconnect) {
        startBot();
    }
    } else if (connection === 'open') {
      console.log('opened connection');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.key.fromMe && msg.message) {
      const sender = msg.key.remoteJid;
      await sock.sendMessage(sender, { text: 'Hello! This is DILSHAN-MD bot.' });
    }
  });
}

app.get('/paircode', (req, res) => {
  if (pairCode) {
    res.send(`<img src="pairCode" alt="QR Code"/>`);
   if
    javascript
console.log('Pair code not available yet. Please wait...');
  );

app.listen(PORT, () => 
  console.log(`DILSHAN-MD bot server running at http://localhost:{PORT}`);
  startBot();
});
