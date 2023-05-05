const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ClubSchema = new Schema({
    members: [{ type: Schema.Types.ObjectId }]
})

module.exports = mongoose.model("Club", ClubSchema);