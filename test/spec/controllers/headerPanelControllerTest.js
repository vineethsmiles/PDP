'use strict';

describe('Controller: headerPanelCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, envService, localStorageServicetemp, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, localStorageService, environmentService) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    envService = environmentService;
    localStorageServicetemp = localStorageService;
    // Create the controller
    ctrl = $controller('headerPanelCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in headerPanelCtrl controller', function() {
      expect(envService.getEnvironments()).toBeDefined();
      expect(localStorageServicetemp.get()).toBeDefined();
  });

  it('environmentSelect function', function() {
      spyOn(localStorageServicetemp, 'set'); 
      scope.environmentSelect();
      expect(localStorageServicetemp.set).toHaveBeenCalled();
  });

  it('logOut function', inject(function($location) {
      spyOn(localStorageServicetemp, 'clearAll'); 
      scope.logOut();
      expect(localStorageServicetemp.clearAll).toHaveBeenCalled();
      expect($location.path()).toBe('/login');
  }));

  it('open function', inject(function($modal) {
      spyOn($modal, 'open'); 
      scope.open();
      expect($modal.open).toHaveBeenCalled();
  }));

  it('test for environmentSelect', function() {
      scope.env = 'INT2';
      spyOn(rootscope, '$emit');
      scope.environmentSelect(scope.env);
      expect(rootscope.$emit).toHaveBeenCalledWith('env_changes_on_user_nav', scope.env);
  });

});
