const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const carController = require('../controllers/carController');

// 📦 Multer konfigürasyonu (Görseller uploads klasörüne kaydedilir)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const upload = multer({ storage });

// ==================== ROUTES ==================== //

// 🆕 Yeni araç ekleme
router.post('/', upload.single('image'), carController.addCar);

// 📄 Tüm araçları listeleme
router.get('/', carController.getCars);

// 🖼️ Tek bir aracın görselini getirme
router.get('/:id/image', carController.getCarImage);

// ❌ Araç silme
router.delete('/:id', carController.deleteCar);

// ✏️ Araç güncelleme (isteğe bağlı görselle birlikte)
router.put('/:id', upload.single('image'), carController.updateCar);

// ⭐ Favori ekle/çıkar
router.put('/:id/favorite', carController.toggleFavorite);

// ❤️ Favori araçları getirme
router.get('/favorites', carController.getFavoriteCars);

// 🧹 1 yıldan eski araçları sil
router.delete('/delete-old-cars', carController.deleteOldCars);

// ================================================= //

module.exports = router;
