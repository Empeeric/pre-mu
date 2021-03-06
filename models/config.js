var mongoose = require('mongoose'),
    Types = mongoose.Schema.Types;

var schema = new mongoose.Schema({
    title: { type: String, required: true },
    email: { type: String, required: true },
    contact_details: { type: Types.Html },
    facebook_text: { type: String, default: 'Our Facebook' }
});

var config = module.exports = mongoose.model('config', schema);
config.single = true;