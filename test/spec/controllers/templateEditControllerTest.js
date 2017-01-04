'use strict';

describe('Controller: templatesEditCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, modules, tempInherit, updateTemp, tempDetailsService, tempSearchDetails, httpBackend, rootscope;
  beforeEach(inject(function($controller, $rootScope, $httpBackend, templatesToInherit, getTemplateDetails, getDetailsForSearch, getAllModules, updateTemplate) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    tempDetailsService = getTemplateDetails;
    tempInherit = templatesToInherit;
    //templateRevert = templateRevert;
    modules= getAllModules;
    updateTemp = updateTemplate;
    tempSearchDetails = getDetailsForSearch;
    // Create the controller
    ctrl = $controller('templatesEditCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in templatesEditCtrl controller', function() {
      expect(tempDetailsService.getDetailsForTemplate()).toBeDefined();
      expect(tempInherit.inheritableTemplates()).toBeDefined();
      expect(tempSearchDetails.getDetails()).toBeDefined();
      expect(modules.getAllModulesList()).toBeDefined(); 
  });

  it('searchTemplate services', function() {
      spyOn(tempSearchDetails, 'getDetails');
      scope.searchTemplate();
      expect(tempSearchDetails.getDetails).toHaveBeenCalled();
  });

  it('rowBoxChecked function', function() {
      spyOn(tempDetailsService, 'getDetailsForTemplate');
      scope.rowBoxChecked('row1', ['row1','row3'], true, 'test');
      expect(tempDetailsService.getDetailsForTemplate).toHaveBeenCalled();
  });

  it('colBoxChecked function', function() {
      spyOn(tempDetailsService, 'getDetailsForTemplate');
      scope.colBoxChecked('col1', 'row1', ['row1','row3'], true, 'test');
      expect(tempDetailsService.getDetailsForTemplate).toHaveBeenCalled();
  });

  it('domCheck function', function() {
     var inType= {
                     inputType:'textarea'
                 };
     var dom =  {
                     domDecider:JSON.stringify(inType),
                     id:'test',
                     param:''
                };
     expect(scope.domCheck(dom)).toBe('textarea');
 });

 it('checkRowForDeleteButton function', function() {
    expect(scope.checkRowForDeleteButton('row1')).toBe(false);
    expect(scope.checkRowForDeleteButton('row5')).toBe(true);
 });

 it('searchStringInArray function', function() {
    var containers = ['row1', 'row2'];
    expect(scope.searchStringInArray('row1', containers)).toBe(true);
    expect(scope.searchStringInArray('row5', containers)).toBe(false);
 });

 it('inheritColumnCheck function', function() {
      scope.containers = ['row2', 'row3'];
      scope.inheritColumnCheck('col1', 'row2', scope.containers);
      expect(scope.containers.length).toBe(3);
      var index = scope.containers.indexOf('row2.col1');
      //container contains 'row2.col1' using index check
      expect(index).toBe(2);
 });

});


