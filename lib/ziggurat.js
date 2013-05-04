
//See: http://www.doornik.com/research/ziggurat.pdf

if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(function() {

	"use strict";

	function Ziggurat(source) {
		this.source = source;
	}

	Ziggurat.fromSource = function(source) {
		return new Ziggurat(source);
	}

	Ziggurat.blockSize = 128;
	Ziggurat.tail = 3.442619855899;
	Ziggurat.derp = 9.91256303526217e-3;
	Ziggurat.s_adZigX = new Array(Ziggurat.blockSize + 1);
	Ziggurat.s_adZigR = new Array(Ziggurat.blockSize);

	Ziggurat.init = function() {
		var f = Math.exp(-0.5 * Ziggurat.tail * Ziggurat.tail);
		
		Ziggurat.s_adZigX[0] = Ziggurat.derp / f; /* [0] is bottom block: V / f(R) */
		Ziggurat.s_adZigX[1] = Ziggurat.tail;
		Ziggurat.s_adZigX[Ziggurat.blockSize] = 0;
		
		for (var i = 2; i < Ziggurat.blockSize; f = Math.exp(-0.5 * Ziggurat.s_adZigX[i] * Ziggurat.s_adZigX[i]), ++i) 
			Ziggurat.s_adZigX[i] = Math.sqrt(-2 * Math.log(Ziggurat.derp / Ziggurat.s_adZigX[i - 1] + f));
		
		for (var i = 0; i < Ziggurat.blockSize; ++i)
			Ziggurat.s_adZigR[i] = Ziggurat.s_adZigX[i + 1] / Ziggurat.s_adZigX[i];
	}

	Ziggurat.prototype.tail = function(dMin, iNegative)
	{
		var x,y;
		do
		{
			x = Math.log(this.source.numberOnOpenUnitInterval()) / dMin;
			y = Math.log(this.source.numberOnOpenUnitInterval());
		} while (-2 * y < x * x);
		return iNegative ? x - dMin : dMin - x;
	}

	Ziggurat.prototype.random = function() {

		for (;;)
		{
			var 
				u = 2 * this.source.numberOnOpenUnitInterval() - 1,
				i = this.source.byte() & 0x7F;
			
			/* first try the rectangular boxes */
			if (Math.abs(u) < Ziggurat.s_adZigR[i])
				return u * Ziggurat.s_adZigX[i];
			/* bottom box: sample from the tail */
			if (i == 0)
				return this.tail(Ziggurat.tail, u < 0);
			
			/* is this a sample from the wedges? */
			var 
				x = u * Ziggurat.s_adZigX[i],
				f0 = Math.exp(-0.5 * (Ziggurat.s_adZigX[i] * Ziggurat.s_adZigX[i] - x * x) ),
				f1 = Math.exp(-0.5 * (Ziggurat.s_adZigX[i+1] * Ziggurat.s_adZigX[i+1] - x * x) );
		
			if (f1 + this.source.numberOnOpenUnitInterval() * (f0 - f1) < 1.0)
				return x;
		}
	}



	Ziggurat.init();

	return Ziggurat;

});
