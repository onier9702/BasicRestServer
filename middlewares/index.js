

const validateJWT = require('../middlewares/validate-jwt');
const validateRole = require('../middlewares/validate-roles');
const validateFile = require('../middlewares/validate-uploadFile');
const validateFields = require('../middlewares/validateFields');

module.exports = {
    ...validateJWT,
    ...validateRole,
    ...validateFields,
    ...validateFile,
}
