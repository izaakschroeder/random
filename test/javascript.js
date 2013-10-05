
if (typeof define !== 'function') { var define = require('amdefine')(module) }	

define(['../lib/javascript', 'assert'], function(Generator, assert) {
	describe('JavaScript', function() {
		
		describe('decodeFloat', function() {
			it('should decode properly', function() {
				assert.strictEqual(Generator.decodeFloat(0.3377773326355964), 0x56789345);
				assert.strictEqual(Generator.decodeFloat(0.9971110774204135), 0xFF42ABEC);
			});
		})

		describe('encodeFloat', function() {
			it('should encode properly', function() {
				assert.strictEqual(Generator.encodeFloat(0x56789345), 0.3377773326355964);
				assert.strictEqual(Generator.encodeFloat(0xFF42ABEC), 0.9971110774204135);
			});
		});

		describe('reconstruct', function() {
			it('should create a generator that follows the local random state', function() {
				assert.strictEqual(Generator.reconstruct([Math.random(), Math.random()], true).random(), Math.random());
			});
		});
	})
})
	
	
	