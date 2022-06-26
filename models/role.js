
const {Schema, model} = require('mongoose');


const roleShema = Schema({

    role: {
        type: String,
        required: [true, 'Role is obligated']
    }

});


module.exports = model('roles', roleShema);



