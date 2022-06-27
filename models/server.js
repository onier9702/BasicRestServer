
const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../db/config');

class Server {
    
    constructor() {

        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';
        this.authPath = '/api/auth';

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

        this.app.use( this.usersPath, require('../routes/user'));
        this.app.use( this.authPath, require('../routes/auth'));
    }

    listen() {
        
        this.app.listen(this.port,  () => {
        console.log(`App listening on port ${this.port}`);
} )
    }

};

module.exports = Server;
