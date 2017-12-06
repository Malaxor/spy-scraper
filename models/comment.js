
// require mongoose
const mongoose = require("mongoose");

// schema object
const Schema = mongoose.Schema;

// article schema
var commentSchema = new Schema ({

	name: {

		type: String,
		required: true,
	},

	body: {

		type: String,
		required: true,
	}
});

// article model 
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;