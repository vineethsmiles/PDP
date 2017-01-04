'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:moduleEditCtrl
 * @description
 * # moduleEditCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('modulesEditCtrl', function ($scope, moduleEdit, localStorageService, cacheMap, moduleUpdate, $route, $modal, adminToolUtilityService) {

    var env = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));
    var modId = localStorageService.get('moduleId');

    angular.element(document).ready(function(){
       $scope.isModulesEditAdmin = JSON.parse(localStorageService.get('isAdmin'));
    });
    
    moduleEdit.moduleEditUpdate({env:env, moduleId:modId}, function(res){
       $scope.saveAlert = false;
       $scope.moduleData = res.data.module; 
       if($scope.moduleData.parameters !== null && $scope.moduleData.parameters !== undefined){
         angular.forEach($scope.moduleData.parameters, function(n, ky){
                      if(n === null){
                        n = {};
                        n.inputType = 'text';
                        delete $scope.moduleData.parameters[ky];
                        $scope.moduleData.parameters[Object.keys($scope.moduleData.parameters)] = n;
                      }
                      if(angular.isObject(n)){
                        angular.forEach(n, function(iT, ind){
                          n.id=ind;
                          n.param = iT;
                          n.modName = ky;
                          if(n.id === 'options'){
                            n.id = 'inputType';
                          }
                          delete n[ind];
                        });
                      }
                     });
       }
    }, function(){
        $scope.saveAlert =true;
        $scope.errorMsg = 'No Results Found';
    });

    $scope.getKey = function(v){
      for (var key in v){
        return key;
      }
    };

    $scope.isCollapsed = true;
    
    $scope.deleteModule = function(colKey){
        delete $scope.moduleData.parameters[colKey];
    };

    $scope.addNewModule = function(){
        var enterModuleName = {
          id: 'inputType',
          param:'select one'
        };
        $scope.moduleData.parameters['Enter Name'+Object.keys($scope.moduleData.parameters).length] = enterModuleName ;
    };

    function updateModule(updateMod, env){
      moduleUpdate.putModuleUpdate({env:env, moduleId:modId},
                                     updateMod, 
                                     function(res){
                                              $scope.errMsg = 'module'+' '+res.data.module.name+' '+'update success';
                                                $modal.open({
                                                        templateUrl: 'moduleUpdateConfirmation.html',
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
                                     }, function(){
                                              $scope.errMsg = 'module update failed';
                                                $modal.open({
                                                        templateUrl: 'moduleUpdateConfirmation.html',
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

    $scope.updateModule = function(updateInfo){
        if(!adminToolUtilityService.isEmptyForModulesUpdate(updateInfo.parameters)){
            angular.forEach(updateInfo.parameters, function(paramVal, paramKey){
                if(paramKey === paramVal.modName){
                  
                }
                else{
                  updateInfo.parameters[paramVal.modName] = paramVal;
                  delete updateInfo.parameters[paramKey];
                }
            });
            angular.forEach(updateInfo.parameters, function(pVal){
               pVal[pVal.id] = pVal.param;
               if(pVal.id === 'inputType' && angular.isArray(pVal.param)){
                  pVal.inputType = 'select';
                  pVal.options = pVal.param;
               }
               delete pVal.id;
               delete pVal.param;
               delete pVal.modName;  
            });
            
            if(updateInfo.global_disable !== null && updateInfo.global_disable !== undefined){ //jshint ignore:line
               if(updateInfo.global_disable === 'no'){ //jshint ignore:line
                delete updateInfo.global_disable;      //jshint ignore:line
               }
            }

            var updateMod = {
               module:updateInfo
            };
            updateModule(updateMod, env);
        }
    };

    $scope.domSelectBoxCheck = function(modVal){
      if(modVal !== null && modVal !== undefined){
        var arraySelect = 'select';
        if(angular.isArray(modVal.param)){
          return arraySelect;
        }else{
            arraySelect = 'select inputType..';
          return arraySelect;
        }
      }
    };

    $scope.addOptions = function(options){
        options.push('');
    };

    $scope.deleteOption = function(options, index){
        options.splice(index,1);
    };
    
    $scope.inputTypeSelect = function(inputTypeSelectModel, colValue){
      if(inputTypeSelectModel === 'select'){
       var opArr = [];
       colValue.id = 'inputType';
       colValue.param = opArr;
      }
      else{
       colValue.id = 'inputType';
      }
    };
});
