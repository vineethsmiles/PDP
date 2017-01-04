'use strict';
describe('service: environmentService', function(){

  beforeEach(module('adminToolApp'));
  var httpBackend, envService;

  beforeEach(inject(function($httpBackend, environmentService) {
    httpBackend = $httpBackend;
    envService = environmentService;
  }));
 
  it('envService services', function() {
      var response = envService.getEnvironments();
      expect(angular.isArray(response)).toBe(true);
      expect(response.length).toBe(10);
  });

});
