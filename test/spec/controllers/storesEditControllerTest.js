'use strict';

describe('Controller: storeEditCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, storeEditService, storeUpdateService, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, getStoreDetails, storeUpdate) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    storeEditService = getStoreDetails;
    storeUpdateService = storeUpdate;
    // Create the controller
    ctrl = $controller('storeEditCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in storeEditCtrl controller', function() {
      expect(storeEditService.getStoreDetailsForStoreID()).toBeDefined();
      expect(storeUpdateService.updateStoreDetails()).toBeDefined();
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      var storeId = '123dr4567777';
      expect(angular.isObject(storeEditService.getStoreDetailsForStoreID({env:env, storeId:storeId}))).toBe(true);
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      var storeId = '123dr4567777';
      var storeUpdateObj = {
                            store: {
                                id: storeId,
                                name: 'testName',
                                config: {
                                        storeID: '1234',
                                        mBoxList:[0]
                                }
                            }
                          };
      expect(angular.isObject(storeUpdateService.updateStoreDetails({env:env}, storeUpdateObj))).toBe(true);
  });

  it('updateStoreInfo service', inject(function() {
      spyOn(storeUpdateService, 'updateStoreDetails');
      scope.updateStoreInfo();
      expect(storeUpdateService.updateStoreDetails).toHaveBeenCalled();
  }));

});
