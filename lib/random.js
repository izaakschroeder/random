
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['./rescaler', './distribution'], function(Rescaler, Distribution) {

	"use strict";

	function Random(backend,min,max) {
		
		if (typeof backend === 'function') {
			this.generate = backend;
			this.toClosedUnitInterval = Rescaler.toClosedUnitInterval(min,max);
		}
		else if (backend instanceof Object) {
			this.generate = function() {
				return backend.random();
			}
			this.toClosedUnitInterval = Rescaler.toClosedUnitInterval(backend.min,backend.max);
		}
		else
			throw new TypeError();
	}

	Random.prototype.forDistribution = function(f) {
		var source = this, next = Distribution.fromProbabilityDistributionFunction(f.probabilityDistributionFunction, f.min, f.max);
		return new Random(function() {
			return next(source.inUnitInterval());
		}, f.min, f.max);
	}

	Random.prototype.bytes = function(n, _out) {
		var rescaler = Rescaler.fromClosedUnitInterval(0,256), out = _out || [ ];
		for (var i = 0; i < n; ++i)
			out[i] = Math.floor(rescaler(this.inUnitInterval()));
		return out;
	}

	Random.prototype.occurs = function(chance) {
		return this.inUnitInterval() <= chance;
	}

	Random.prototype.inUnitInterval = function() {
		return this.toClosedUnitInterval(this.generate());
	}

	Random.prototype.integer = function(min, max) {
		if (typeof max === 'undefined') { max = min; min = 0; };
		if (typeof min !== 'number') throw new TypeError();
		if (typeof max !== 'number') throw new TypeError();
		return Math.floor(this.random() * (max - min) + min);
	}

	Random.prototype.random = function() {
		return this.inUnitInterval();
	}

	Random.prototype.inInterval = function(min, max) {
		return Rescaler.fromClosedUnitInterval(min,max)(this.inUnitInterval());
	}

	return Random;
})