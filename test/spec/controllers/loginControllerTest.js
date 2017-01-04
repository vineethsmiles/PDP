'use strict';

describe('Controller: loginCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, loginService, environs, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, logIn, environmentService) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    loginService = logIn;
    environs = environmentService;
    // Create the controller
    ctrl = $controller('loginCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in loginCtrl controller', function() {
      expect(loginService.auth()).toBeDefined();
      expect(environs.getEnvironments()).toBeDefined();
      expect(angular.isArray(environs.getEnvironments())).toBe(true);
      var envLength = environs.getEnvironments();
      expect(envLength.length).toBe(10);
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      var loginPostData={
                              username:'rwqa',
                              password:'12345'
                            };
      expect(angular.isObject(loginService.auth({env:env}, loginPostData))).toBe(true);
  });

  it('test for login function', function() {
      spyOn(loginService, 'auth');
      var env = 'QA1';
      var loginPostData={
                              username:'rwqa',
                              password:'12345'
                        };
      scope.login(loginPostData.username, loginPostData.password, env);
      expect(loginService.auth).toHaveBeenCalled();
  });

  it('test for environmentSelect', function() {
      scope.env = 'INT2';
      spyOn(rootscope, '$emit');
      scope.environmentSelect(scope.env);
      expect(rootscope.$emit).toHaveBeenCalledWith('env_changes_on_login', scope.env);
  });
});

