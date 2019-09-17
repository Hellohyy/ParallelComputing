var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MeauSchema = new Schema({
	id:String,
	name : String,
	price: Number,
	detail:String,
	img:String,
	type:String
});

var Meau = mongoose.model('Meau',MeauSchema); 
mongoose.connect('mongodb://localhost/OrderSystem')
// module.exports = {
	
// 	url : 'mongodb://localhost/ordersystem'
// }