import { HfInference } from '@huggingface/inference';
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;
const inference = new HfInference(process.env.HF_ACCESS_TOKEN);
const model = process.env.ML_MODEL;
const uploadsDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(path.join(__dirname,uploadsDir)));

app.get('/health', (req: Request, res: Response) => {
    res.send({ message: "Hello from this Side" });
});

app.post('/generate-caption', upload.single('image'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send({ error: "No image uploaded" });
    }

    const filePath = path.join(uploadsDir, req.file.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send({ error: "Uploaded file not found" });
    }

    try {
        const imageBuffer = await fs.promises.readFile(filePath);

        const imageBlob = new Blob([imageBuffer], { type: req.file.mimetype });

        const results = await inference.imageToText({
            data: imageBlob,
            model: model,
        });

        res.send(results);
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).send({ error: "Error generating caption" });
    }
});
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});