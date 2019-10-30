var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const Imagen = require('../../database/collections/image');

/*Obtener todas las imagenes */
router.get("/", (req, res) => {
    Imagen.find().exec()
    .then(docs => {
      res.json({
        data: docs
      });
    })
    .catch(err => {
      res.status(500).json({
          error: err.message
      })
    });
  });



module.exports = router;
