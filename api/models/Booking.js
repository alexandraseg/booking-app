const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'}, //ref for reference 
    user: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'User'},
    checkIn: {type:Date, required:true},
    checkOut: {type:Date, required:true},
    price: Number,
});

const BookingModel = mongoose.model('Booking', bookingSchema);

module.exports = BookingModel;