const multer = require('multer');

const storage = multer.memoryStorage(); // RAM'e alıyoruz (isteğe göre diske de alabiliriz)

const upload = multer({ storage });

module.exports = upload;
