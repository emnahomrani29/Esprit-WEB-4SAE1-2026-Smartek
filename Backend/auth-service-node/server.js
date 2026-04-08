require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // pour les images base64

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 8081;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Auth Service démarré sur le port ${PORT}`));
});
