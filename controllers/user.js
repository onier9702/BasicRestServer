const {response} = require('express');

const getUser = (req, res = response) => {

    const {q, name, age, page = 1 } = req.query;

    res.json({
        ok: true,
        msg: 'get api',
        name,
        age,
        q,
        page
    });
}
const postUser = (req, res = response) => {

    const body = req.body; 


    res.status(201).json({
        ok: true,
        msg: 'post api',
        body
    });
}
 const putUser = (req, res = response) => {

    const {id} = req.params;

    res.json({
        ok: true,
        msg: 'put api',
        id
    });
}
const deleteUser = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'delete api'
    });
}

module.exports = {
    getUser,
    postUser,
    putUser,
    deleteUser
}
