const mongoose = require('mongoose');
const {Schema} = mongoose; //otherwise I would have to write mongoose.Schema()

const UserTop = new Schema({
    p1: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
    p2: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
    p3: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
    p4: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
    p5: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
    },
    p6: {
        type: Schema.Types.ObjectId,
        ref: 'Place',
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