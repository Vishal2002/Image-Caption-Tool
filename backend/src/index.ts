import { HfInference } from '@huggingface/inference';
import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {User} from './models/user'
import bcrypt from 'bcrypt';
import {z} from 'zod';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import { SigninSchema,SignupSchema } from './validation/validation';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.URI_STRING as string).then(()=>{
 console.log("Connected to Datbase");
}).catch(err=>{console.log(err,"MongoErr")})

const port = process.env.PORT || 8080;
const inference = new HfInference(process.env.HF_ACCESS_TOKEN);
const imageCaptioningModel = process.env.ML_MODEL;
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
const uploadsDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage(
    {
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

app.use('/uploads', express.static(path.join(__dirname, uploadsDir)));

app.get('/health', (req: Request, res: Response) => {
    res.send({ message: "Hello from this Side" });
});

app.post('/signup', async (req: Request, res: Response) => {
    try {
      const validatedData = SignupSchema.parse(req.body);
  
      const existingUser = await User.findOne({ email: validatedData.email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
  
      const newUser = new User({
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors.map(e => e.message) });
      } else {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });
  
app.post('/signin', async (req: Request, res: Response) => {
    try {
      const validatedData = SigninSchema.parse(req.body);
  
      const user = await User.findOne({ email: validatedData.email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(validatedData.password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      const token = jwt.sign(
        { userId: user._id,username:user.name },
        process.env.JWT_SECRET_KEY as string,
        { expiresIn: '24h' }
      );
  
      res.status(200).json({ token, username:user.name });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors.map(e => e.message) });
      } else {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });


app.post('/generate-caption', upload.single('image'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send({ error: "No image uploaded" });
    }

    const { vibe } = req.body;

    const filePath = path.join(uploadsDir, req.file.filename);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send({ error: "Uploaded file not found" });
    }

    try {
        const imageBuffer = await fs.promises.readFile(filePath);
        const imageBlob = new Blob([imageBuffer], { type: req.file.mimetype });

        const initialCaption = await inference.imageToText({
            data: imageBlob,
            model: imageCaptioningModel,
        });

        const enhancedCaptionPrompt = `Create a Three to Four ${vibe} caption for an image described as: "${initialCaption.generated_text}". The caption should be witty, humorous, and suitable for social media. Do not include any instructions or examples in your response. Keep the caption concise but engaging. Also add some trendy hashtags`;

        const result = await model.generateContent([
            enhancedCaptionPrompt]
            );
        
        res.send({
            initialCaption: initialCaption.generated_text,
            enhancedCaption: result.response.text().trim().split('\n').filter(caption => caption.trim() !== ''),
            vibe: vibe
        });
    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).send({ error: "Error generating caption" });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});