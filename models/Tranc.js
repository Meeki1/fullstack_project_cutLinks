const { Schema, model, Types } = require('mongoose')


const schema = new Schema({
    privateKey: {type: String, required: true},
    publicKey: { type: String, required: true},
    address: {type: String, required: true},
})

module.exports = model('User', schema)