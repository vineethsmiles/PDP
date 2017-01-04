'use strict';

describe('Controller: templatesListCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, templatesListService, httpBackend, rootscope, cMap, localSS;
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, cacheMap, localStorageService, getAllTemplates) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    templatesListService = getAllTemplates;
    cMap = cacheMap;
    localSS = localStorageService;
    // Create the controller
    ctrl = $controller('templatesListCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in templatesListCtrl controller', function() {
      expect(templatesListService.getAllTemplatesList()).toBeDefined();
      expect(localSS).toBeDefined();
      expect(cMap).toBeDefined();
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'QA1';
      expect(angular.isObject(templatesListService.getAllTemplatesList({env:env}))).toBe(true);
  });

  it('should trigger $watch and call all services on env change', function() {
      spyOn(templatesListService, 'getAllTemplatesList'); 
      scope.env = cMap.get('INT2'); 
      scope.$digest();
      expect(templatesListService.getAllTemplatesList).toHaveBeenCalled();
  });

  it('test for templateSelected function', function() {
      spyOn(localSS, 'set'); 
      spyOn(localSS, 'get');
      var entity = {
        id:'1234'
      };
      scope.templateSelected(entity);
      expect(localSS.set).toHaveBeenCalled();
  });

 it('should change location when templateSelected function is called', inject(function($location) {
      var entity = {
        id:'1234'
      };
      scope.templateSelected(entity);
      expect($location.path()).toBe('/editTemplate');
 }));

 it('$modal service', inject(function($modal) {
      spyOn($modal, 'open');
      scope.cloneTemplate();
      expect($modal.open).toHaveBeenCalled();
 }));

 it('createNewTemplate service', inject(function($location) {
      spyOn($location, 'path');
      scope.createNewTemplate();
      expect($location.path).toHaveBeenCalledWith('/templatesAdd');
 }));

});
