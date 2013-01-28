var models = require('./models');

/*
 middle-wares
 */
var config = function(req, res, next){
    models.config
        .findOne()
        .exec(function(err, config) {
            req.config = config;
            next(err);
        });
};

var pages = function(req, res, next) {
    models.pages
        .find()
        .where('show', true)
        .sort({ parent: -1, order: 1 })
        .exec(function(err, pages) {
            if (err) next(err);

            var o = {};
            pages.forEach(function(item) {
                o[item._id] = item.toObject();
                o[item._id].children = [];
            });
            for (var i in o) {
                var item = o[i],
                    p = item.parent;
                if (p) {
                    o[p].children.push(item);
                    delete o[i];
                }
            }
            var arr = [];
            for (var i in o) {
                arr.push(o[i]);
            }

            req.pages = arr;
            next(err);
        });
};

var works = function(req, res, next) {
    models.works
        .find()
        .where('show', true)
//        .sort({ order: 1 })
        .exec(function(err, works){
            req.works = works;
            next(err);
        });
};

module.exports = function(app){
    app.get('/', [ config, pages, works ], function(req, res) {
        res.render('index.html', {
            config: req.config,
            pages: req.pages,
            works: req.works
        });
    });

    app.get('/json', [ config ], function(req, res) {
        res.json(req.config);
    })
};