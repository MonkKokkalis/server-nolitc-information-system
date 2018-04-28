const async = require('async');
const fs = require('fs');
const path = require('path');
const rootPath = path.join(path.parse(__dirname).root, 'files');
const createDirectory = (fullname) => {
    return new Promise((resolve, reject) => {
        async.waterfall([
            function (callback) {
                create(fullname).then(result => callback(null, result))
                    .catch(error => reject(`create user directory error ${error}`))
            },
            function(directory, callback) {
                createSubDirectory(directory).then(result => callback(null, result));
            }
        ], (error, result) => resolve(result));
    })
}

const create = (fullname) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(path.join(rootPath, `${fullname.firstname} ${fullname.lastname}`),
        (error) => {
            if(error) {
                reject(error);
            }
            resolve(path.join(rootPath, `${fullname.firstname} ${fullname.lastname}`));
        });
    })
}

const createSubDirectory = (dir) => {
    return new Promise((resolve, reject) => {
        async.parallel([
            function(callback){
                fs.mkdir(path.join(dir,'private'),
                () => callback(null, 'private folder created'))
            },
            function (callback) {
                fs.mkdir(path.join(dir, 'public'),
                () => callback(null, 'public folder created'))
            },
            function (callback) {
                fs.mkdir(path.join(dir, 'protected'),
                () => callback(null, 'protected folder created'))
            }
        ], (error, result) => {
            if(error) {
                reject(error);
            }
            resolve(result);
        })
    })
}

module.exports = createDirectory;