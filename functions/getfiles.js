const fs = require('fs');
const path = require('path');
const async = require('async');
const mime = require('mime/lite');
mime.define({
    'application/micrsoft-word-file': ['docx'],
    'application/microsoft-excel-file': ['xlsx']
}, true);

const getFiles = (url) => {
    return new Promise((resolve, reject) => {
        async.waterfall([
            function(callback) {
                readdir(url).then(result => callback(null, result)).catch(error => reject(error));
            },
            function(resultArray, callback) {
                filter({url: url, array: resultArray}).then(result => callback(null, result));
            },
            function(filteredArray, callback) {
                map({url: url, array: filteredArray}).then(result => callback(null, result));
            }
        ], (error, result) => {
            resolve({url: url, files: result});
        });
    })
}

const map = (param) => {
    return new Promise((resolve) => {
        async.map(param.array, function(element, callback){
            fs.stat(path.join(param.url, element), (error, stats) => {
                callback(null, construct({file: element, metadata: stats}));
            })
        }, (error, result) => {
            resolve(result);
        })
    })
}

const filter = (param) => {
    return new Promise((resolve, reject) => {
        async.filter(param.array, function(filePath, callback) {
            fs.stat(path.join(param.url, filePath), (error, stats) => {
                const dir = !stats.isDirectory();
                callback(null, dir);
            })
        }, (error, results) => {
            if(error) {
                reject(error);
            }
            resolve(results);
        });
    });
}

const readdir = (url) => {
    return new Promise((resolve, reject) => {
        fs.readdir(url, (error, resultArray) => {
            if(error) {
                reject(error);
            }
            resolve(resultArray);
        })
    })
}

const construct = (param) => {
    return {
        filename: path.basename(param.file),
        size: parseSize(param.metadata.size),
        filetype: mime.getType(param.file),
    }

}

const parseSize = (size) => {
    const filesize = Math.round(size / 1000);
    if(Math.round(filesize) < 1) {
        return '1 Kilobyte';
    } else if(filesize < 1000) {
        return filesize.toString().concat(' Kilobytes')
    } else if(filesize >= 1000 && filesize <= 1000000 ) {
        return Math.round(filesize / 1000).toString().concat(' Megabytes');
    } else if (filesize > 1000000 && filesize <= 1000000000) {
        return (filesize/ 1000000).toPrecision(3).concat(' Gigabytes');
    }
}

module.exports = getFiles;
