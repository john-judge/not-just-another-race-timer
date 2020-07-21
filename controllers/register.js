var Cryptr = require('cryptr');
var jwt=require('jsonwebtoken'); // client will store a web token for auth

cryptr = new Cryptr('dhsf^3##*(YV#Vy8');
 
module.exports.register=function(req,res,connection){
    var encryptedString = cryptr.encrypt(req.body.password);
    var users={
        "name":req.body.name,
        "email":req.body.email,
        "password":encryptedString
    };
    connection.query('INSERT INTO Users SET ?',users, function (error, results, fields) {
      if (error) {
        res.json({
            status:false,
            message:'there are some errors with the insertion query'+error
        });
      }else{
          var token=jwt.sign(users.email,users.password);
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully!',
            token:token
        });
      }
    });
};
