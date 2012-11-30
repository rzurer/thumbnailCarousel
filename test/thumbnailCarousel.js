/*global  describe, beforeEach, afterEach, it*/
"use strict";
var sinon = require('sinon'),
	assert = require('assert'),
	$ = require('jquery'),
	common = require('../modules/common').common(),
	methods = require('../modules/_thumbnailCarousel')._thumbnailCarousel(common),
	sut = require('../modules/thumbnailCarousel').thumbnailCarousel(methods);
describe('thumbnailCarousel_module', function () {
	describe('ready', function () {
		it("should call methods ready", function () {
			var spy,
				controls = {
					container : $('<div/>'),
					thumbnailNav : $('<div/>'),
					thumbnailNavPrevious : $('<img/>'),
					thumbnailNavNext : $('<img/>'),
					getCurrentImageId : function () {
						return '2';
					},
					createImage : function () {
						return $('<img/>');
					}
				},
				imageInfos = [],
				clickCallback = function () {
				},
				options = {};
			spy = sinon.spy(methods, 'ready');
			sut.ready(controls, imageInfos, clickCallback, options);
			sinon.assert.calledWith(spy, controls, imageInfos, clickCallback, options);
		});
	});
});