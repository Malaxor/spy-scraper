
// require mongoose
const mongoose = require("mongoose");

// schema object constructor
const Schema = mongoose.Schema;

// article schema
var articleSchema = new Schema ({

	title: {

		type: String,
		required: true,
		trim: true,
		unique: true
	},

	link: {

		type: String,
		required: true,
		trim: true,
		unique: true
	},

	summary : {

		type: String,
		trim: true,
		required: true
	},
	
	 saved: {

	 	type: Boolean,
	 	default: false 
	 },

	comment: [{

		type: Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

// article model 
var Article = mongoose.model("Article", articleSchema);

module.exports = Article;

