const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  image: {type: Object, ref: "imageSchema"}, 
  username: String,
});

const comment = new Schema ({
        id: Number,
        content: String,
        createdAt: Date,
        score: Number,
       user: {image:{png: String, webp: String}, username: String},
       replyTo: String
});

const imageSchema = new Schema ({
    png: {type: String, required: true},
    webp: {type: String, required: true},
});

const User = mongoose.model('User', userSchema, 'User');
const Comment = mongoose.model('Comment', comment, 'Comment')
const Image = mongoose.model('Image', imageSchema, 'Image');
const mySchemas = {'User': User, 'Comment': Comment,  'Image': Image};

module.exports = mySchemas;