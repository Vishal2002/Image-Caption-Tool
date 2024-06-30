"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inference_1 = require("@huggingface/inference");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT || 8080;
const inference = new inference_1.HfInference(process.env.HF_ACCESS_TOKEN);
const model = process.env.ML_MODEL;
const uploadsDir = path_1.default.join(__dirname, '..', 'uploads');
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage: storage });
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir);
}
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, uploadsDir)));
app.get('/health', (req, res) => {
    res.send({ message: "Hello from this Side" });
});
app.post('/generate-caption', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send({ error: "No image uploaded" });
    }
    const filePath = path_1.default.join(uploadsDir, req.file.filename);
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).send({ error: "Uploaded file not found" });
    }
    try {
        const imageBuffer = yield fs_1.default.promises.readFile(filePath);
        const imageBlob = new Blob([imageBuffer], { type: req.file.mimetype });
        const results = yield inference.imageToText({
            data: imageBlob,
            model: model,
        });
        res.send(results);
    }
    catch (error) {
        console.error("Error processing file:", error);
        res.status(500).send({ error: "Error generating caption" });
    }
}));
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
