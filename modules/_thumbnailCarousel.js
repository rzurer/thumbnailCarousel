/*globals   $*/
"use strict";
exports._thumbnailCarousel = function (common) {
	var uicontrols,
		callback,
		images,
		that = {
			coordinateNavigationButtons : function () {
				var indices;
				indices = common.indicesOfMatch(images, that.imageIsVisible);
				common.disableControls([uicontrols.thumbnailNavPrevious, uicontrols.thumbnailNavNext], '0.2');
				if (indices.first > 0) {
					common.enableControl(uicontrols.thumbnailNavPrevious, that.movePrevious);
				}
				if (indices.last < images.length - 1) {
					common.enableControl(uicontrols.thumbnailNavNext, that.moveNext);
				}
			},
			imageIsVisible : function (image) {
				return image.is(':visible');
			},
			moveNext : function () {
				var indices;
				indices = common.indicesOfMatch(images, that.imageIsVisible);
				if (indices.last <  images.length - 1) {
					images[indices.last + 1].show('normal');
					images[indices.first].hide('normal');
				}
				that.coordinateNavigationButtons();
			},
			movePrevious : function () {
				var indices;
				indices = common.indicesOfMatch(images, that.imageIsVisible);
				if (indices.first > 0) {
					images[indices.first - 1].show('normal');
					images[indices.last].hide('normal');
				}
				that.coordinateNavigationButtons();
			},
			getImages : function () {
				return images;
			},
			createImage : function (element) {
				var src, imageId, stampId, img;
				src = element.defaultImageSrc;
				imageId = element.imageId;
				stampId = element.stampId;
				img = uicontrols.createImage();
				img.attr('id', imageId);
				img.attr('src', src);
				img.attr('stampId', stampId);
				img.css('opacity', '1.0');
				img.click(callback);
				return img;
			},
			createThumbnails : function (imageInfos) {
				if (!imageInfos || imageInfos.length === 0) {
					return [];
				}
				return imageInfos.map(that.createImage);
			},
			setActiveThumbnail : function () {
				var imageId, currentImageId;
				currentImageId = uicontrols.getCurrentImageId();
				images.forEach(function (image) {
					imageId = image.attr('id');
					if (imageId === currentImageId) {
						image.unbind('click');
						image.css('opacity', '0.2');
						return;
					}
				});
			},
			appendThumbnails : function () {
				uicontrols.thumbnailNav.empty();
				images.forEach(function (image) {
					uicontrols.thumbnailNav.append(image);
				});
			},
			displayThumbnails : function (options) {
				var visibleImageCount, i, image, width, margin;
				width = options.imageWidth;
				margin = options.margin;
				uicontrols.thumbnailNavPrevious.css('width', options.buttonWidth + 'px');
				uicontrols.thumbnailNavNext.css('width', options.buttonWidth  + 'px');
				uicontrols.container.css('width', options.containerWidth + 'px');
				visibleImageCount = options.carouselWidth / (width + margin);
				for (i = 0; i < images.length; i += 1) {
					image = images[i];
					image.css('width', width + 'px');
					image.css('margin-right', margin + 'px');
					image.toggle(i <= visibleImageCount);
				}
			},
			setNavigationButtonsHeight : function () { //nt
				var height = uicontrols.container.height();
				uicontrols.thumbnailNavPrevious.css('height', height + 'px');
				uicontrols.thumbnailNavNext.css('height', height + 'px');
			},
			ready : function (controls, imageInfos, clickCallback, options) {
				uicontrols = controls;
				callback = clickCallback;
				images = that.createThumbnails(imageInfos);
				that.setActiveThumbnail();
				that.appendThumbnails();
				that.displayThumbnails(options);
				that.coordinateNavigationButtons();
				setTimeout(that.setNavigationButtonsHeight, 100);
			}
		};
	return that;
};



