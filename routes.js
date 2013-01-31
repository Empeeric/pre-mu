var models = require('./models'),
    mail = require('./mail');

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

var docs = function(model) {
    return function(req, res, next) {
        models[model]
            .find()
            .where('show', true)
            .sort({ order: 1 })
            .exec(function(err, docs){
                req[model] = docs;
                next(err);
            });
    }
};

module.exports = function(app){
    app.get('/', [ config, pages, docs('works'), docs('clients') ], function(req, res) {
        res.render('index.html', {
            config: req.config,
            pages: req.pages,
            works: req.works,
            clients: req.clients
        });
    });

    app.get('/json', [ pages ], function(req, res) {
        res.json(req.pages);
    });

    mail.init(app.get('sendgrid'));
    app.post('/mail', [ config ], function(req, res) {
        var message = {
            to: req.config.email,
            from: req.body.email,
            subject: 'MOUSE mail, from ' + req.body.name,
            text: req.body.message
        };

        console.log('Sending mail', message);

        mail.send(message, function(success, message) {
            if (!success)
                console.error('Error: Could not send mail.', message);

            res.redirect('/#/contact');
        });
    });
};