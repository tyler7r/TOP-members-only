const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
    title: { type: String, maxLength: 30, required: true },
    message: { type: String, maxLength: 160, required: true },
    author: { type: Schema.Types.ObjectId },
})

MessageSchema.virtual('url').get(function() {
    return `/yachtclub/messages/${this.id}`
})

module.exports = mongoose.model("Message", MessageSchema);