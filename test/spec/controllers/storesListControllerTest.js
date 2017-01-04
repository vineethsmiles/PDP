'use strict';

describe('Controller: storesListCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, storeListService, httpBackend, rootscope, cMap,localSS;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, cacheMap,localStorageService, getAdminStores) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    storeListService = getAdminStores;
    cMap = cacheMap;
    localSS = localStorageService;
    // Create the controller
    ctrl = $controller('storesListCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in storesListCtrl controller', function() {
      expect(storeListService.getStoresList()).toBeDefined();
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      expect(angular.isObject(storeListService.getStoresList({env:env}))).toBe(true);
  });

  it('should trigger $watch and call all services on env change', function() {
      spyOn(storeListService, 'getStoresList'); 
      scope.env = cMap.get('INT2'); 
      scope.$digest();
      expect(storeListService.getStoresList).toHaveBeenCalled();
  });

  it('test for storeSelected function', function() {
      spyOn(localSS, 'set'); 
      spyOn(localSS, 'get');
      var strId = '1234';
      scope.storeSelected(strId);
      expect(localSS.set).toHaveBeenCalled();
  });

 it('should change location when addStores function is called', inject(function($location) {
      httpBackend.whenGET('http://pdp-services/v1/admin/stores').respond({ id: 200, name: 'xyz' });
      scope.addStores();
      scope.$apply();
      expect($location.path()).toBe('/storesAdd');
 }));
});
