
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["./index"], function(Random) {
	
	"use strict";

	var 
		//Create default random number generator with given seed
		r = Random.createGenerator(578331), 
		//Create gaussian generator on top of it
		e = r.forDistribution(Random.Distribution.createNormalDistribution());

	//Get a number on [0,1)
	console.log(r.random());
	//Get an integer on [0,10)
	console.log(r.integer(0,10));
	//Get 5 integers on [0,256)
	console.log(r.bytes(5));
	//50/50 chance outcome
	console.log(r.occurs(0.5))

	//Get a number on [0,1) biased by the gaussian distribution
	//(numbers centered around 0.5 are significantly more likely
	//than those around the edges)
	console.log(e.random());
});