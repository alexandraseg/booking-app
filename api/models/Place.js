const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    houseRules: [String], 
    // extraInfo: String,
    minimumLengthStay: Number,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    bedsNumber: Number,
    bathroomsNumber: Number,
    bedroomsNumber: Number,
    squareMeters: Number,
    spaceType: String,
    // hasLivingRoom: String,
    price: Number,

});

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;

