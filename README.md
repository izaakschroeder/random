# Random

## Overview

This package generates random numbers of any distribution (including uniform, normal/gaussian and exponential) and has the ability to normalize the generated numberes to any interval. Can be used as a drop-in replacement for javascript's Math.random. Works in both the browser and in nodejs.

[![Build Status](https://travis-ci.org/izaakschroeder/random.png?branch=master)](https://travis-ci.org/izaakschroeder/random)

[![License](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)


Installation:
```
npm install com.izaakschroeder.random
```

Usage:
```javascript
var 
	Random = require('com.izaakschroeder.random'),
	//Create default random number generator with given seed
	r = Random.createGenerator(578331), 
	//Create gaussian generator on top of it
	e = r.forDistribution(Random.Distribution.createNormalDistribution());

//Get a number on [0,1)
console.log(r.random());
//Get 5 integers on [0,256)
console.log(r.bytes(5));
//Get an integer on [3,8)
console.log(r.integer(3,8))
//50/50 chance outcome
console.log(r.occurs(0.5))

//Get a number on [0,1) biased by the gaussian distribution
//(numbers centered around 0.5 are significantly more likely
//than those around the edges)
console.log(e.random());
```

