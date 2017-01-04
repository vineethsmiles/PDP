'use strict';

describe('Controller: modulesAddCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, moduleAddService, cacheMapService, localStorageServicetemp, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, localStorageService, moduleAdd, cacheMap) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    moduleAddService = moduleAdd;
    cacheMapService = cacheMap;
    localStorageServicetemp = localStorageService;
    // Create the controller
    ctrl = $controller('modulesAddCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in modulesAddCtrl controller', function() {
      var int2 = 'int2';
      localStorageServicetemp.set('env', int2);
      expect(moduleAddService.addNewModule()).toBeDefined();
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      var addModuleObj = {
                  'module':{
                            'name':'productDescription',
                              'parameters':{
                                 inputType:'textarea'
                              }
                           }
                 };
      expect(angular.isObject(moduleAddService.addNewModule({env:env},addModuleObj))).toBe(true);
  });

  it('moduleAddService service', function() {
      var addModuleObj = {
                  'module':{
                            'name':'productDescription',
                              'parameters':{
                                 inputType:'textarea'
                              }
                           }
                 };
      spyOn(moduleAddService, 'addNewModule'); 
      scope.createModule(addModuleObj);
      expect(moduleAddService.addNewModule).toHaveBeenCalled();
  });

});
