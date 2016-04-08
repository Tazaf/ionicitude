describe('The \'plugin\' service', function () {
	beforeEach(module('WikitudeModule'));

	it('should only have one method, named \'get\'', inject(function (plugin) {
		expect(plugin.get).toBeDefined();
	}))
});
