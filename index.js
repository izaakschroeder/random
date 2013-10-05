
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define([
	'./lib/random', 
	'./lib/distribution', 
	'./lib/mersenne'
], function(Random, Distribution, MersenneTwister) {
	
	'use strict';

	return {
		createGenerator: function(opts) {
			var backend;
			if (typeof opts === "number")
				backend = MersenneTwister.fromSeed(opts);
			else
				backend = MersenneTwister.fromSeed(Date.now());
			return new Random(backend);
		},
		Distribution: Distribution
	};

});