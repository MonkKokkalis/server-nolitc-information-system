const fs = require('fs');
const path = require('path');
const async = require('async');
const mime = require('mime/lite');
mime.define({
    'application/micrsoft-word-file': ['docx'],
    'application/microsoft-excel-file': ['xlsx']
}, true)
const functions = {
    getFiles: function(url) {
        return new Promise((resolve, reject) => {
            resolve(readDir(url).then(result => {
                let files = result.filter(element => {
                    return path.extname(element).length > 1;
                })
                .map((element => {
                    return url.concat('/', element);
                }))    
                return new Promise((resolve, reject) => {
                   async.map(files, fs.stat, function (error, result) {
                        resolve(construct({
                                files: files,
                                stats: result
                            })
                        )
                   })
                })
            }))
        })
    }
}

const readDir = (url) => {
    return new Promise((resolve, reject) => {
        fs.readdir(url, (error, resultArray) => {
            if(error) {
                reject(error)
            }
            resolve(resultArray);
        })
    })
}

const construct = (params) => {
    const result = [];
    for(let i = 0; i < params.files.length; i++) {
        result.push ({
            filename: path.basename(params.files[i]),
            size: parseSize(params.stats[i].size),
            filetype: mime.getType(params.files[i]),
            url: params.files[i]
        })
    }
    return result;
}

const parseSize = (size) => {
    // const length = size.toString().length;
    // let filesize = size.toString();
    // if(filesize.length > 3) {
    //     filesize = filesize.substr(0, 3);
    // }
    // if(length < 3) {
    //     return filesize.concat(' Bytes');
    // } else if(length >= 3 && length <=6 ) {
    //     return filesize.concat(' Kilobytes');
    // } else if(length >= 7 && length <= 9) {
    //     return filesize.concat(' Megabytes');
    // }
    let filesize = Math.round(size / 1000);
   
    if(Math.round(filesize) < 1) {
        return '1 Kilobyte';
    } else if(filesize < 1000) {
        return filesize.toString().concat(' Kilobytes')
    } else if(filesize >= 1000 && filesize <= 1000000 ) {
        return Math.round(filesize / 1000).toString().concat(' Megabytes');
    } else if (filesize > 1000000 && filesize <= 1000000000) {
        return (filesize/ 1000000).toPrecision(3).concat(' Gigabytes');
    }
    // return filesize;   
}
module.exports = functions;