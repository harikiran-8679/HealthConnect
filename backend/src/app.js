import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import healthTipRoutes from './routes/healthTips.js';
import diseaseRoutes from './routes/diseases.js';
import vaccinationRoutes from './routes/vaccinations.js';
import emergencyContactRoutes from './routes/emergencyContacts.js';
import womenChildRoutes from './routes/womenChild.js';
import adminRoutes from './routes/admin.js';
import languageRoutes from './routes/languages.js';
import analyticsRoutes from './routes/analytics.js';
import searchRoutes from './routes/search.js';
import uploadRoutes from './routes/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many requests, please try again later' },
});

app.use('/uploads', express.static(path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads')));

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/health-tips', healthTipRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/emergency-contacts', emergencyContactRoutes);
app.use('/api/women-child', womenChildRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'HealthConnect API is running' });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`HealthConnect API running on port ${PORT}`);
});

export default app;
