const mongoose = require('mongoose');
const { Schema } = mongoose;

const LatentFactorsSchema = new Schema({
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
  userFactors: {
    type: [Number],
    required: true,
  },
  placeFactors: {
    type: [Number],
    required: true,
  },
});

const LatentFactorsModel = mongoose.model('LatentFactors', LatentFactorsSchema);

module.exports = LatentFactorsModel;