const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    modelYear: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, trim: true },
    image: { type: String }, // Yalnızca dosya yolu (örnek: uploads/123.jpg)
    isFavorite: { type: Boolean, default: false }
}, { timestamps: true });

// 🔒 Aynı verinin tekrar girilmesini engelleyen kombinasyon
CarSchema.index(
    { title: 1, brand: 1, modelYear: 1, price: 1 },
    { unique: true }
);

// 📉 En yeni kayıtlar en üstte gelsin
CarSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Car', CarSchema);
