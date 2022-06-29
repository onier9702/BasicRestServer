
const {Router} = require('express');
const { check } = require('express-validator');

const { searchController } = require('../controllers/search');
const router = Router();

router.get('/:collection/:terminus', searchController);




module.exports = router;
