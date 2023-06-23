const mongoose = require('mongoose');
const {Schema} = mongoose; //otherwise I would have to write mongoose.Schema()

const UserPlaceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      placeId: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
        required: true,
      },
      navigated: {
        type: Boolean,
        default: false,
      },
      searched: {
        type: Boolean,
        default: false,
      },
      rating: {
        type: Number,
        default: null,
      },
      booked: {
        type: Boolean,
        default: false,
      },
});

const UserPlaceModel = mongoose.model('UserPlace', UserPlaceSchema);

module.exports = UserPlaceModel;