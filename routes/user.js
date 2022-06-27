
const {Router} = require('express');
const { check } = require('express-validator');
// const bodyParser = require('body-parser');

const { getUser, postUser, putUser, deleteUser } = require('../controllers/user');
const { isValidRole, emailExists, idExists } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares/validate-jwt');
const { isAdminRole, haveRole } = require('../middlewares/validate-roles');
const { validateFields } = require('../middlewares/validateFields');

const router = Router();

// To parse body to json and avoid that error
// const jsonParser = bodyParser.json();

router.get('/',
            // jsonParser,
            getUser);


router.post('/',
            // jsonParser,
            [
                check('name', 'The name is obligated').not().isEmpty(),
                check('email', 'The email is not valid').isEmail(),
                check('email').custom( emailExists ),
                check('password', 'Password shoul have at least 6 characters').isLength({min: 6}),
                // check('role', 'Role not permitted').isIn(['USER_ROLE', 'ADMIN_ROLE']),
                check('role').custom( isValidRole ),
                validateFields
            ]
            , postUser);


router.put('/:id',
            // jsonParser,
            [
                validateJWT,
                check('id', 'It is not a ID valid').isMongoId(),
                check('id').custom( idExists ),
                check('role').custom( isValidRole ),
                validateFields
            ]
            ,putUser);


router.delete('/:id', 
            // jsonParser,
            [
                validateJWT,
                // isAdminRole,
                haveRole('USER_ROLE','ADMIN_ROLE','SALES_ROLE'),
                check('id', 'It is not a ID valid').isMongoId(),
                check('id').custom( idExists ),
                validateFields
            ]
            ,deleteUser);


module.exports = router;

