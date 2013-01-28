var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var schema = new mongoose.Schema({
    title: { type: String, require: true },
    layout: { type: String, required: true, enum: [
        'landscape',
        'portrait',
        'portrait right',
        'el',
        'el right'
    ] },
    text: { type: Types.Html },

    picture1: { type: Types.Picture },
    picture2: { type: Types.Picture },
    picture3: { type: Types.Picture },

    order: { type: Number, editable: false },
    show: { type: Boolean, 'default': true }
});

schema.methods.toString = function(){
    return this.title;
};

module.exports = mongoose.model('works', schema);