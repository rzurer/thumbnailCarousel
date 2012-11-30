/*globals   $*/
"use strict";
exports.thumbnailCarousel = function (methods) {
	return {
		ready : function (controls, imageInfos, clickCallback, options) {
			methods.ready(controls, imageInfos, clickCallback, options);
		}
	};
};