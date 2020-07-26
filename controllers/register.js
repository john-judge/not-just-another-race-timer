var Cryptr = require('cryptr');
var jwt=require('jsonwebtoken'); // client will store a web token for auth
var fs = require('fs');

cryptr = new Cryptr('dhsf^3##*(YV#Vy8');
 
module.exports.register=function(req,res,connection){
    var encryptedString = cryptr.encrypt(req.body.password);

    connection.query('INSERT INTO Users(name,email,password) VALUES (?,?,?)',[req.body.name,req.body.email,encryptedString], function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some errors with the insertion query'+error
        });
      }else{
          let privateKey = fs.readFileSync('./privateKey.pem','utf-8');
          var token=jwt.sign(req.body.email,privateKey, { algorithm: 'HS256'});
          res.json({
            status:true,
            message:'user registered sucessfully!',
            userID: parseInt(results.insertId),
            token:token
          });
      }
    });
};
