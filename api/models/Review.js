const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    place_id: {type:mongoose.Schema.Types.ObjectId, ref:'Place'},
    guest_id: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    host_id: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    host_rating: Number,
    host_comment: String,
    place_rating: Number,
    place_comment: String,
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;