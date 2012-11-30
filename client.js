/*jslint browser: true*/
"use strict";
(function () {
	var common = require('./modules/common').common(),
		methods = require('./modules/_thumbnailCarousel')._thumbnailCarousel(common),
		thumbnailCarousel = require('./modules/thumbnailCarousel').thumbnailCarousel(methods);
	window.thumbnailCarousel = thumbnailCarousel;
}());

