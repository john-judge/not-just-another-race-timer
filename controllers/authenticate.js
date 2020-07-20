var Cryptr = require('cryptr');
cryptr = new Cryptr('dhsf^3##*(YV#Vy8');
 
var connection = require('./../config'); // non-pooled connection
module.exports.authenticate=function(req,res){
    var email=req.body.email;
    var password=req.body.password;
   
   
    connection.query('SELECT * FROM Users WHERE email = ?',[email], function (error, results, fields) {
        if (error) {
          res.json({
            status:false,
            message:'there are some errors with the query: ' + error
            });
      }else{
       
        if(results.length >0){
            decryptedString = cryptr.decrypt(results[0].password);
            if(password==decryptedString){
                res.json({
                    status:true,
                    message:'Successfully authenticated'
                });
            }else{
                res.json({
                  status:false,
                  message:"Email and password do not match"
                 });
            }
          
        }
        else{
          res.json({
              status:false,    
            message:"Email does not exist"
          });
        }
      }
    });
};
