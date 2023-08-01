const { Schema } = require('mongoose');

const mongoose = require('mongoose');

const MessageSchema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName:{ type: String, required: true },
    receiverName:{ type: String, required: true },
    senderImage:{ type: String, required: true },
    receiverImage:{ type: String, required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    isUserDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
