const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    place_id: {type:mongoose.Schema.Types.ObjectId, ref:'Place'},
    guest_id: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    hostRating: Number,
    hostComment: String,
    placeRating: Number,
    placeComment: String,
    date: Date,
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;