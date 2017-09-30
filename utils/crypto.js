const crypto = require('crypto');
const secretKey = '$k%1^0&*';
module.exports = {
    encrypt: function(str){
        var cipher = crypto.createCipher('aes-256-cbc',secretKey)
        var crypted = cipher.update(str,'utf8','hex')
        crypted += cipher.final('hex')
        return crypted;
    },
    decode: function(str){
        var decipher = crypto.createDecipher('aes-256-cbc',secretKey)
        var dec = decipher.update(str,'hex','utf8')
        dec += decipher.final('utf8')
        return dec;
    }
}
