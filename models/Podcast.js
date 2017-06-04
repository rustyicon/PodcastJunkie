var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var PodcastSchema = new Schema({
	title: {
		type: String,
		required: true
	},

	image: {
		type: String,
		required: true
	},
	link: {
		type: String,
		required: true
	},
	comment: {
		type:Schema.Types.ObjectId,
		ref:"Comment"
	}
});

var Podcast = mongoose.model("Podcast", PodcastSchema);

module.exports = Podcast;