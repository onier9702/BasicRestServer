
const {Router} = require('express');
const { check } = require('express-validator');

const { getAllProducts, createProduct, getOneProductById, updatingProductById, deletingProductById } = require('../controllers/products');
const { existsProduct, existsCategory } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole } = require('../middlewares/validate-roles');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

/*
    These routes will have this path: 
    /api/products/
*/

// Getting All products -public
router.get('/', getAllProducts);

// Get one Product by Id -public
router.get('/:id', [
    check('id', 'The id does not belong to mongo').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields,
    ],
    getOneProductById
);

// Create a product - private
router.post('/new', [
    validateJWT,
    check( 'name', 'You have to enter a Product Name oligated' ).not().isEmpty(),
    check('category', 'This Id category is not a  mongo Id').isMongoId(),
    check('category').custom( existsCategory ),
    validateFields,
    ],
    createProduct
);

// Update a product -private
router.put('/:id', [
    validateJWT,
    check('id', 'The id does not belong to mongo').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
    ],
    updatingProductById
);

// deleteing Product by Id -private
router.delete('/:id', [
    validateJWT,
    check('id', 'The id does not belong to mongo').isMongoId(),
    check('id').custom( existsProduct ),
    validateFields
    ],
    deletingProductById
)


module.exports = router;
