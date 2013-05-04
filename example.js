
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(["./index"], function(Random) {
	
	"use strict";

	var r = Random.createGaussianGenerator();


	for (var i = 0; i<10; ++i)
		console.log(r.random()*10+50);

});