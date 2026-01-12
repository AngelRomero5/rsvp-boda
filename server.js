import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'src', 'data', 'guestlist.json');

function readGuests() {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
}

function writeGuests(guests) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(guests, null, 2), 'utf8');
}

app.get('/api/guests', (req, res) => {
    try {
        const guests = readGuests();
        res.json(guests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read guests' });
    }
});

app.put('/api/guests/:id', (req, res) => {
    try {
        const guests = readGuests();
        const index = guests.findIndex(g => g.id === req.params.id);
        if (index === -1) return res.status(404).json({ error: 'Guest not found' });

        const updatedGuest = { ...guests[index], ...req.body };
        guests[index] = updatedGuest;
        writeGuests(guests);
        res.json(updatedGuest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update guest' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
