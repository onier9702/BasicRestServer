
const { response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const generateJWT = require('../helpers/generate-jwt');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        const user = await User.findOne( {email} );
        // verify if email exists
        if (!user) {
            return res.status(400).json({
                msg: 'User / Password are not valid -email'
            })
        };
        // verify if user is active on DB
        if (!user.state) {
            return res.status(400).json({
                msg: 'User / Password are not valid -state: false'
            })
        };
        // verify if password is correct
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'User / Password are not valid -password'
            })
        }
        //verify JWT
        const token = await generateJWT(user.id);

        res.status(200).json({
            user,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Something was wrong, please contact Admin'
        })
    }

    

};



module.exports = {
    login,
}
