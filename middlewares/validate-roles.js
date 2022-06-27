const { request, response } = require("express");



const isAdminRole = (req = request, res = response, next) => {

    if ( !req.user ) {
        return res.status(500).json({
            msg: 'Verification Role before verify JWT, It is not permitted'
        });
    };

    const { role, name } = req.user;
    if ( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: ` ${name} is not Admin rol`
        });
    };


    next();
}

const haveRole = (...roles) => {

    return (req = request, res = response, next) => {

        if ( !req.user ) {
            return res.status(500).json({
                msg: 'Verification Role before verify JWT, It is not permitted'
            });
        };
        
        if (!roles.includes(req.user.role)){
            return res.status(401).json({
                msg: ` The service require one of this: ${roles}`
            });
        }

        next();
    };

};

module.exports = {
    isAdminRole,
    haveRole
};

