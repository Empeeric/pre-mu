var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var schema = new mongoose.Schema({
    name: String,
    link: String,
    picture: { type: Types.Picture },

    order: { type: Number, editable: false },
    show: { type: Boolean, 'default': true }
});

schema.methods.toString = function(){
    return this.name;
};

module.exports = mongoose.model('clients', schema);