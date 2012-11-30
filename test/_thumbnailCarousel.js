/*global  describe, beforeEach, afterEach, it, $*/
"use strict";
var common = require('../modules/common').common(),
    sut = require('../modules/_thumbnailCarousel')._thumbnailCarousel(common),
	sinon = require('sinon'),
	assert = require('assert'),
	$ = require('jquery'),
	getImageSource = function (index) {
		if (index % 2 === 0) {
			return '/images/img1.jpg';
		}
		if (index % 3 === 0) {
			return '/images/img2.jpg';
		}
		return '/images/img3.jpg';
	},
	createImageInfos = function (count) {
		var arr, i;
		arr = [];
		for (i = 0; i < count; i += 1) {
			arr.push({imageId : i.toString(), defaultImageSrc : getImageSource(i) });
		}
		return arr;
	},
	func = function () {},
	getContainer = function () {
		return $('<div/>');
	},
	getLabel = function () {
		return $('<label/>');
	},
	getInput = function () {
		return $('<input/>');
	},
	getImage = function () {
		return $('<img/>');
	},
	controls = {
		container : getContainer(),
		thumbnailNav: getContainer(),
		thumbnailNavPrevious : getImage(),
		thumbnailNavNext :  getImage(),
		getCurrentImageId : function () {
			return '2';
		},
		createImage : function () {
			return $('<img/>');
		}
	},
	imageCount = 30,
	options = {
		containerWidth : 1024,
		carouselWidth : 700,
		imageWidth : 30,
		margin : 5
	},
	clicked,
	imageInfos = createImageInfos(imageCount),
	clickCallback = function () {
		clicked = true;
	},
	setup = function () {
		clicked = false;
		sut.ready(controls, imageInfos, clickCallback, options);
	};
describe('_thumbnailCarousel_module', function () {
	describe('ready', function () {
		describe('appendThumbnails', function () {
			it("should add each thumbnail to thumbnailNav", function () {
				var images, spy;
				spy = sinon.spy(controls.thumbnailNav, 'append');
				sut.ready(controls, imageInfos, clickCallback, options);
				controls.thumbnailNav.append.restore();
				sinon.assert.callCount(spy, imageCount);
			});
		});
		describe('displayThumbnails', function () {
			it(" should set container width to options containerWidth", function () {
				var images, spy;
				spy = sinon.spy(controls.container, 'css');
				sut.ready(controls, imageInfos, clickCallback, options);
				controls.container.css.restore();
				sinon.assert.calledWith(spy, 'width', options.containerWidth + 'px');
			});
			it("should set images width", function () {
				var images;
				sut.ready(controls, imageInfos, clickCallback, options);
				images = sut.getImages();
				images.forEach(function (img) {
					assert.equal(img.css("width"), options.imageWidth + 'px');
				});
			});
			it("should set images margin-right", function () {
				var images;
				sut.ready(controls, imageInfos, clickCallback, options);
				images = sut.getImages();
				images.forEach(function (img) {
					assert.equal(img.css("margin-right"), options.margin + 'px');
				});
			});
			it("should set visible images", function () {
				var images, visibleImageCount;
				sut.ready(controls, imageInfos, clickCallback, options);
				visibleImageCount = options.carouselWidth / (options.imageWidth + options.margin);
				images = sut.getImages();
				assert.equal(images[visibleImageCount].is(':visible'), true);
				assert.equal(images[visibleImageCount + 1].is(':visible'), false);
			});
		});
		it("should create thumbnails from imageInfos", function () {
			var spy;
			spy = sinon.spy(sut, 'createThumbnails');
			sut.ready(controls, imageInfos, clickCallback, options);
			sut.createThumbnails.restore();
			sinon.assert.calledWith(spy, imageInfos);
		});
		it("should append thumbnails ", function () {
			var spy;
			spy = sinon.spy(sut, 'appendThumbnails');
			sut.ready(controls, imageInfos, clickCallback, options);
			sut.appendThumbnails.restore();
			sinon.assert.calledOnce(spy);
		});
		it("should display thumbnails ", function () {
			var spy;
			spy = sinon.spy(sut, 'displayThumbnails');
			sut.ready(controls, imageInfos, clickCallback, options);
			sut.displayThumbnails.restore();
			sinon.assert.calledWith(spy, options);
		});
		it("should coordinate Navigation Buttons", function () {
			var spy;
			spy = sinon.spy(sut, 'coordinateNavigationButtons');
			sut.ready(controls, imageInfos, clickCallback, options);
			sut.coordinateNavigationButtons.restore();
			sinon.assert.calledOnce(spy);
		});
		it("should display set navigation buttons height after a timeout", function () {
			var spy;
			var clock = sinon.useFakeTimers();
			spy = sinon.spy(sut, 'setNavigationButtonsHeight');
			sut.ready(controls, imageInfos, clickCallback, options);
			clock.tick(100);
			sut.setNavigationButtonsHeight.restore();
			clock.restore();
			sinon.assert.calledOnce(spy);
		});
	});
	describe('methods', function () {
		beforeEach(setup);
		describe('coordinateNavigationButtons', function () {
			describe('when in initial state', function () {
				it("should disable previous navigation button ", function () {
					assert.equal(controls.thumbnailNavPrevious.css('opacity'), "0.2");
				});
				it("should unbind previous navigation button click", function () {
					var images, image, lastVisibleImageIndex;
					images = sut.getImages();
					lastVisibleImageIndex = common.indicesOfMatch(images, sut.imageIsVisible).last;
					image = images[lastVisibleImageIndex + 1];
					assert.ok(!image.is(':visible'));
					controls.thumbnailNavPrevious.click();
					assert.ok(!image.is(':visible'));
				});
				it("should enable next navigation button ", function () {
					assert.equal(controls.thumbnailNavNext.css('opacity'), "1");
				});
				it("should set next navigation button click", function () {
					var image;
					image = sut.getImages()[0];
					assert.ok(image.is(':visible'));
					controls.thumbnailNavNext.click();
					assert.ok(!image.is(':visible'));
				});
			});
			describe('when in intermediate state', function () {
				beforeEach(function () {
					sut.moveNext();
				})
				afterEach(function () {
					sut.movePrevious();				
				})
				it("should enable previous navigation button ", function () {
					assert.equal(controls.thumbnailNavPrevious.css('opacity'), "1");
				});
				it("should set previous navigation button click", function () {
					var images, image, lastVisibleImageIndex;
					images = sut.getImages();
					lastVisibleImageIndex = common.indicesOfMatch(images, sut.imageIsVisible).last;					
					image = images[lastVisibleImageIndex];				
					assert.ok(image.is(':visible'));
					controls.thumbnailNavPrevious.click();
					assert.ok(!image.is(':visible'));
				});
				it("should enable next navigation button ", function () {
					assert.equal(controls.thumbnailNavNext.css('opacity'), "1");
				});
				it("should set next navigation button click", function () {
					var image, images, lastVisibleImageIndex;
					images = sut.getImages();
					lastVisibleImageIndex = common.indicesOfMatch(images, sut.imageIsVisible).last;
					image = images[lastVisibleImageIndex + 1];					
					assert.ok(!image.is(':visible'));
					controls.thumbnailNavNext.click();
					assert.ok(image.is(':visible'));
				});
			});
		});
		describe('createThumbnails', function () {
			describe('when imageInfos is undefined or empty', function () {
				it("should not call create image", function () {
					var spy;
					spy = sinon.spy(sut, 'createImage');
					sut.createThumbnails();
					sut.createImage.restore();
					sinon.assert.notCalled(spy);
				});
			});
			describe('when imageInfos is not empty', function () {
				var imageInfos;
				beforeEach(function () {
					imageInfos = [ {}, {}, {}, {}];
				});
				it("should call create image for every imageInfo", function () {
					var spy;
					spy = sinon.spy(sut, 'createImage');
					sut.createThumbnails(imageInfos);
					sut.createImage.restore();
					sinon.assert.callCount(spy, imageInfos.length);
				});
			});
		});
		describe('createImage', function () {
			var imageInfo;
			beforeEach(function () {
				imageInfo = {
					defaultImageSrc : "foo.jpg",
					imageId : 'A12345',
					stampId : 'S7894'
				};
			});
			it("should call controls createImage", function () {
				var spy, img;
				spy = sinon.spy(controls, 'createImage');
				img = sut.createImage(imageInfo);
				controls.createImage.restore();

				sinon.assert.calledOnce(spy);
			});
			it("should set image id attribute", function () {
				var img;
				img = sut.createImage(imageInfo);
				assert.equal(img.attr('id'), imageInfo.imageId);
			});
			it("should set image src attribute", function () {
				var img;
				img = sut.createImage(imageInfo);
				assert.equal(img.attr('src'), imageInfo.defaultImageSrc);
			});
			it("should set image stampId attribute", function () {
				var img;
				img = sut.createImage(imageInfo);
				assert.equal(img.attr('stampId'), imageInfo.stampId);
			});
			it("should set image opacity to '1.0'", function () {
				var img;
				img = sut.createImage(imageInfo);
				assert.equal(img.css('opacity'), '1');
			});
			it("should set image click event", function () {
				var img;
				assert.equal(clicked, false);
				img = sut.createImage(imageInfo);
				img.click();
				assert.equal(clicked, true);
			});
		});
		describe('coordinateNavigationButtons', function () {
			it("should disable previous nav button when there are no hidden images before first", function () {
				var spy, images;
				spy = sinon.spy(common, 'indicesOfMatch');
				images = sut.getImages();
			    sut.moveNext();
				common.indicesOfMatch.restore();
				sinon.assert.calledWith(spy, images, sut.imageIsVisible);
			});
			it("should disable next nav button when there are no hidden images after last", function () {
				var spy, images;
				spy = sinon.spy(common, 'indicesOfMatch');
				images = sut.getImages();
			    sut.moveNext();
				common.indicesOfMatch.restore();
				sinon.assert.calledWith(spy, images, sut.imageIsVisible);
			});
		});
		describe('moveNext', function () {
			it("should get in indices of visible images", function () {
				var spy, images;
				spy = sinon.spy(common, 'indicesOfMatch');
				images = sut.getImages();
			    sut.moveNext();
				common.indicesOfMatch.restore();
				sinon.assert.calledWith(spy, images, sut.imageIsVisible);
			});
			it("should hide image at start index and show image after last index", function () {
				var images, indices, begin, end;
				images = sut.getImages();
				sut.moveNext();
				sut.moveNext();
				indices = common.indicesOfMatch(images, sut.imageIsVisible);
				begin = indices.first;
				end = indices.last + 1;
				assert.ok(images[begin].is(":visible") === true);
				assert.ok(images[end].is(":visible") === false);
			    sut.moveNext();
				assert.ok(images[begin].is(":visible") === false);
				assert.ok(images[end].is(":visible") === true);
			});
		});
		describe('movePrevious', function () {
			it("should get in indices of visible images", function () {
				var spy, images;
				spy = sinon.spy(common, 'indicesOfMatch');
				images = sut.getImages();
				sut.movePrevious();
				common.indicesOfMatch.restore();
				sinon.assert.calledWith(spy, images, sut.imageIsVisible);
			});
			it("should show image before start index and hide image at last index", function () {
				var images, indices, begin, end;
				images = sut.getImages();
				sut.moveNext();
				sut.moveNext();
				indices = common.indicesOfMatch(images, sut.imageIsVisible);
				begin = indices.first - 1;
				end = indices.last;
				assert.ok(images[begin].is(":visible") === false);
				assert.ok(images[end].is(":visible") === true);
			    sut.movePrevious();
				assert.ok(images[begin].is(":visible") === true);
				assert.ok(images[end].is(":visible") === false);
			});
		});
		describe('setActiveThumbnail', function () {
			it("should call controls getCurrentImageId", function () {
				var spy;
				spy = sinon.spy(controls, 'getCurrentImageId');
			    sut.setActiveThumbnail();
				controls.getCurrentImageId.restore();
				sinon.assert.calledOnce(spy);
			});
			describe('when image is not current image', function () {
				it("should not set image opacity", function () {
					var stub, currentImageId, images;
					currentImageId = "200";
					images = sut.getImages();
					images.forEach(function (img) {
						img.css('opacity', "1");
					});
					stub = sinon.stub(controls, 'getCurrentImageId').returns(currentImageId);
					sut.setActiveThumbnail();
					controls.getCurrentImageId.restore();
					sut.getImages().forEach(function (img) {
						assert.equal(img.css('opacity'), "1");
					});
				});
				it("should not unbind image click", function () {
					var stub, currentImageId, images;
					currentImageId = "5";
					images = sut.getImages();
					images.forEach(function (img) {
						img.click(clickCallback);
					});
					stub = sinon.stub(controls, 'getCurrentImageId').returns(currentImageId);
					assert.equal(clicked, false);
					sut.setActiveThumbnail();
					images[1].click();
					controls.getCurrentImageId.restore();
					assert.equal(clicked, true);
				});
			});
			describe('when image is current image', function () {
				it("should set image opacity to 0.2", function () {
					var stub, currentImageId, images;
					currentImageId = "2";
					images = sut.getImages();
					images.forEach(function (img) {
						img.css('opacity', "1");
					});
					stub = sinon.stub(controls, 'getCurrentImageId').returns(currentImageId);
					sut.setActiveThumbnail();
					controls.getCurrentImageId.restore();
					assert.equal(images[currentImageId].css('opacity'), "0.2");
				});
				it("should unbind image click", function () {
					var stub, currentImageId, images;
					currentImageId = "2";
					images = sut.getImages();
					images.forEach(function (img) {
						img.click(clickCallback);
					});
					stub = sinon.stub(controls, 'getCurrentImageId').returns(currentImageId);
					assert.equal(clicked, false);
					sut.setActiveThumbnail();
					images[currentImageId].click();
					controls.getCurrentImageId.restore();
					assert.equal(clicked, false);
				});
			});
		});
		describe('setNavigationButtonsHeight', function () {
			it("should match buttons height to container height", function () {
				var height = 256;
				sinon.stub(controls.container, 'height').returns(height);
				sut.setNavigationButtonsHeight();
				controls.container.height.restore();
				assert.equal(controls.thumbnailNavPrevious.css('height'), height + 'px');
				assert.equal(controls.thumbnailNavNext.css('height'), height + 'px');
			});
		});
	});
});