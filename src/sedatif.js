const fs = require('fs');

function listAllFiles(){
    fs.readdir(process.env.FILE_DIRECTORY, function (err, dir) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files in /SEDATIF
        dir.forEach(function (subDir) {
            // If is a folder
            if(fs.lstatSync(`${process.env.FILE_DIRECTORY}/${subDir}`).isDirectory()){
                fs.readdir(`${process.env.FILE_DIRECTORY}/${subDir}`, function(err, files) {
                    if (err) {
                        return console.log('Unable to scan directory: ' + err);
                    }
                    files.forEach(function(file) {
                      fs.readFile(`${process.env.FILE_DIRECTORY}/${subDir}/${file}`, 'utf8' , (err, data) => {
                        if (err) {
                          console.error(err)
                          return
                        }
                        console.log(data)
                      })
                    });
                });
            }
        });
    });
}

function sedatif(){
    listAllFiles()
    return "Hello World !"
}

module.exports = { sedatif }