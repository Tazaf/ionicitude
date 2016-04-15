describe('IonicitudeModule', function () {

  beforeEach(module('IonicitudeModule'));

  describe('Ionicitude service', function () {
    var service, libMock, settingsMock, pluginMock;

    beforeEach(function () {
      libMock = {
        foo: jasmine.createSpy('foo'),
        fooBar: "",
        barfoo: jasmine.createSpy('barfoo'),
        already: function(){}
      };

      settingsMock = {
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
	      service.deviceSupportsFeatures = false;
        expect(service.launchAR).toThrowError(UnsupportedFeatureError);
      });

      //TODO : vérifier que l'appel à été fait avec le bon nom pour getWorldUrl()
    });

    describe('addAction()', function () {
      it('should throw Errors if bad arguments are passed', function () {
        // First argument string or function
        expect(function(){service.addAction(123)}).toThrowError(TypeError, 'Ionicitude - addAction() expects first argument to be of type \'string\' or \'function\', \'number\' given');
        // First argument string, second argument must by provided
        expect(function(){service.addAction('ok')}).toThrowError(TypeError, 'Ionicitude - addAction() expects a second argument if first argument is of type \'string\'.');
        // Second argument must be function
        expect(function(){service.addAction('ok', 123)}).toThrowError(TypeError, 'Ionicitude - addAction() expects second argument to only be of type \'function\', \'number\' given.');
        // First argument is function : must have a name
        expect(function(){service.addAction(function(){})}).toThrowError(TypeError, 'Ionicitude - addAction() do not accept anonymous function as first argument. Please, try passing a named function instead.');
        // Name should not be already used
        expect(function(){service.addAction('foo', function(){})}).toThrowError(SyntaxError, 'Ionicitude - addAction() - The name \'foo\' has already been added or is a reserved Ionicitude name.');
      });

      describe('string and callback arguments', function () {
        it('should correctly add the function', function () {
          service.addAction('functionName', function(){});
          expect(libMock.hasOwnProperty('functionName')).toBeTruthy();
          expect(libMock.functionName).toEqual(jasmine.any(Function));
        });
      });

      describe('named function argument', function () {
        it('should correctly add the function', function () {
          service.addAction(function functionName(){});
          expect(libMock.hasOwnProperty('functionName')).toBeTruthy();
          expect(libMock.functionName).toEqual(jasmine.any(Function));
        });
      });
    });

    describe('addActions()', function () {
    })
  });
});
