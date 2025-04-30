const Car = require('../models/Car');
const path = require('path');
const fs = require('fs');

// 🚗 Yeni araç ekleme (FormData'dan gelen dosya ve body ile)
const addCar = async (req, res) => {
    try {
        const { title, brand, modelYear, price, description } = req.body;
        const imagePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

        // 🧠 Aynı araç zaten kayıtlı mı?
        const existingCar = await Car.findOne({
            title,
            brand,
            modelYear,
            price: parseFloat(price.toString().replace(',', '.'))
        });

        if (existingCar) {
            return res.status(409).json({ message: 'Bu araç zaten eklenmiş.' });
        }

        const newCar = new Car({
            title,
            brand,
            modelYear: parseInt(modelYear),
            price: parseFloat(price.toString().replace(',', '.')),
            description,
            image: imagePath
        });

        await newCar.save();
        res.status(201).json(newCar);
    } catch (error) {
        console.error('🚨 Araç eklenemedi:', error.message);
        res.status(500).json({ message: 'Araç eklenemedi', error: error.message });
    }
};

// 📥 Aracın görselini döndürme
const getCarImage = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findById(id);
        if (!car || !car.image) {
            return res.status(404).send('Görsel bulunamadı');
        }

        const filePath = path.resolve(__dirname, '..', car.image);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ message: 'Görsel alınamadı', error });
    }
};

// 📄 Araçları listeleme (sayfalama destekli)
const getCars = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const cars = await Car.find({})
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Araçlar alınamadı', error });
    }
};

// ❌ Araç silme
const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Car.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Araç bulunamadı' });

        res.status(200).json({ message: 'Araç silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Silme işlemi başarısız', error });
    }
};

// ✏️ Araç güncelleme (isteğe bağlı görsel değişimi)
const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, brand, modelYear, price, description } = req.body;

        const updatedData = {
            title,
            brand,
            modelYear: parseInt(modelYear),
            price: parseFloat(price.toString().replace(',', '.')),
            description,
        };

        if (req.file) {
            updatedData.image = req.file.path.replace(/\\/g, '/');
        }

        const updatedCar = await Car.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedCar) {
            return res.status(404).json({ message: 'Araç bulunamadı' });
        }

        res.status(200).json(updatedCar);
    } catch (error) {
        console.error('🛠️ Güncelleme hatası:', error);
        res.status(500).json({ message: 'Araç güncellenemedi', error: error.message });
    }
};

// ⭐ Favori ekle/kaldır
const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await Car.findById(id);
        if (!car) return res.status(404).json({ message: 'Araç bulunamadı' });

        car.isFavorite = !car.isFavorite;
        await car.save();

        res.status(200).json({ message: 'Favori durumu güncellendi', car });
    } catch (error) {
        res.status(500).json({ message: 'Favori güncellenemedi', error });
    }
};

// ❤️ Favori araçları listele
const getFavoriteCars = async (req, res) => {
    try {
        const favorites = await Car.find({ isFavorite: true }).sort({ createdAt: -1 });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(500).json({ message: 'Favori araçlar alınamadı', error });
    }
};

// 🧹 Eski araçları sil (1 yıldan eski)
const deleteOldCars = async (req, res) => {
    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        await Car.deleteMany({ createdAt: { $lt: oneYearAgo } });
        res.status(200).json({ message: 'Eski araçlar silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Silme hatası', error });
    }
};

module.exports = {
    addCar,
    getCarImage,
    getCars,
    deleteCar,
    updateCar,
    toggleFavorite,
    getFavoriteCars,
    deleteOldCars,
};
