const   express   = require('express'),
        router    = express.Router(),
        UserCtrl  = require('../controllers/user'),
        multer = require('multer');


const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif'  )
        cb(null, true);
    else
        return cb(new Error('Only JPEG/JPG/GIF/PNG is allowed!'), false);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '../public/img/')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now()+ '.'+ext)
    }
});

const upload = multer({storage: storage, fileFilter: fileFilter});
const singleUpload = upload.single('profile');


router.post('/profile-upload', UserCtrl.authMiddleware, function(req, res){
    singleUpload(req, res, function(err){
    if (err)
    {
        console.log(err)
        return res.status(200).send({errors: [{title: 'Invalid file type', detail: err.message}]})
    }
    return res.json({'imageUrl': req.file.filename});
    });
});

router.post('/image-upload', UserCtrl.authMiddleware, upload.any(), function(req, res, err){
    res.send(req.files);
})
module.exports = router;