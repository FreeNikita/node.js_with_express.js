const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cd) {
        cd(null, new Date().toISOString() + '_' + file.originalname)
    }
})

const allowedType = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
    if(!allowedType.includes(file.mimeType)){
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const fileMiddleware = multer({
    storage,
    fileFilter
})

module.exports = {
    fileMiddleware
}