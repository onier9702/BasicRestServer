
const {Router} = require('express');
const { check } = require('express-validator');


const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validateFields');
const { isAdminRole } = require('../middlewares/validate-roles');
const { createCategory, getCategoryByID, getAllCategories, deleteOneCategory, updatingCategory } = require('../controllers/categories');
const { existsCategory } = require('../helpers/db-validators');


const router = Router();
/*
    These routes will have this path: 
    /api/categories/
*/

// Getting all categories - it is public
router.get('/categories', getAllCategories );

// Getting a category by id - it is public as well
router.get('/:id', [
    check('id', 'This is not a mongo ID').isMongoId(),
    check('id').custom( existsCategory ),
    validateFields
    ],
    getCategoryByID
);

// Create category, any user with a valid token - it is private
router.post('/', [
    validateJWT,
    check('name', 'Check, name is required' ).not().isEmpty(),
    // check( ),
    validateFields
    ],
    createCategory
);

// Update a register by id, any user with a valid token - private
router.put('/:id', [
    validateJWT,
    check('id', 'This is not a mongo ID').isMongoId(),
    check('id').custom( existsCategory ),
    validateFields
    ],
    updatingCategory
);

// Delete a category - private- just an Admin user
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'This is not a mongo ID').isMongoId(),
    check('id').custom( existsCategory ),
    validateFields
    ],
    deleteOneCategory
);


module.exports = router;
