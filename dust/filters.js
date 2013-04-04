var dust = require('dustjs-linkedin');

dust.filters.st = function(value) {
    return value.stripTags();
};

dust.filters.json = function(value) {
	return JSON.stringify(value);
};