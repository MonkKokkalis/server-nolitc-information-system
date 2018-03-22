const fs = require('fs');
const path = require('path');
const functions = {
    getFiles: function(url) {
        return new Promise((resolve, reject) => {
            resolve(readDir(url).then(result => {
                return {
                    url: url,
                    files: result.files.filter(element => {
                        return path.extname(element).length > 1;
                    })
                }
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
            resolve({
                url: url,
                files: resultArray
            })
        })
    })
}




module.exports = functions;