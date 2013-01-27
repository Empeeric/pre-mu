var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var p = new Schema({
    title: { type: String, require: true },
    template: { type: String, enum: require('../views/templates')},

    text: { type: Schema.Types.Html },
    background: { type: Schema.Types.Picture }
});

p.methods.toString = function(){
    return this.title;
};

module.exports = mongoose.model('page', p);

