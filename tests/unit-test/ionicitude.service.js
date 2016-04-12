describe('IonicitudeModule', function () {

  beforeEach(module('IonicitudeModule'));

  describe('Ionicitude service', function () {
    var service, libMock, settingsMock, pluginMock;

    beforeEach(function () {
      libMock = {
        foo: jasmine.createSpy('foo'),
        fooBar: "",
        barfoo: jasmine.createSpy('barfoo')
      };

      settingsMock = {
        deviceSupportsFeatures: true,
        worldsFolders: {
          foo: {}
        }
      };

      pluginMock = {
        get: function () {
          return {
            loadARchitectWorld: jasmine.createSpy('loadARchitectWorld')
          }
        }
      };

      module(function ($provide) {
        $provide.value('lib', libMock);
        $provide.value('settings', settingsMock);
        $provide.value('plugin', pluginMock);
      })
    });

    beforeEach(inject(function (Ionicitude) {
      service = Ionicitude;
    }));

    it('should have an \'initService\' property that is a method', function () {
      expect(service.initService).toBeDefined();
      expect(service.initService).toEqual(jasmine.any(Function));
    });

    xdescribe('parseActionUrl()', function () {
      it('should return object with function and parameters properties from url', function () {
        var url = 'architectsdk://foo?{"bar":"foobar"}';
        var object = {
          funcName: 'foo',
          parameters: {
            bar: 'foobar'
          }
        };
        var result = service.parseActionUrl(url);
        expect(result).toEqual(object);
      });

      it('should return object with function property from url', function () {
        var url = 'architectsdk://foo';
        var result = service.parseActionUrl(url);
        var object = {
          funcName: 'foo',
          parameters: null
        };
        expect(result).toEqual(object);
      });

      it('should throw an error because of a bad json parameter after the \'?\'', function () {
        var url = 'architectsdk://foo?bar';
        expect(function () {
          service.parseActionUrl(url)
        }).toThrowError(SyntaxError);
      });

      it('should throw an error because of a badly formed url', function () {
        var url = 'foo';
        expect(function () {
          service.parseActionUrl(url)
        }).toThrowError(SyntaxError);
      })
    });

    xdescribe('executeActionCall()', function () {
      it('should call the foo function with no parameter', function () {
        var url = 'architectsdk://foo';
        service.executeActionCall(url);
        expect(libMock.foo).toHaveBeenCalledWith(null);
      });
      it('should call the barfoo function with a foo and a bar parameter', function () {
        var url = 'architectsdk://barfoo?{"foo":"fooValue","bar":"barValue"}';
        service.executeActionCall(url);
        expect(libMock.barfoo).toHaveBeenCalledWith({foo: "fooValue", bar: "barValue"});
      });
      it('should throw an exception caused by the missing bar function', function () {
        var url = 'architectsdk://bar';
        expect(function () {
          service.executeActionCall(url)
        }).toThrowError(TypeError);
      });
      it('should thow an excpetion caused by calling an non-function property', function () {
        var url = 'architectsdk://fooBar';
        expect(function () {
          service.executeActionCall(url)
        }).toThrowError(TypeError);
      })
    });

    describe('launchAR()', function () {
      it('should throw an error if the device does not support features', function () {
	      settingsMock.deviceSupportsFeatures = false;
        expect(service.launchAR).toThrowError(UnsupportedFeatureError);
      });

      it('should throw an error if the requested World does not exists', function () {
        expect(function(){service.launchAR('bar')}).toThrowError(SyntaxError);
      });

      //TODO : vérifier que l'appel à été fait avec le bon nom pour getWorldUrl()
    })
  })
});
