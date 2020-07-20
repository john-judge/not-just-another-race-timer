var Cryptr = require('cryptr');
var express=require("express");
var connection = require('./../config'); // non-pooled connection
cryptr = new Cryptr('dhsf^3##*(YV#Vy8');
 
module.exports.register=function(req,res){
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
          res.json({
            status:true,
            data:results,
            message:'user registered sucessfully'
        });
      }
    });
}
