const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Pair code page serve කරන්න
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pair.html'));
});

// Express server start
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

// WhatsApp Connection
async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('QR Code received. Scan it in your WhatsApp!');
        }
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect.error).output.statusCode;
            if (reason === DisconnectReason.loggedOut) {
