describe('The \'protocol\' service', function () {
	beforeEach(module('IonicitudeModule'));

	it('should be set to the correct value', inject(function (protocol) {
		expect(protocol).toEqual('architectsdk://');
	}));
});
