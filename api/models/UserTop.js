const mongoose = require('mongoose');
const {Schema} = mongoose; //otherwise I would have to write mongoose.Schema()

const UserTop = new Schema({
    p1: {
        type: Number,
        default: 0,
    },
    p2: {
        type: Number,
        default: 0,
    },
    p3: {
        type: Number,
        default: 0,
    },
    p4: {
        type: Number,
        default: 0,
    },
    p5: {
        type: Number,
        default: 0,
    },
    p6: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const UserTopModel = mongoose.model('UserTop', UserTop);

module.exports = UserTopModel;