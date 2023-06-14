const mongoose = require('mongoose');
const {Schema} = mongoose;

const ChatSchema = new Schema(
    {
        chatName: { type: String, trim: true},
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    },
    {
        timestamps: true,
    }
);

const ChatModel = mongoose.model('Chat', ChatSchema);

module.exports = ChatModel;