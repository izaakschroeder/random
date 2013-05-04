if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["./lib/mersenne", "./lib/ziggurat"], function(MersenneTwister, Ziggurat) {
	
	"use strict";

	return {
		createUniformGenerator: function(seed) {
			return MersenneTwister.fromSeed(typeof seed !== "undefined" ? seed : Date.now())
		},
		createGaussianGenerator: function(seed) {
			return Ziggurat.fromSource(this.createUniformGenerator(seed));
		},
		createGenerator: function(opts) {
			if (typeof opts === "number")
				return this.createUniformGenerator(opts);
			//TODO: Fix me!
			throw new Error("Not yet implemented!");
		},
		occurs: function(generator, chance) {
			return generator.numberOnClosedUnitInterval() < chance;
		}
	};

});