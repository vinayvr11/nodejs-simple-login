const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: {type:String},
    contact: {type: String},
    password: {type: String}
});

const model = mongoose.model('UserReg', schema);

module.exports = model;

