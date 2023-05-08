const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true, maxLength: 15 },
    last_name: { type: String, required: true, maxLength: 20 },
    username: { type: String, required: true, minLength: 2 },
    password: { type: String, required: true, minLength: 4 },
    status: { type: Boolean, default: false },
})

UserSchema.virtual('url').get(function() {
    return `/yachtclub/user/${this.id}`
})

UserSchema.virtual('fullname').get(function() {
    return `${this.first_name} ${this.last_name}`
})

module.exports = mongoose.model("User", UserSchema);