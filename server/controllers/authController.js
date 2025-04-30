const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Kullanıcı kaydı (signup)
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Email ve kullanıcı adı kontrolü
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Bu e-posta zaten kullanılıyor.' });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
        }

        // Yeni kullanıcı oluştur
        const user = new User({
            username,
            email,
            password
        });

        // Kullanıcıyı kaydet
        await user.save();

        // Token oluştur
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Başarılı kayıt yanıtı
        res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.', token });
    } catch (error) {
        console.error('Kullanıcı kaydı hatası:', error);
        res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }
};

// Kullanıcı girişi (login)
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // E-posta kontrolü
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Şifreyi doğrulama
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Yanlış şifre.' });
        }

        // Token oluştur
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Başarılı giriş yanıtı
        res.status(200).json({ message: 'Giriş başarılı.', token });
    } catch (error) {
        console.error('Kullanıcı girişi hatası:', error);
        res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }
};

// Kullanıcıyı tek tek almak
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Kullanıcı profil hatası:', error);
        res.status(500).json({ message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
