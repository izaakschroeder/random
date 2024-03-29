
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function() {

	"use strict";

	function MersenneTwister() {
		/* Period parameters */  
		this.N = 624;
		this.M = 397;
		this.MATRIX_A = 0x9908b0df;   /* constant vector a */
		this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
		this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

		this.mt = new Array(this.N); /* the array for the state vector */
		this.mti = this.N+1; /* mti==N+1 means mt[N] is not initialized */
		this.min = 0;
		this.max = Math.pow(2,32);
	}

	MersenneTwister.defaultSeed = 5489;

	MersenneTwister.fromSeed = function(s) {
		var twister = new MersenneTwister();
		twister.mt[0] = s >>> 0;
		for (twister.mti=1; twister.mti<twister.N; twister.mti++) {
			var s = twister.mt[twister.mti-1] ^ (twister.mt[twister.mti-1] >>> 30);
			twister.mt[twister.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + twister.mti;
			twister.mt[twister.mti] >>>= 0;
		}
		return twister;
	}

	 
	/* initialize by an array with array-length */
	/* init_key is the array for initializing keys */
	/* key_length is its length */
	/* slight change for C++, 2004/2/26 */
	MersenneTwister.fromArray = function(init_key, key_length) {
		var i, j, k, twister = MersenneTwister.fromSeed(19650218);
		i=1; j=0;
		k = (twister.N>key_length ? twister.N : key_length);
		for (; k; k--) {
			var s = twister.mt[i-1] ^ (twister.mt[i-1] >>> 30)
			twister.mt[i] = (twister.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j; /* non linear */
			twister.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++; j++;
			if (i>=twister.N) { twister.mt[0] = twister.mt[twister.N-1]; i=1; }
			if (j>=key_length) j=0;
		}
		for (k=twister.N-1; k; k--) {
			var s = twister.mt[i-1] ^ (twister.mt[i-1] >>> 30);
			twister.mt[i] = (twister.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i; /* non linear */
			twister.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
			i++;
			if (i>=twister.N) { twister.mt[0] = twister.mt[twister.N-1]; i=1; }
		}

		twister.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
		return twister;
	}
	 
	/* generates a random number on [0,0xffffffff]-interval */
	MersenneTwister.prototype.random = function() {
		var y;
		var mag01 = new Array(0x0, this.MATRIX_A);
		/* mag01[x] = x * MATRIX_A  for x=0,1 */

		if (this.mti >= this.N) { /* generate N words at one time */
			var kk;

			if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
				throw new Error();

			for (kk=0;kk<this.N-this.M;kk++) {
				y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
				this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
			}
			
			for (;kk<this.N-1;kk++) {
				y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
				this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
			}

			y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
			this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

			this.mti = 0;
		}

		y = this.mt[this.mti++];

		/* Tempering */
		y ^= (y >>> 11);
		y ^= (y << 7) & 0x9d2c5680;
		y ^= (y << 15) & 0xefc60000;
		y ^= (y >>> 18);

		return y >>> 0;
	}

	return MersenneTwister;

});