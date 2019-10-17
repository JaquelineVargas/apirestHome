const mongoose = require("../connect");
var USERSCHEMA = {
type :String,
name: String,
lastname: String,
city: String,
address : String,
phone:String,
email: String,
password : String,
registerdate: Date,
}

const USERS = mongoose.model("users", USERSCHEMA);
module.exports = USERS;
