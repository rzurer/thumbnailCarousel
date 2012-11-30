/*global  describe, beforeEach, afterEach, it*/
"use strict";
var sinon = require('sinon'),
	assert = require('assert'),
	sut = require('../modules/common').common();
describe('common_module', function () {
	it("indexOfFirstMatch should return index of first match", function () {
		var array, index;
		array = [1, 2, 3, 4, 5, 6];
		index = sut.indexOfFirstMatch(array, function (element) {
			return element > 4;
		});
		assert.strictEqual(index,  array.indexOf(5));
	});
	it("indexOfLastMatch should return index of last match", function () {
		var array, index;
		array = [1, 2, 3, 4, 5, 6];
		index = sut.indexOfLastMatch(array, function (element) {
			return element > 4;
		});
		assert.strictEqual(index, array.indexOf(6));
	});
	it("indicesOfMatch should return index of first and last match", function () {
		var array, indices;
		array = [1, 2, 3, 4, 5, 6];
		indices = sut.indicesOfMatch(array, function (element) {
			return element > 2;
		});
		assert.deepEqual(indices, {first: 2, last : 5});
	});

});