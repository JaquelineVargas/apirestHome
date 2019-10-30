const mongoose = require("../connect");
const Schema = mongoose.Schema;
var   HOMESCHEMA = {
  title: String,
  status : String,
  offer : String,
  type : String,
  price : String,
  city: String,
  region : String,
  location : String,
  description : String,
  surface : String,
  servicesbasic : String,
  bedroom : Number,
  bathroom : Number,
  plantas:Number,
  walled : String,
  laundry : String,
  pool : String,
  garage : String,
  amoblado : String,
  fecha_entrega : String,
  lat : Number,
  lon : Number,
  //like :Number,
  foto :String,
  //gallery : String,
  vendedor: {
        type: Schema.Types.ObjectId,
        ref: "users",
        require:'Falta info del vendedor'
    },
  fechaRegistro: {
        type: Date,
        default: Date.now()
    }
};
var PROPERTIES = mongoose.model("properties", HOMESCHEMA);
module.exports = PROPERTIES;
