Random
======

This package generates random numbers. Works in both the browser and in nodejs.

Installation:
```
npm install com.izaakschroeder.random
```

Usage:
```javascript
var 
	Random = require('com.izaakschroeder.random'),
	source = Random.createUniformGenerator();

console.log(source.integer());
console.log("Coin heads? "+Random.occurs(source, 0.5));

```

API Reference
=============

Random.createUniformGenerator(seed)
-----------------------------------

Uses the Mersenne Twister algorithm.

Random.createGaussianGenerator(seed)
------------------------------------

Uses the Ziggurat algorithm.
