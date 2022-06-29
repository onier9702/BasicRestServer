
const { response } = require('express');
const Product = require('../models/product');

const getAllProducts = async(req, res = response) => {

    const { limit, since } = req.query;

    const query = { state: true };

    const [ total, products ] = await Promise.all( [
        Product.countDocuments(query),
        Product.find(query)
                .populate('user', 'name')
                .populate('category', 'name')
                .skip(since)
                .limit(limit)
    ] );


    res.status(200).json({
        total,
        products
    })
};

const getOneProductById = async(req, res = response) => {

    const {id} = req.params;

    const existProduct = await Product.findById(id)
                                .populate('user', 'name')
                                .populate('category', 'name');

    if (  !existProduct ){
        return res.status(400).json({
            msg: 'The id does not exist on database'
        });
    };

    if ( !existProduct.state ){
        return res.status(400).json({
            msg: `The product with Id: ${id} was deleted or blocked`
        });
    };

    res.status(200).json({
        product: existProduct
    });

};

const createProduct = async(req , res = response) => {

    const { name, user, state, ...body } = req.body;

    const test = await Product.findOne({name});

    if (test){
        return res.status(400).json({
            msg: `The Product ${name} already exists`
        });
    };

    const data = {
        ...body,
        name: name.toUpperCase(),
        user: req.user._id,
    };

    const product = new Product(data);

    await product.save();

    res.status(201).json({
        product
    });
};

const updatingProductById = async(req, res = response) => {

    const {id} = req.params;
    const { state, user, ...rest } = req.body;

    if(rest.name){
        rest.name = rest.name.toUpperCase();
    };
    rest.user = req.user._id;


    const product = await Product.findByIdAndUpdate(id, rest, {new: true});

    res.status(200).json({
        product
    });

};

const deletingProductById = async(req, res = response) => {

    const {id} = req.params;

    const prod = await Product.findById(id); // this is the id of the product > user
    const userId = req.user._id;

    // const prodArr = [prod];
    // const k = prodArr.split('"');
    // console.log(k);

    if ( user.contains(userId) ){
        return res.status(401).json({
            msg: 'You do not have permission to delete this Product '
        });
    };

    const product = await Product.findByIdAndUpdate(id, {state: false}, {new: true});

    res.status(200).json({
        product
    });

};

module.exports = {
    getAllProducts,
    createProduct,
    getOneProductById,
    updatingProductById,
    deletingProductById
}
