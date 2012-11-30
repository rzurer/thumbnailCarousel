'use strict';
function initialize(app) {
    app.get('/', function (req, res) {
        res.render('thumbnailCarousel');
    });
}
exports.initialize = initialize;