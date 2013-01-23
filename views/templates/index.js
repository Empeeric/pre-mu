var fs = require('fs'),
    path = require('path');

module.exports = fs.readdirSync(__dirname).filter(function(file) {
    return path.extname(file) == '.html';
});