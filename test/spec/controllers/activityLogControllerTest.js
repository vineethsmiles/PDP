'use strict';

describe('Controller: activityLogCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, activityLogService, activityLogYMService, httpBackend, rootscope, cMap, localSS;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, cacheMap, localStorageService, activityLog, activityLogForYM) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    activityLogService = activityLog;
    activityLogYMService = activityLogForYM;
    cMap = cacheMap;
    localSS = localStorageService;
    // Create the controller
    ctrl = $controller('activityLogCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in activityLogCtrl controller', function() {
      expect(activityLogService.getActivityLog()).toBeDefined();
      expect(activityLogYMService.getActivityLogYM()).toBeDefined();
  });

  it('service should return a Array and Object are return types for activityLogService', function() {
      var env = 'qa';
      expect(angular.isObject(activityLogService.getActivityLog({env:env}))).toBe(true);
  });

  it('service should return a Array and Object are return types for activityLogYMService ', function() {
      var env = 'qa';
      var yearMonth = '2015'+'-'+'04';
      expect(angular.isObject(activityLogYMService.getActivityLogYM({env:env, YM:yearMonth}))).toBe(true);
  });

  it('should trigger $watch and call all services on env change', function() {
      spyOn(activityLogService, 'getActivityLog'); 
      scope.env = cMap.get('INT2'); 
      scope.$digest();
      expect(activityLogService.getActivityLog).toHaveBeenCalled();
  });
});
