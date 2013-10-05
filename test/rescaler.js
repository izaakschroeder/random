
if (typeof define !== 'function') { var define = require('amdefine')(module) }	

define(['../lib/rescaler', 'assert'], function(Rescaler, assert) {
	describe('Rescaler', function() {
		describe('toClosedUnitInterval', function() {
			it('should error on any non-numeric arguments', function() {
				assert.throws(function() {
					Rescaler.toClosedUnitInterval(false,0);
				});
				assert.throws(function() {
					Rescaler.toClosedUnitInterval(5,'hello');
				});
			});
			it('should error on negative ranges', function() {
				assert.throws(function() {
					Rescaler.toClosedUnitInterval(9,2);
				});
			});
			it('should error on null ranges', function() {
				assert.throws(function() {
					Rescaler.toClosedUnitInterval(5,5);
				});
			})
			it('should return a function', function() {
				assert.strictEqual(typeof Rescaler.toClosedUnitInterval(0,1), 'function');
			});
		});
	});
});