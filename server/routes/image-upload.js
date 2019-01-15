const   express   = require('express'),
        router    = express.Router(),
        UserCtrl  = require('../controllers/user'),
        multer = require('multer');


const fileFilter = (req, file, cb) => {
    console.log("ok")
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/gif'  )
        cb(null, true);
    else
        return cb(new Error('Only JPEG/JPG/GIF/PNG is allowed!'), false);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("ok 1")
      cb(null, '../public/img/')
    },
    filename: (req, file, cb) => {
        console.log("ok 2")
        const ext = file.mimetype.split('/')[1];
        cb(null, file.fieldname + '-' + Date.now()+ '.'+ext)
    }
});

const upload = multer({storage: storage, fileFilter: fileFilter});
const singleUpload = upload.single('image');

router.post('/image-upload', UserCtrl.authMiddleware, function(req, res){
    singleUpload(req, res, function(err){
    if (err)
    {
        return res.status(422).send({errors: [{title: 'Invalid file type', detail: err.message}]})
    }
    return res.json({'message': 'File uploaded successfully'});
    });
});

module.exports = router;