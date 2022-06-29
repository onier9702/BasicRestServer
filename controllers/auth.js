
const { response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

const generateJWT = require('../helpers/generate-jwt');
const googleVerifyToken = require('../helpers/google-verify');

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

const googleSignIn = async(req, res = response) => {

    const {id_token} = req.body;

    try {

        const { email, name, picture:img } = await googleVerifyToken(id_token);

        let user = await User.findOne({email});

        if (!user){
            // you have to create an user
            const data = {
                name,
                email,
                img,
                password: '',
                google: true
            };

            user = new User(data);

            await user.save();
        };

        // if state user is false
        if (!user.state){
            return res.status(401).json({
                msg: 'Contact Admin -user was blocked or deleted'
            });
        };

        // Generate JWT
        const token = await generateJWT(user.id);


        res.json({
            user,
            token
        });
    } catch (error) {
        res.status(400).json({
            msg: 'Google Token unrecognized'
        });
    }


};

module.exports = {
    login,
    googleSignIn
}
