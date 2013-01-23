var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var n = new Schema({
    parent: { type: ObjectId, ref: 'navigation' },
    name: { type: String, require: true },
    page: { type: ObjectId, ref: 'page' },

    order: { type: Number, editable: false },
    show: { type: Boolean, 'default': true }
});

n.methods.toString = function(){
    return this.name;
};

module.exports = mongoose.model('navigation', n);
//exports.single = true;


