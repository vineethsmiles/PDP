'use strict';

describe('Controller: templatesAddCtrl', function() {
  // Load the module with MainController
beforeEach(module('adminToolApp'));

var ctrl, scope, templatesAddService, tempInherit, modules, tempDetailsService, tempSearchDetails, httpBackend, rootscope;
/*dataConfig = {'AUTO_FITMENT_HOST':'http://fitmentapp301p.stag.ch3.s.com:8180'};*/
  // inject the $controller and $rootScope services
  // in the beforeEach block
  beforeEach(inject(function($controller, $rootScope, $httpBackend, createTemplate, templatesToInherit, getTemplateDetails, getDetailsForSearch, getAllModules) {
    // Create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    rootscope = $rootScope;
    httpBackend = $httpBackend;
    templatesAddService = createTemplate;
    tempDetailsService = getTemplateDetails;
    tempInherit = templatesToInherit;
    modules= getAllModules;
    tempSearchDetails = getDetailsForSearch;
    // Create the controller
    ctrl = $controller('templatesAddCtrl', {
      $scope: scope
    });
  }));

  it('services should be defined in templatesAddCtrl controller', function() {
      expect(templatesAddService.createNewTemplate()).toBeDefined();
      expect(tempDetailsService.getDetailsForTemplate()).toBeDefined();
      expect(tempInherit.inheritableTemplates()).toBeDefined();
      expect(tempSearchDetails.getDetails()).toBeDefined();
      expect(modules.getAllModulesList()).toBeDefined(); 
  });

  it('service should return a Array and Object are return types', function() {
      var env = 'qa';
      var createTemplateObj =  {
                                  template:{
                                            name:'testName',
                                            template:'prod desc',
                                            store:'Test',
                                            keys:{
                                              itemClass:'appliances',
                                              storeName:'test'
                                            },
                                            modules:{}
                                           }
                               };
      expect(angular.isObject(templatesAddService.createNewTemplate({env:env}, createTemplateObj))).toBe(true);
  });

 it('searchTemplate test', inject(function(getDetailsForSearch) {
      spyOn(getDetailsForSearch, 'getDetails');
      scope.searchTemplate('appliances');
      expect(getDetailsForSearch.getDetails).toHaveBeenCalled();
 }));

 it('getRowInherits function', function() {
      spyOn(tempDetailsService, 'getDetailsForTemplate');
      scope.getRowInherits('row1', 'test', true);
      expect(tempDetailsService.getDetailsForTemplate).toHaveBeenCalled();
 });

 it('getColInherits function', function() {
      spyOn(tempDetailsService, 'getDetailsForTemplate');
      scope.getColInherits('row1', 'col1', 'test', true);
      expect(tempDetailsService.getDetailsForTemplate).toHaveBeenCalled();
 });

 it('checkRowForDeleteButton function', function() {
      expect(scope.checkRowForDeleteButton('row1')).toBe(false);
      expect(scope.checkRowForDeleteButton('row5')).toBe(true);
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

 it('saveTemplate test', function() {
      var templateAdd= {};
      templateAdd.modules={  
                                     'row1':{  
                                        'col1':[]
                                     },
                                     'row2':{  
                                        'col1':[],
                                        'col2':[]
                                     },
                                     'row3':{  
                                        'col1':[]
                                     }
                          };
      templateAdd.parentTempSelected = null;
      spyOn(templatesAddService, 'createNewTemplate');
      scope.saveTemplate(templateAdd);
      expect(templatesAddService.createNewTemplate).toHaveBeenCalled();
 });

 it('searchStringInArray function', function() {
      scope.templateAdd.inherits.containers = ['row1', 'row2'];
      expect(scope.searchStringInArray('row1')).toBe(true);
      expect(scope.searchStringInArray('row5')).toBe(false);
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
