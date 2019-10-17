var express = require('express');
var router = express.Router();
const empty = require ('is-empty');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
var USER = require("../../database/collections/users");
var valid = require('../../utils/valid')


//login
router.post("/login", async(req, res,next) => {
  var email= req.body.email;
  var password = crypto.createHash("md5").update(req.body.password).digest("hex");
  var result = USER.findOne({email: email,password: password}).exec((err, doc) => {
    if (err) {
      res.status(200).json({
        msn : "No se puede concretar con la peticion "
      });
      return;
    }
    if (doc) {
      //res.status(200).json(doc);
      jwt.sign({email: doc.email, password: doc.password}, "secretkey123", (err, token) => {
          console.log(err);
          res.status(200).json({
            token : token
          });
      })
    } else {
      res.status(200).json({
        msn : "El usuario no existe en la base de datos"
      });
    }
  });
});

//Middelware for verifity token
function verifytoken (req, res, next) {
  //Recuperar el header
  const header = req.headers["authorization"];
  if (header  == null) {
      res.status(403).json({
        msn: "No autotizado"
      })
  } else {
      req.token = header;
      //console.log("---->"+ req.originalUrl);
      //console.log(req);
      jwt.verify(req.token, "secretkey123", (err, authData) => {
        if (err) {
          res.status(403).json({
            msn: "token incorrecto"
          })
        }
          //go to funcion
          next();
          //say user from token
          //res.status(403).json(authData);

      });
  }
}


//CRUD USER
//insert user
router.post('/user', async(req, res) => {
var params = req.body;
params["registerdate"] = new Date();
if(!valid.checkEmail(params.email))
    {
      res.status(300).json({
          msn: "campo email no valido"
      });
      return;

    }
if(!valid.checkPassword(params.password))
        {
          res.status(300).json({
              msn: "campo password no valido"
          });
          return;

        }
//crypto password
params["password"] = crypto.createHash("md5").update(params.password).digest("hex");
var users = new USER(params);
var result = await users.save();
res.status(200).json(result);
});


//read user
router.get('/user',verifytoken,(req,res) => {
  USER.find({},(err,docs)=>{
    if(empty(docs)){
      res.json({message:'no existen usuarios en la BD'});
    }else{
      res.json(docs);
    }
  });
});



//delete user
router.delete("/user", async(req, res) => {
if (req.query.id == null) {
res.status(300).json({
msn: "Error no existe id"
});return;
}
var r = await USER.remove({_id: req.query.id});
res.status(300).json(r);
});

// update someone user
router.patch("/user",(req, res) => {
  if (req.query.id == null){
    res.status(300).json({
      msm:"error no existe id"
    });
    return;
  }
  var id =req.query.id;
  var user = req.body;
  USER.findOneAndUpdate({_id: id},user,(error,docs) => {
    res.status(200).json(docs);
    return;
});
});

module.exports = router;
