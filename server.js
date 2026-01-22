import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { Storage } from 'megajs';

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
        const index = guests.findIndex((g) => g.id === req.params.id);
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

// ========= MEGA UPLOAD LOGIC =========

// Multer in-memory storage to get file buffers
const upload = multer({ storage: multer.memoryStorage() });

// Env vars for MEGA credentials
const MEGA_EMAIL = process.env.MEGA_EMAIL;
const MEGA_PASSWORD = process.env.MEGA_PASSWORD;
// Name of the folder in your MEGA drive
const MEGA_FOLDER_NAME = 'BodaA&M';

let megaStorage;

// Initialize MEGA connection once and reuse
async function initMega() {
    if (!megaStorage) {
        try {
            megaStorage = await new Storage({
                email: MEGA_EMAIL,
                password: MEGA_PASSWORD,
            }).ready;
            console.log('MEGA login OK as', MEGA_EMAIL);
        } catch (err) {
            console.error('MEGA login failed:', err);
            throw err;
        }
    }
    return megaStorage;
}

// Get or create the target folder in MEGA
async function getMegaFolder() {
    const storage = await initMega();

    // Look for folder in root
    let target = Object.values(storage.root.children).find(
        (child) => child.name === MEGA_FOLDER_NAME && child.directory === true
    );

    if (!target) {
        target = await storage.mkdir(MEGA_FOLDER_NAME);
    }

    return target;
}

// Endpoint: upload photos to MEGA
// Expecting FormData with field name "photos"
app.post('/api/upload-photos', upload.array('photos'), async (req, res) => {
    try {
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files received' });
        }

        const storage = await initMega();
        const folder = await getMegaFolder();

        const uploaded = [];

        for (const file of files) {
            const megaFile = await storage
                .upload(
                    {
                        name: file.originalname,
                        size: file.size,
                        target: folder,
                    },
                    file.buffer
                )
                .complete;

            uploaded.push({
                name: megaFile.name,
                size: megaFile.size,
                // link,
            });
        }

        res.json({ success: true, files: uploaded });
    } catch (err) {
        console.error('MEGA upload error:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// ========= START SERVER =========
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
