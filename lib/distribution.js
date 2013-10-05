
if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['./rescaler'], function(Rescaler) {

	"use strict";	

	function ridder(f, a, b, tol) {
		var fa = f(a), fb = f(b), xOld;
		if (fa === 0) return a
		if (fb === 0) return b
		if (fa*fb >= 0) throw new Error('Root is not bracketed '+fa+', '+fb)
		for (var i = 0; i < 30; ++i) {
			var c = 0.5*(a + b), fc = f(c), s = Math.sqrt(fc*fc - fa*fb);
			if (s === 0.0) 
				return NaN
			var dx = (c - a)*fc/s;
			if ((fa - fb) < 0.0) 
				dx = -dx
			var x = c + dx, fx = f(x)
			//Test for convergence
			if (i > 0 && Math.abs(x - xOld) < tol*Math.max(Math.abs(x),1.0)) 
				return x
			xOld = x
			//Re-bracket the root as tightly as possible
			if (fc*fx > 0.0)
				if (fa*fx < 0.0)
					b = x, fb = fx;
				else
					a = x, fa = fx;
			else
				a = c, b = x, fa = fc, fb = fx
		}
		return NaN
	}

	function bracket(f) {
		var id = 0, zl = -0.5, zr = -zl, FAC = 1.5;

		while (f(zl)*f(zr) >= 0) {
			zl *= FAC;
			id = 1;
			if (f(zl)*f(zr) >= 0) {
				zr *= FAC;
				id = 2;
			}
		}

		return [zl,zr];
	}

	function invert(f, tol) {
		return function(t) {
			function inv(x) {
				return t - f(x) ;
			}
			var b = bracket(inv);
			return ridder(inv, b[0], b[1], tol);
		}
	}

	var nodes = [
		-0.981560634246732,
		-0.904117256370452,
		-0.7699026741943177,
		-0.5873179542866143,
		-0.3678314989981804,
		-0.1252334085114688,
		0.1252334085114688,
		0.3678314989981804,
		0.5873179542866143,
		0.7699026741943177,
		0.904117256370452,
		0.981560634246732
	];

	var weights = [
		0.04717533638647547,
		0.1069393259953637,
		0.1600783285433586,
		0.2031674267230672,
		0.2334925365383534,
		0.2491470458134027,
		0.2491470458134027,
		0.2334925365383534,
		0.2031674267230672,
		0.1600783285433586,
		0.1069393259953637,
		0.04717533638647547
	];

	function integrate(f,a,b) {
		if (a > b)
			return integrate(f,b,a);
		if (a === b)
			return 0;
		if (a === -Infinity && b === Infinity) {
			return integrate(function(t) {
				var ts = Math.pow(t,2);
				return f(t/(1-ts))*(1+ts)/Math.pow(1-ts,2);
			}, -1, 1);
		}
		else if (b === Infinity) {
			return integrate(function(t) {
				return f(a+t/(1-t))/Math.pow(1-t,2);
			}, 0, 1);
		}
		else if (a === -Infinity) {
			return integrate(function(t) {
				return f(b-(1-t)/t)/Math.pow(t,2);
			}, 0, 1);
		}
		else {
			var dx = b - a, dy = a + b;
			return 0.5 * dx * weights.reduce(function(prev, cur, i) {
				return f((dx*nodes[i] + dy)/2)*cur + prev;
			},0);
		}
	}

	

	function fromProbabilityDistributionFunction(pdf,min,max) {
		return fromCumulativeDistributionFunction(function(x) {
			return integrate(pdf,min,x);
		});
	}

	function fromCumulativeDistributionFunction(cdf) {
		return invert(cdf, 10e-5);
	}

	function Distribution(pdf, min, max) {
		this.min = min;
		this.max = max;
		this.probabilityDistributionFunction = pdf;
	}

	function normal(u, std) {
		u = u || 0;
		std = std || 1;
		return new Distribution(function(x) {
			return 1 / Math.sqrt(2*Math.PI*std*std) * Math.exp(-Math.pow(x - u, 2)/(2*std*std));
		}, -Infinity, Infinity);
	}

	function exponential(l) {
		return new Distribution(function(x) {
			return x < 0 ? 0 : l*Math.exp(-l*x);
		}, 0, Infinity);
	}

	return {
		fromProbabilityDistributionFunction: fromProbabilityDistributionFunction,
		fromCumulativeDistributionFunction: fromCumulativeDistributionFunction,
		createNormalDistribution: normal,
		createExponentialDistribution: exponential
	}
})