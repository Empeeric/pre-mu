var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var link = function(v) {
    if (v && v.substr(0, 7) !== 'http://')
        v = 'http://' + v;
    return v;
};

var schema = new mongoose.Schema({
    name: String,
    link: { type: String, set: link },
    picture: { type: Types.Picture },

    order: { type: Number, editable: false },
    show: { type: Boolean, 'default': true }
});

schema.methods.toString = function(){
    return this.name;
};

module.exports = mongoose.model('clients', schema);