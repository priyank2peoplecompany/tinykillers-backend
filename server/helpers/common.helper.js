const fs = require('fs');
const path = require('path');
const CryptoJS = require("crypto-js");
const ffmpeg = require('fluent-ffmpeg');
const Jimp = require("jimp");
let secretKey = 'GYHcLHmk';
const mailer = require('./mail.helper');

/** This function is used for the resize image */
exports.resize_image = (folder, filename) => {
    let extension = path.parse(filename).ext.toLowerCase();// mime.contentType(path.extname(filename));
    if (extension == '.jpeg' || extension == '.jpg' || extension == '.png' || extension == '.gif') {
        Jimp.read(`server/assets/uploads/${folder}/${filename}`).then((img) => {
            try {
                img.resize(Jimp.AUTO, 100).quality(100).write(`server/assets/uploads/thumb/${folder}/${filename}`);
            } catch (err) {
                console.log('ERROR==========>', err);
            }
        }).catch(err => {
            console.log('ERROR==========>', err);
        });
    } else if (extension == '.mp4') {
        let thumbnail_name = path.parse(filename).name;
        console.log("thumbnail_name==========>", thumbnail_name);
        try {
            ffmpeg(`server/assets/uploads/${folder}/${filename}`).screenshots({
                timestamps: ['00:00:01'],
                filename: thumbnail_name + '.jpeg',
                folder: `server/assets/uploads/thumb/${folder}/`,
                size: '1440x?'
            });
        } catch (e) {
            console.log(e.code);
            console.log(e.msg);
        }
    }
}


/** tmpToOriginal function is used for moving uploaded file from tmp folder to respecative folder  */
exports.tmpToOriginal = (filename, folder, thumb = false) => {

    fs.rename(`server/assets/tmp/${filename}`, `server/assets/uploads/${folder}/${filename}`, () => { });
    this.resize_image(folder, filename);
}

/** Copy file from one location to another */
exports.copyFile = (filename, folder) => {
    fs.rename(`server/assets/static/${folder}/${filename}`, `server/assets/uploads/${folder}/${filename}`, () => { });
}

/** ensureDirectoryExistence check if directory exists or not if not then create it */
exports.ensureDirectoryExistence = (filePath) => {
    let dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

/** removeFile is used for removing file from the directory */
exports.removeFile = (filename) => {
    if (filename != '' && filename != undefined) {
        const dirname = `server/assets/uploads/${filename}`;
        const thumb_dirname = `server/assets/uploads/thumb/${filename}`;
        if (fs.existsSync(dirname)) {
            fs.unlink(`server/assets/uploads/${filename}`, () => { });
        }
        if (fs.existsSync(thumb_dirname)) {
            fs.unlink(`server/assets/uploads/thumb/${filename}`, () => { });
        }
    }
}

/** removeDirectory is used for removing the directory  */
exports.removeDirectory = (directory) => {
    const fse = require('fs-extra')
    fse.remove(directory, err => {
        if (err) return console.error(` Error while removing directory: ${err} `);
        console.log(`${directory} removed successfully`) // It just deleted my entire HOME directory.
    })
}

/**
 * obj : params
 * new_file : name of new file field
 * directory : where to upload file
 * old_file : to remove file , if provided file will be removed
 * 
 * Move Uploaded File to the Directory
*/
exports.moveFile = (obj, new_file, directory, old_file = null) => {
    if (old_file in obj || new_file in obj) {
        // `new_file` and `old_file` will have same name when user upload image for first time
        if (new_file !== old_file && old_file in obj) {
            this.removeFile(obj[old_file])
            obj[old_file] = '';
        }
        if (obj[new_file] != undefined && obj[new_file] != '') {
            const dirname = `server/assets/uploads/${directory}/${obj[new_file]}`;
            this.ensureDirectoryExistence(dirname);
            const thumb_dirname = `server/assets/uploads/thumb/${directory}/${obj[new_file]}`;
            this.ensureDirectoryExistence(thumb_dirname);
            console.log(obj[new_file], `${directory}`);
            this.tmpToOriginal(obj[new_file], `${directory}`);

            return obj[old_file] = `${directory}/${obj[new_file]}`;
        }
    }
}

/** generateKey function generate token which is used as authorization */
exports.generateKey = () => {
    var timeStamp = Math.floor(Date.now());
    return CryptoJS.AES.encrypt(timeStamp.toString(), secretKey).toString();
}

/** Used for encrypte the data in crypto aes format */
exports.encryptdata = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), `${process.env.SECRET_KEY}`).toString();
}

exports.base64extension = (encoded) => {

    let Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { let t = ""; let n, r, i, s, o, u, a; let f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { let t = ""; let n, r, i; let s, o, u, a; let f = 0; e = e.replace(/[^A-Za-z0-9\+\/\=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/\r\n/g, "\n"); let t = ""; for (let n = 0; n < e.length; n++) { let r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { let t = ""; let n = 0; let r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }

    // Decode the string
    let decoded = Base64.decode(encoded);

    // if the file extension is unknown
    let extension = undefined;
    // do something like this
    let lowerCase = decoded.toLowerCase();

    if (lowerCase.indexOf("png") !== -1)
        extension = "png"
    else if (lowerCase.indexOf("jpg") !== -1 || lowerCase.indexOf("jpeg") !== -1)
        extension = "jpeg"
    else if (lowerCase.indexOf("gif") !== -1)
        extension = "gif"
    else extension = "jpeg";

    return extension;
}

exports.ValidURL = (s) => {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
}

exports.getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}