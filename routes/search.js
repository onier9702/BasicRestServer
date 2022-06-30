
const {Router} = require('express');

const { searchController } = require('../controllers/search');
const router = Router();

router.get('/:collection/:terminus', searchController);




module.exports = router;
