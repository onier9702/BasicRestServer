
const {Router} = require('express');
const { check } = require('express-validator');

const { loadFile, updateImage, showImage, updateImageCloudinary } = require('../controllers/uploads');
const { allowedCollections } = require('../helpers');
const { validateFields, validateFile } = require('../middlewares');

const router = Router();

// uploading new resource(file, img , excel, csv or any) to server
router.post('/', validateFile, loadFile );

// update an image
router.put('/:collection/:id', [
    validateFile,
    check('id', 'This is not a mongo ID').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'products'] ) ),
    validateFields 
], updateImageCloudinary );
// ], updateImage );


// getting an image
router.get('/:collection/:id', [
    check('id', 'This is not a mongo ID').isMongoId(),
    check('collection').custom( c => allowedCollections( c, ['users', 'products'] ) ),
    validateFields
] , showImage)

module.exports = router;

