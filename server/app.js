const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// .env dosyasını yükle
dotenv.config();

const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 📁 uploads klasörünü oluştur (varsa geç)
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 🌐 Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📦 Routes
app.use('/api/cars', carRoutes);  // Araç işlemleri
app.use('/api/auth', authRoutes); // Kullanıcı işlemleri

// 🧠 MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('✅ MongoDB bağlantısı başarılı');
        app.listen(PORT, () => {
            console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB bağlantı hatası:', err.message);
    });
