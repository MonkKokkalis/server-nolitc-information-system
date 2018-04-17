const fs = require('fs');
const path = require('path');
const async = require('async');
const mime = require('mime/lite');
mime.define({
    'application/micrsoft-word-file': ['docx'],
    'application/microsoft-excel-file': ['xlsx'],
    'audio/mp3': ['mp3'],
    'image/psd': ['psd']
}, true);

const getAllFiles = (url) => {
    return new Promise((resolve, reject) => {
        async.waterfall([
            function (callback) {
                readdir(url).then(result => callback(null, result))
                    .catch(error => reject(error));
            },
            function (resultArray, callback) {
                filter({ url: url, array: resultArray }).then(result => callback(null, result));
            },
            function (filteredArray, callback) {
                reduce({ url: url, array: filteredArray }).then(result => callback(null, result));
            },
            function (reducedArray, callback) {
                stat(reducedArray).then(result => callback(null, result));
            },
            function(statArray, callback) {
                sort(statArray).then(result => callback(null, result));
            },
            function (sortedArray, callback) {
                group(sortedArray).then(result => callback(null, result));
            }
        ], (error, result) => resolve(result));
    })
}

const sort = (statArray) => {
    return new Promise((resolve) => {
        async.sortBy(statArray, function(element, callback){
            callback(null, element.filename.toLowerCase());
        }, (error, result) => {
            resolve(result);
        })
    })
}

const group = (mappedArray) => {
    return new Promise((resolve) => {
        let iterations = Math.trunc(mappedArray.length / 5);
        if((mappedArray.length % 5) > 0) {
            iterations += 1;
        }
        async.times(iterations, function (index, next) {
            next(null, mappedArray.slice(index * 5, (index + 1) * 5))
        }, function (error, result) {
            resolve(result);
        })
    })
}

const stat = (array) => {
    return new Promise((resolve) => {
        async.map(array, function (element, callback) {
            fs.stat(element, (error, stats) => {
                callback(null, construct({ file: element, metadata: stats }));
            })
        }, (error, result) => {
            resolve(result);
        })
    })
}

const construct = (param) => {
    console.log(mime.getType(param.file));
    return {
        filename: path.basename(param.file),
        size: parseSize(param.metadata.size),
        filetype: mime.getType(param.file),
        downloadUrl: param.file
    }
}

const parseSize = (size) => {
    const filesize = Math.round(size / 1000);
    if (Math.round(filesize) < 1) {
        return '1 Kilobyte';
    } else if (filesize < 1000) {
        return filesize.toString().concat(' Kilobytes')
    } else if (filesize >= 1000 && filesize <= 1000000) {
        return Math.round(filesize / 1000).toString().concat(' Megabytes');
    } else if (filesize > 1000000 && filesize <= 1000000000) {
        return (filesize / 1000000).toPrecision(3).concat(' Gigabytes');
    }
}



const readdir = (url) => {
    return new Promise((resolve, reject) => {
        fs.readdir(url, (error, resultArray) => {
            if (error) {
                reject(error);
            }
            resolve(resultArray);
        })
    })
}

const filter = (param) => {
    return new Promise((resolve, reject) => {
        async.filter(param.array, function (filePath, callback) {
            fs.stat(path.join(param.url, filePath), (error, stats) => {
                const dir = stats.isDirectory();
                callback(null, dir);
            })
        }, (error, results) => {
            if (error) {
                reject(error);
            }
            resolve(results);
        });
    });
}

const reduce = (param) => {
    return new Promise((resolve) => {
        async.reduce(param.array, [], function (accumulator, current, callback) {
            readdir(path.join(param.url, current))
                .then(resultArray =>
                    map({ url: path.join(param.url, current), array: resultArray }))
                .then(result => callback(null, [...accumulator, ...result]))
        }, (error, result) => {
            resolve(result);
        })
    })
}

const map = (param) => {
    return new Promise((resolve) => {
        async.map(param.array, function (element, callback) {
            callback(null, path.join(param.url, element));
        }, (error, result) => {
            resolve(result);
        })
    })
}


module.exports = getAllFiles;
