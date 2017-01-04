'use strict';

describe('Controller: modulesListCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, moduleEditService, moduleUpdateService, cacheMapService, localStorageServicetemp, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, localStorageService, moduleEdit, moduleUpdate, cacheMap) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    moduleEditService = moduleEdit;
    moduleUpdateService = moduleUpdate;
    cacheMapService = cacheMap;
    localStorageServicetemp = localStorageService;
    // Create the controller
    ctrl = $controller('modulesEditCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in modulesEditCtrl controller', function() {
      expect(moduleEditService.moduleEditUpdate()).toBeDefined();
      expect(moduleUpdateService.putModuleUpdate()).toBeDefined();
  });

  it('service should return a Array and Object are return types moduleEditUpdate service', function() {
      var env = 'qa';
      var modId = '52afcd4395f3c2a9dd64634f';
      expect(angular.isObject(moduleEditService.moduleEditUpdate({env:env, moduleId:modId}))).toBe(true);
  });

  it('service should return a Array and Object are return types for moduleUpdateService ', function() {
      var env = 'qa';
      var modId = '52afcd4395f3c2a9dd64634f';
      var updateMod = {
          module:{
            id: '52afcd4395f3c2a9dd64634f',
            name: 'productLayaway',
            parameters:{
                    test123:{
                      inputType:'text'
                    }
                  }
          }
      };
      expect(angular.isObject(moduleUpdateService.putModuleUpdate({env:env, moduleId:modId}, updateMod))).toBe(true);
  });
  
  it('updateModule function', function() {
      spyOn(moduleUpdateService, 'putModuleUpdate');
      var updateObj = {
        parameters: {}
      };
      scope.updateModule(updateObj);
      expect(moduleUpdateService.putModuleUpdate).toHaveBeenCalled();
  });

  it('domSelectBoxCheck function', function() {
      var obj = {
        param: [],
        id:'options',
        modName:'test'
      };
      expect(scope.domSelectBoxCheck(obj)).toBe('select');
  });

});
