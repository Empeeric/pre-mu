var models = require('./models');

/*
 middle-wares
 */
var config = function(req, res, next){
    models.config
        .find()
        .exec(function(err, config){
            var o = {};
            config.forEach(function(con){
                o[con.key] = con.value;
            });

            req.config = o;
            next(err);
        })
};

var nav = function(req, res, next) {
    models.navigation
        .find()
        .where('show', true)
        .sort({ parent: -1, order: 1 })
        .populate('page')
        .exec(function(err, nav) {
            if (err) next(err);

            var o = {};
            nav.forEach(function(item) {
                o[item._id] = item.toObject();
                o[item._id].children = [];
            });
            for (var i in o) {
                var item = o[i],
                    p = item.parent;
                if (p) {
                    o[p].children.push(item);
                    o[p].children[0].first = true;
                    delete o[i];
                }
            }
            var arr = [];
            for (var i in o) {
                arr.push(o[i]);
            }
            if (arr.length)
                arr[0].first = true;

            req.nav = arr;
            next(err);
        });
};

module.exports = function(app){
    app.get('/server', [config, nav], function(req, res) {
        res.render('index.html', {
            config: req.config,
            nav: req.nav
        });
    });

    app.get('/json', [nav], function(req, res) {
        res.json(req.nav);
    })
};