const async = require('async');
const fs = require('fs');
const path = require('path');
const checkDirectory = (url, directory) => {
    return new Promise((resolve, reject) => {
        fs.readdir(url, (error, resultArray) => {
            async.some(resultArray, function (element, callback) {
                if (element === directory) {
                    callback(null, true);
                }else {
                    callback(null, false);
                }
            }, (error, result) => {
                if (!result) {
                    fs.mkdir(path.join(url, directory), function (error){
                        if (error) {
                            reject(error);
                        }
                        resolve('directorty created successfully');
                    });
                }
                resolve('the files were uploaded succesfully');
            });
        })  
    })
}

module.exports = checkDirectory;