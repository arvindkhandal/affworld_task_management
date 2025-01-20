const multer = require("multer");

const storage = multer.memoryStorage(); // Use memory storage for multer

const upload = multer({ storage });

module.exports = upload;
