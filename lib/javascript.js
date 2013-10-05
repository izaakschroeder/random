
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function() {

	"use strict";

	function Generator(state) {
		this.state = state;
		this.min = 0;
		this.max = 1;
	}
	Generator.primes = [ 18273, 36969 ];

	Generator.prototype.step = function() {
		this.state = this.state.map(function(value, i) {
			return (Generator.primes[i]*(value & 0xFFFF) + (value >>> 16));
		});
	}

	Generator.prototype.forward = function(n) {
		for (var i = 0; i < n; ++i)
			this.step();
	}

	Generator.prototype.current = function() {
		return ((this.state[0] << 14) >>> 0) + (this.state[1] & 0x3FFFF);
	}

	Generator.prototype.random = function() {
		var res = this.current();
		this.step();
		return Generator.encodeFloat(res);
	}

	Generator.decodeFloat = function(r) {
		var buf = new Buffer(8);
		buf.writeDoubleBE(r/1048576.0+1.0, 0);
		return buf.readUInt32BE(4);
	}

	Generator.encodeFloat = function(r) {
		var buf = new Buffer(8);
		buf.writeUInt32BE(0x41300000, 0);
		buf.writeInt32BE(r & 0xFFFFFFFF,4);
		return buf.readDoubleBE(0)-1048576.0;
	}

	Generator.reconstruct = function (rx, sync) {
		var lo, hi, previousState, currentState, success;
		if (rx.length < 2) throw new TypeError('Need at least 2 random values.');
		rx = rx.map(Generator.decodeFloat);

		//Create guesses for the munged bits in initial state
		for (var g1 = 0; g1 < 16; ++g1) {
			//Create guesses for the munged bits in current state
			for (var g2 = 0; g2 < 16; ++g2) {
				//Calculate an educated guess for state[1]
				previousState = ((rx[0] & 0x3FFF) | (g1 << 14));
				currentState = ((rx[1] & 0x3FFF) | (g2 << 14));
				hi = previousState | ((((currentState - Generator.primes[1]*previousState) & 0xFFFF) << 16));

				//Calculate an educated guess for state[0]
				previousState = ((rx[0] >>> 14) - g1) & 0xFFFF ;
				currentState = ((rx[1] >>> 14) - g2) & 0xFFFF ;
				lo = previousState | ((((currentState - Generator.primes[0]*previousState) & 0xFFFF) << 16));

				//Verify the complete states recreated the actual random numbers
				for (var gp = new Generator([lo,hi]), i = 0, success = true; i < rx.length && success; ++i, gp.step()) 
					success = gp.current() === rx[i];
				
				//Guesses were correct so return a new generator with the recreated state		
				if (success) {
					var result = new Generator([lo,hi]);
					//If the user wants this generator to be in sync with the source make it so
					if (sync) 
						result.forward(rx.length);
					return result;
				}
			}
		}
		//All guesses failed; maybe not using this algorithm?
		throw new Error('Unable to reconstruct the state!');	
	}

	return Generator;

})