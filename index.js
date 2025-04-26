const { makeWASocket, useMultiFileAuthState, makeInMemoryStore } = require('@whiskeysockets/baileys');
const express = require('express');
const qrcode = require('qrcode-terminal');
const { BOT_NAME, OWNER_NAME, OWNER_NUMBER, SESSION_ID } = require('./config');
const { state, saveState } = useMultiFileAuthState('auth');

// Express server to interact with the user (for Pair Code)
const app = express();
app.use(express.json());

const store = makeInMemoryStore();

const sock = makeWASocket({
  printQRInTerminal: true,
  auth: state,
});

// Event listeners for Baileys API
sock.ev.on('connection.update', (update) => {
  const { connection, lastDisconnect, qr } = update;
  if (connection === 'open') {
    console.log(`Successfully connected to WhatsApp!`);
  } else if (connection === 'close') {
    console.log('Connection closed, reconnecting...');
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
    if (shouldReconnect) {
      sock.connect();
    }
  } else if (qr) {
    qrcode.generate(qr, { small: true });
  }
});

// Web server to serve Pair Code
app.get('/', (req, res) => {
  res.send('Pair your WhatsApp bot by scanning the QR code shown in the terminal.');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

sock.ev.on('creds.update', saveState);
