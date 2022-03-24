const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    
    author: {
        type: Object,
        // ref: "User",
        required: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("BlogPost", postSchema);