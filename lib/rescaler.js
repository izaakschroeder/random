
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function() {

	"use strict";

	function toClosedUnitInterval(min,max) {
		if (typeof min !== 'number')
			throw new TypeError('Expected number, got '+min);
		if (typeof max !== 'number')
			throw new TypeError('Expected number, got '+max);
		if (max <= min)
			throw new TypeError('Minimum needs to be smaller than maximum.');
		if (min === -Infinity && max === Infinity)
			return function(x) {
				return (Math.atan(x) + Math.PI/2)/Math.PI;
			}
		else if (min === -Infinity)
			return function(x) {
				return Math.atan(x + max) * Math.PI/2;
			}
		else if (max === Infinity)
			return function(x) {
				return Math.atan(x - min) * Math.PI/2;
			}
		else 
			return function(x) {
				return (x - min) / (max - min)
			}
	}

	function fromClosedUnitInterval(min,max) {
		if (min === -Infinity || max === Infinity)
			throw new TypeError();
		if (max <= min)
			throw new TypeError('Minimum needs to be smaller than maximum.');
		return function(x) {
			return x * (max - min) + min;
		}
	}

	return {
		toClosedUnitInterval: toClosedUnitInterval,
		fromClosedUnitInterval: fromClosedUnitInterval,
		forOpenInterval: function(min,max) {
			throw new Error('Not implemented.');
		}
	} 
})