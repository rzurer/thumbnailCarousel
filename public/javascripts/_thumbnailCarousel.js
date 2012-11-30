/*globals alert, window, $*/
"use strict";
var initializeThumbnailCarousel = function () {
	$(function () {
		var getImageSource = function (index) {
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
			controls = {
				container : $('.thumbnailCarousel'),
				thumbnailNav : $('.thumbnails'),
				thumbnailNavPrevious : $('#thumbnailPrevious'),
				thumbnailNavNext : $('#thumbnailNext'),
				getCurrentImageId : function () {
					return '2';
				},
				createImage : function () {
					return $('<img/>');
				}
			},
			imageInfos = createImageInfos(60),
			clickCallback = function () {
				console.log('clicked');
			},
			options = {
				containerWidth : 1024,
				buttonWidth : 30,
				carouselWidth : 890,
				imageWidth : 30,
				margin : 3
			};
		window.thumbnailCarousel.ready(controls, imageInfos, clickCallback, options);
	});
};