var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var NoteSchema = new mongoose.Schema({
    note: String
});

module.exports = mongoose.model('Notes', NoteSchema);
