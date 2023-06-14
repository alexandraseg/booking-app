const mongoose = require('mongoose');
const {Schema} = mongoose;

const MessageSchema = new Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
        content: { type: String, trim: true},
        chat: { type: mongoose.Schema.Types.ObjectId, ref:"Chat"},

    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;