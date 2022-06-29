
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../db/config');

class Server {
    
    constructor() {

        this.app = express();
        this.port = process.env.PORT;
        this.paths = {
            auth:       '/api/auth',
            categories: '/api/categories',
            products:   '/api/products',
            search:     '/api/search',
            users:      '/api/users'
        }

        // Connect DB
        this.databaseCNN();

        //Middlewares
        this.middlewares();
        //routes

        this.routes();

    }

    async databaseCNN() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );
        // Public Directory
        this.app.use(express.static('public')); // this is the route / 
        // Read and Parse of Body
        this.app.use(express.json()); // any info on Body will be parse and transform to JSON

    }
        
    routes() {

        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.categories, require( '../routes/categories' ));
        this.app.use( this.paths.products, require('../routes/products') );
        this.app.use( this.paths.search, require('../routes/search'));
        this.app.use( this.paths.users, require('../routes/user'));

    }

    listen() {
        
        this.app.listen(this.port,  () => {
        console.log(`App listening on port ${this.port}`);
} )
    }

};

module.exports = Server;
