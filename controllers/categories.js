const { response } = require('express');
const Category = require('../models/category');
const User = require('../models/user');


// Get all categories, pages, total - populate
const getAllCategories = async(req, res = response) => {

    const { limit = 3, since  } = req.query;

    const query = {state: true};

    // categories = await Category.find(query);

    const [ total, categories ] = await Promise.all([ 
        Category.countDocuments(query),
        Category.find(query)
                .populate('user', 'name')
                .skip(since)
                .limit(limit)
    ]);

    res.status(200).json({
        total,
        categories
    })


};

// Get Cat by ID
const getCategoryByID = async( req, res = response ) => {

    const {id} = req.params;

    const categoryDB = await Category.findById(id);
                                        

    if(!categoryDB.state){
        return res.status(401).json({
            msg: 'The category was deleted - state: false'
        });
    };

    res.status(200).json({
        category: categoryDB,
    })

};

// Creating Category  
const createCategory = async(req, res = response) => {

    const name = req.body.name.toUpperCase();

    const categoryDB = await Category.findOne({ name });

    if ( categoryDB ) {
        return res.status(400).json({
            msg: `The category ${categoryDB.name} already exists on database`
        });
    };

    // Generate Data
    const data = {
        name,
        user: req.user._id
    };

    const category = new Category(data);

    // Save on DB
    await category.save();

    res.status(201).json({category});
};

// updatingCategory
const updatingCategory = async(req, res = response) => {

    const {id} = req.params;

    const { state, user , ...data} = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const categ = await Category.findByIdAndUpdate(id, data, {new: true});

    res.status(200).json({
        category: categ
    })
};

// Deleting category by ID
const deleteOneCategory = async(req , res =  response) => {

    const {id} = req.params;
    
        // delete user physically from DB
        // const userDeleted = await User.findByIdAndDelete(id);
    
        // Deleting not physically so changing state to false
        const catDeleted = await Category.findByIdAndUpdate(id, {state: false}, {new: true});
    
        res.json({
            catDeleted
        });
};

module.exports = {
    getAllCategories,
    createCategory,
    getCategoryByID,
    deleteOneCategory,
    updatingCategory
}
