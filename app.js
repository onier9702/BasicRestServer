
require('dotenv').config();
const Server = require('./models/server');


const server = new Server();

server.listen();

// Necessary Installations
// npm install <below content>
// 0- nodemoon ( if you already have it , it is not necessary)
// 1- express
// 2- cors
// 3- mongoose 
// 4- express-validator
// 5- bcryptjs
// 15- body-parser
// 6- jsonwebtoken
