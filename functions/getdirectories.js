const fs = require('fs');
const async = require('async');
const getDirectories = (url) => {
    return new Promise(resolve => {
        fs.readdir(url, (error, directories) => {
           async.reject(directories, (dir, callback) => {
                callback(null, dir === 'registrar');
           }, (error, result) => {
               resolve(result);
           })
        })
    })
}

module.exports = getDirectories;