var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var schema = new mongoose.Schema({
    parent: { type: Types.ObjectId, ref: 'pages' },
    title: { type: String, require: true },
    template: { type: String, enum: require('../views/templates') },
    name: { type: String, require: true },

    text: { type: Types.Html },
    background: { type: Types.Picture },
    background_class: { type: String, enum: [ '-', 'big' ] },

    order: { type: Number, editable: false },
    show: { type: Boolean, 'default': true }
});

schema.methods.toString = function(){
    return this.title;
};

module.exports = mongoose.model('pages', schema);