
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFILE = (files, validExtensions = ['jpg', 'jpeg', 'png', 'gif'], folder = '') => {

    return new Promise( (resolve, reject) => {

        const { file } = files;
        const cutFile = file.name.split('.');
        const extension = cutFile[cutFile.length - 1];
    
        if ( !validExtensions.includes(extension) ){
            return reject(`Extension ${extension} is not valid, just this [ ${validExtensions} ] are valid`);
        };
    
        const temporaryName = uuidv4() + '.' + extension;
      
        const uploadPath = path.join(__dirname, '../uploads/', folder, temporaryName);
      
        file.mv(uploadPath, (err) => {
    
            if (err) {
                reject(err);
            };
      
            resolve( temporaryName );
        });

    } );

};


module.exports = {
    uploadFILE
}
