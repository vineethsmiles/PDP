'use strict';

describe('Controller: operationsCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, operationAdminService, adminUtility, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, localStorageService, getAdminConfigurations, adminToolUtilityService) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    operationAdminService = getAdminConfigurations;
    adminUtility = adminToolUtilityService;
    // Create the controller
    ctrl = $controller('operationsCtrl', {
    $scope: scope
    });
  }));

  it('services should be defined in operationsCtrl controller', function() {
      expect(operationAdminService.getAdminConfig()).toBeDefined();
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      expect(angular.isObject(operationAdminService.getAdminConfig({env:env}))).toBe(true);
  });
});
