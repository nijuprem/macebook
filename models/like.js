const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId
    },
    // Defines obj Id of liked obj
    likeable :{
        type: mongoose.Schema.ObjectId,
        required: true,
        refPath: 'onModel'
    },
    // For defining type of liked obj for dynamic ref
    onModel:{
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }
},{
    timestamps: true
});

const Like = mongoose.model('Like', likeSchema);
module.exports = Like;

