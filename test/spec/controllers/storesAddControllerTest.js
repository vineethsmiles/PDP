'use strict';

describe('Controller: storesAddCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, storeAddService, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, storeAdd) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    storeAddService = storeAdd;
    // Create the controller
    ctrl = $controller('storesAddCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in storesAddCtrl controller', function() {
      expect(storeAddService.addNewStore()).toBeDefined();
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      var addStoreObj = {
                            store: {
                                name: 'testStore',
                                config: {
                                        storeID: '1234',
                                        mBoxList:[0]
                                }
                            }
                         };
      expect(angular.isObject(storeAddService.addNewStore({env:env}, addStoreObj))).toBe(true);
  });
});
