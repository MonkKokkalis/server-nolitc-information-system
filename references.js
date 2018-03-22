// check if Directory exists

//    const checkDirectory = new Promise((resolve, reject) => {
//         fs.access(path.join(__dirname), (err) => {
//             if(err) {
//                 reject(err);
//             }
//             resolve('Directory exists');
//         })
//    })
//    checkDirectory.then((data) => {
//         res.status(200).json({message: data})
//    })
//    .catch((error) => {
//         res.status(401).json({error: error})
//    })


// fs.readdir

// fs.readdir(
//     path.join(
//         path.parse(__dirname).root, 'files'
//     ), { encoding: 'utf-8' }, (error, files) => {
//         console.log(files);
//     }
// )

const readDir = (url) => {
    return new Promise((resolve, reject) => {
        fs.readdir(url, { encoding: 'utf-8' }, (error, filesArray) => {
            const result = {
                files: [],
                directories: []
            }
            const fileWalker = target => {
                //    if (fs.statSync(path.join(url,target)).isDirectory()) {
                //        result.directories.push(target)
                //    } else {
                //        result.files.push(target);
                //    }
                statAsync(path.join(url, target)).then(
                    isDirectory => {
                        if (isDirectory) {
                            result.directories.push(target)
                        } else {
                            result.files.push(target);
                        }
                    }
                )
            }
            filesArray.forEach(fileWalker);
            if (error) {
                reject(error);
            }
            resolve(result);
        })
    })
}
















// return new Promise((resolve, reject) => {
//     // const stat = fs.stat(filePath, (error, stats) => {
//     //     if(error) {
//     //         reject(error);
//     //     }
//     //     if(stats.isDirectory()) {
//     //         resolve(filePath)
//     //     }
//     // })
//     const stat = filePath => {
//         return new Promise((resolve, reject) => {
//             fs.stat(path.join(params.url, filePath), (error, stats) => {
//                 if (error) {
//                     reject(error)
//                 }
//                 if (!stats.isDirectory()) {
//                     resolve(filePath)
//                 } else {
//                     resolve('directory')
//                 }
//             })
//         })
//     }
//     resolve(params.resultArray.forEach(stat));
// })  


// const stat = (filePath) => {
//     return new Promise((resolve, reject) => {
//         const filesArray = [];
//         fs.stat(path.join(url, filePath), (error, stats) => {
//             console.log('called stat')
//             if (stats.isDirectory()) {
//                 resolve(true)
//             } else {
//                 resolve(false)
//             }
//         })
//     })

