'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:modulesAddCtrl
 * @description
 * # modulesAddCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('modulesAddCtrl', function ($scope, cacheMap, localStorageService, moduleAdd, $modal, $route, $location, $log, adminToolUtilityService) {
    $('#pageConfigurations').addClass('active');
    
    $scope.parameters = [];
    
    $scope.addParameters = function(){
      $scope.parameters.push({});
      $scope.isCollapsed = false;
    };

   $scope.deleteModuleParameter= function(index){
      $scope.parameters.splice(index, 1);
   };

   $scope.inputTypeSelect = function(obj){
   	if(obj.inputType === 'select'){
      obj.options = [];
   	}
   };
   
   $scope.addOptions = function(pObj){
        if(pObj.inputType === 'select'){
           var optObj = {
                           opName:''
                        };
           pObj.options.push(optObj);
        }
   };

   $scope.deleteOptions = function(options, index){
   	    options.splice(index, 1);
   };

   function moduleCreate(moduleEnv, addModuleObj){
        moduleAdd.addNewModule({env:moduleEnv},
                                  addModuleObj,
                                   function(res){
                                        $scope.errMsg = 'module'+' '+res.data.module.name+' '+'successfully created';
                                        $modal.open({
                                                          templateUrl: 'moduleAddConfirmation.html',
                                                          controller: 'templateModelPopUpCtrl',
                                                          size:'sm',
                                                          backdrop:'static',
                                                          resolve: {
                                                                      eMsg: function(){
                                                                        return $scope.errMsg;
                                                                      }
                                                                   }
                                                  });
                                        $location.path('/modulesList');
                                   }, function(err){
                                        $scope.errMsg = err.data.message+' '+'Module Create Failed';
                                        $modal.open({
                                                          templateUrl: 'moduleAddConfirmation.html',
                                                          controller: 'templateModelPopUpCtrl',
                                                          size:'sm',
                                                          backdrop:'static',
                                                          resolve: {
                                                                      eMsg: function(){
                                                                        return $scope.errMsg;
                                                                      }
                                                                   }
                                                  });
                                        $route.reload();     
      });
   }

   $scope.createModule = function(addModule, parameters){
        var parameterObj = {};
        angular.forEach(parameters, function(v){
        	if(v.hasOwnProperty('options')){
        		  var tempOpArr = [];
              angular.forEach(v.options, function(v){
              	tempOpArr.push(v.opName);
              });
              v.options = tempOpArr;
        	}
          if(v.hasOwnProperty('inputType') && v.hasOwnProperty('options')){
              if(v.inputType ==='text' || v.inputType === 'textarea'){
                delete v.options;
              }
          }
        });

        angular.forEach(parameters, function(v){
        	if(v.hasOwnProperty('options')){
                parameterObj[v.name] = {
                                     'inputType': 'select',
        		                         'options': v.options
        		                       };
        	}
        	else{
        		    parameterObj[v.name] = {
        		                         'inputType': v.inputType
        		                       };
        	}
        });
       
        try{
             var addModuleObj = {
                  'module':{
                            'name':addModule.moduleName,
                            'parameters':parameterObj    
                           }
             };
             if(!adminToolUtilityService.isEmptyForModulesAdd(addModuleObj.module.parameters)){
                  var moduleEnv = cacheMap.get(localStorageService.get('env').replace(/\s+/g,'')); 
                  moduleCreate(moduleEnv, addModuleObj);
             }
        }
        catch(err){
             $log.error('object properties not defined'+' '+err);
        }              
    }; 
});
