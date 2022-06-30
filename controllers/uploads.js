
const { response } = require('express');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { uploadFILE } = require('../helpers');
const { User, Product } = require('../models');


const loadFile = ( req, res = response ) => {

    try {
        
        const nameFile = await uploadFILE( req.files, undefined, 'imgs' );
        res.status(200).json({ nameFile });

    } catch (msg) {
        res.status(400).json({msg});
    };
};


const updateImage = async(req, res = response) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if( !model ){
                return res.status(400).json({ msg: `User ID: ${id} does not exists` });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if( !model ){
                return res.status(400).json({ msg: `Product ID: ${id} does not exists` });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }

    // cleaning preview images
    if (model.img){
        // delete img from server to avoid duplicates
        const pathImg = path(__dirname, '../uploads', collection, model.img);
        if ( fs.existsSync(pathName) ){
            fs.unlinkSync(pathImg);      // Delete the last image
        }

    }

    const nameFile = await uploadFILE( req.files, undefined, collection );
    model.img = nameFile;   // img added

    await model.save();   // save img on database

    res.status(200).json({
        model
    });
};

const updateImageCloudinary = async(req, res = response) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if( !model ){
                return res.status(400).json({ msg: `User ID: ${id} does not exists` });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if( !model ){
                return res.status(400).json({ msg: `Product ID: ${id} does not exists` });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }

    // cleaning preview images
    if (model.img){
        // delete img from server to avoid duplicates
        const nameArr = model.img.split('/');
        const name    = nameArr[ nameArr.length - 1 ];
        const [ public_id ]    = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    // Upload image to cloudinary
    const { tempFilePath } = req.files.file; // file uploaded for user
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

    model.img = secure_url;   // img added

    await model.save();   // save img on database

    res.status(200).json({
        model
    });
};

// controller show up an image
const showImage = async( req, res = response ) => {

    const { collection, id } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if( !model ){
                return res.status(400).json({ msg: `User ID: ${id} does not exists` });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if( !model ){
                return res.status(400).json({ msg: `Product ID: ${id} does not exists` });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'I forgot to validate this' });
    }

    // checking if exists any image
    if (model.img){
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if ( fs.existsSync(pathImg) ){
            return res.sendFile(pathImg);
        };
    };

    const pathNotFoundImg = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathNotFoundImg);

};

module.exports = {
    loadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}
