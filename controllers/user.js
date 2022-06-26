const {response} = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

//?retryWrites=true&w=majority

const getUser = async(req, res = response) => {

    // const {q, name, age, page = 1 } = req.query;

    const {limit = 5, since = 0} = req.query;
    const query = {state: true};
    // const users = await User.find(query)
    //     .skip(since)
    //     .limit(limit)

    // const total = await User.countDocuments();

    const [ total, users ] = await Promise.all([ 
        User.countDocuments(),                      // return amount of documents exists 
        User.find(query)
            .skip(since)
            .limit(limit)
    ])

    res.json({
        total,
        users
    });
}
const postUser = async(req, res = response) => {

    try {

        const {name, email, password, role} = req.body; 
        const user = new User({name, email, password, role});
    
        // encrypt the password
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync(password, salt);
    
        //save on DB
        await user.save();
    
        res.status(201).json({
            user
        });
        
    } catch (error) {
        console.log(error);
        res.status(501).json({
            ok: false,
            msg: 'Contact Administrator'
        })
    }

}
 const putUser = async(req, res = response) => {

    const {id} = req.params;

    const { _id, password, google, email, ...rest } = req.body;

    // TODO: verify against database

    if(password) {
        // encrypt the password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate( id, rest );

    res.json({
        user
    });
}
const deleteUser = async(req, res = response) => {

    const {id} = req.params;

    // delete user physically from DB
    // const userDeleted = await User.findByIdAndDelete(id);

    // Deleting not physically so changing state to false
    const userDeleted = await User.findByIdAndUpdate(id, {state: false});

    res.json({
        userDeleted
    });
}

module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser
}
