
const Role = require('../models/role');
const User = require('../models/user');



const isValidRole =  async(role = '') => {
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

module.exports = {
    isValidRole,
    emailExists,
    idExists
}