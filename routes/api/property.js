var express = require('express');
var router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const PROPERTY = require('../../database/collections/properties');
const IMAGE = require('../../database/collections/image');


//creacion de multer

const storage = multer.diskStorage({
    destination: function (res, file, cb) {
        try {
            fs.statSync('./uploads/');
        } catch (e) {
            fs.mkdirSync('./uploads/');
        }
        cb(null, './uploads/');
    },
    filename: (res, file, cb) => {
        cb(null, 'IMG-' + Date.now() + path.extname(file.originalname))
    }
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' ) {
        return cb(null, true);
    }
    return cb(new Error('Solo se admiten imagenes png, jpg y jpeg'));
}

const upload = multer({
  storage:storage,
  fileFilter: fileFilter,
  limits: {
        fileSize: 1024 * 1024 * 5
    }
}).single('foto');


//creacion de una casa
router.post("/", (req, res) => {

    upload(req, res, (error) => {
      if(error){
        return res.status(500).json({
          "error" : error.message
        });
      }else{
        if (req.file == undefined) {
          return res.status(400).json({
            "error" : 'No se recibio la imagen'
          });
        }
        let fields = req.body
        var img = {
          name : req.file.originalname,
          idusers: fields.vendedor,
          path : req.file.path,
        };
        var modelImagen = new IMAGE(img);
        modelImagen.save()
          .then( (result) => {

            let datos = {
              vendedor:fields.vendedor,
              title: fields.title,
              status : fields.status,
              offer : fields.offer,
              type : fields.type,
              price : fields.price,
              city: fields.city,
              region : fields.region,
              location : fields.location,
              description : fields.description,
              surface : fields.surface,
              servicesbasic : fields.servicesbasic,
              bedroom : fields.bedroom,
              bathroom : fields.bathroom,
              plantas:fields.plantas,
              walled : fields.walled,
              laundry : fields.laundry,
              pool : fields.pool,
              garage : fields.garage,
              amoblado : fields.amoblado,
              fecha_entrega : fields.fecha_entrega,
              lat : fields.lat,
              lon : fields.lon,
              like :fields.like,
              foto :'./routes/api/imagenes' + result._id,
            }


            const modelProperty = new PROPERTY(datos);
            return modelProperty.save()
          })
          .then(result => {
            res.status(201).json({message: 'Se Agrego el producto',result});
          })
          .catch(err => {
            res.status(500).json({error:err.message})
          });
      }
    });
  });
module.exports = router;
