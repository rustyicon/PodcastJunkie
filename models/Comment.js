var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	title: {
		type: String,
		index:{
			unique: true
		}
	},
	body: {
		type: String
	}
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
