const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

// Middleware, um statische Dateien zu bedienen
app.use(express.static('public'));

// Speicherort für hochgeladene PDFs (kein Ordner, direkt im Hauptverzeichnis)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '.'); // Speichern im aktuellen Verzeichnis
    },
    filename: function (req, file, cb) {
        const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const timestamp = Date.now();
        cb(null, `click_stats_${userIp}_${timestamp}.pdf`);
    }
});
const upload = multer({ storage: storage });

// Route für PDF-Upload
app.post('/upload', upload.single('file'), (req, res) => {
    const userIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`PDF von IP ${userIp} wurde erfolgreich gespeichert.`);
    res.send('PDF gespeichert');
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft auf http://localhost:${port}`);
});
