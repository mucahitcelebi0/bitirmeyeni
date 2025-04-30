const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Parola şifreleme için bcryptjs

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Şifreyi kaydetmeden önce şifreyi hash'lemek için bir middleware ekliyoruz
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();  // Parola değişmemişse işlem yapma
    try {
        const salt = await bcrypt.genSalt(10);  // 10 turda salt oluştur
        this.password = await bcrypt.hash(this.password, salt);  // Şifreyi hashle
        next();
    } catch (err) {
        next(err);  // Hata varsa next() ile hatayı geç
    }
});

// Şifreyi doğrulamak için bir metot ekliyoruz
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);  // Girilen şifreyi hash'le ve karşılaştır
};

module.exports = mongoose.model('User', userSchema);
