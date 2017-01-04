'use strict';

describe('Controller: modulesListCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, moduleListService, cacheMapService, localStorageServicetemp, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, localStorageService, getAllModules, cacheMap) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    moduleListService = getAllModules;
    cacheMapService = cacheMap;
    localStorageServicetemp = localStorageService;
    // Create the controller
    ctrl = $controller('modulesListCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in modulesListCtrl controller', function() {
      expect(moduleListService.getAllModulesList()).toBeDefined();
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      expect(angular.isObject(moduleListService.getAllModulesList({env:env}))).toBe(true);
  });

  it('should trigger $watch and call all services on env change', function() {
      spyOn(moduleListService, 'getAllModulesList'); 
      scope.env = cacheMapService.get('INT2'); 
      scope.$digest();
      expect(moduleListService.getAllModulesList).toHaveBeenCalled();
  });

  it('test for moduleSelected function', function() {
      spyOn(localStorageServicetemp, 'set'); 
      spyOn(localStorageServicetemp, 'get');
      var modId = '1234';
      scope.moduleSelected(modId);
      expect(localStorageServicetemp.set).toHaveBeenCalled();
  });

 it('should change location when setting it via addModules function', inject(function($location) {
      httpBackend.whenGET('http://pdp-services/v1/admin/modules').respond({ id: 200, name: 'xyz' });
      scope.addModules();
      scope.$apply();
      expect($location.path()).toBe('/modulesAdd');
 }));

 it('should change location when setting it via moduleSelected function', inject(function($location) {
      spyOn(localStorageServicetemp, 'set'); 
      spyOn(localStorageServicetemp, 'get');
      var modId = '1234';
      scope.moduleSelected(modId);
      expect(localStorageServicetemp.set).toHaveBeenCalled();
      expect($location.path()).toBe('/modulesEdit');
 }));
});
