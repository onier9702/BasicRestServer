
const Role = require('../models/role');
const User = require('../models/user');
const Category = require('../models/category');
const Product = require('../models/product');



const isValidRole =  async(role = '') => {

    console.log('Inside isValidRole');
    const existsRole = await Role.findOne({role});
    if (!existsRole) {
        throw new Error(`Rol ${role} not registered on database`);
    }
};

const emailExists = async(email = '') => {

    // verify if email already exists
    const emailExists = await User.findOne({email});
    if (emailExists) {
        throw new Error(` ${email} is already registered`);
    }
};

const idExists = async(id = '') => {

    const idExists = await User.findById(id);
    if (!idExists) {
        throw new Error(` This user id not exists`);
    }
};

const existsCategory = async( id = '' ) => {

    const category = await Category.findById(id);

    if ( !category ){
        throw new Error('That category does not exists on database -getting category by id');
    };
};

const existsProduct = async( id = '' ) => {

    const category = await Product.findById(id);

    if ( !category ){
        throw new Error('That Product does not exists on database -getting Product by id');
    };
};

// Validate allowed collections
const allowedCollections = ( collection = '', arrColl = [] ) => {

    const isIn = arrColl.includes(collection);

    if ( !isIn ){
        throw new Error(`Error, allowed collections are these [ ${arrColl} ]`);
    };

    return true;

}

module.exports = {
    isValidRole,
    emailExists,
    idExists,
    existsCategory,
    existsProduct,
    allowedCollections
}