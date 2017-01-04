'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:templatesAddCtrl
 * @description
 * # templatesAddCtrl
 * Controller of the adminToolApp
 */
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};

angular.module('adminToolApp')
  .controller('templatesAddCtrl', function ($scope, $rootScope, $modal, getAllModules, createTemplate, cacheMap, localStorageService, $location, $route, templatesToInherit, getTemplateDetails, getDetailsForSearch, getAdminStores, Types, adminToolUtilityService) {
     $('#pageConfigurations').addClass('active');
    
     $scope.searchResultArray = [];
     $scope.currentEnvironment = localStorageService.get('env');
     $scope.isCollapsed = true;
     $scope.isCollapsedCol = true;
     $scope.isCollapsedModule = false;
     $scope.templateAdd = {};

     var environment = cacheMap.get($scope.currentEnvironment.replace(/\s+/g,''));
     var parentTemplateMap = {};

     $('[name="inherit-enable"]').bootstrapSwitch('state', false); //jshint ignore:line
     $('input[name="inherit-enable"]').on('switchChange.bootstrapSwitch', function(event, state) { //jshint ignore:line
        if(state===false){
            $('#enableSelect').prop('disabled', 'disabled');
            $scope.parentTemplateList = null;
            $('#enableSelect').select2('val', '');
            $scope.$apply();
        }
        else{
             $('#enableSelect').prop('disabled', false);
             templatesToInherit.inheritableTemplates({env:environment}, function(res){
                $scope.parentTemplateList = res.data.templates;
                angular.forEach($scope.parentTemplateList, function(val){
                    parentTemplateMap[val.name] = val.id;
                });
             });
        }     
     });

     getAdminStores.getStoresList({env:environment}, function(res){
        $scope.tempAddStrNameList = res.data.stores;
     });

     Types.getTemplateTypes({env:environment}, function(res){
        $scope.typeList = res.data;
     });
        
     getAllModules.getAllModulesList({env:environment},
                              function(res){
                                $scope.saveAlert = false;
                                angular.forEach(res.data.modules, function(val, i){ //jshint ignore:line
                                    angular.forEach(val.parameters, function(v, i){
                                        var mod = {};
                                        mod.id = i;
                                        mod.param = '';
                                        if(v !== null){
                                          mod.domDecider = angular.toJson(v);
                                        }
                                        else{
                                          v = {
                                                 inputType:'text'
                                              };
                                          mod.domDecider = angular.toJson(v);
                                        }
                                        val.parameters[i]= mod;
                                    });
                               });
                                $scope.addmodulesList = res.data.modules;     
                              });

      function getInputType(moduleName){
         var result;
         angular.forEach($scope.addmodulesList, function(listVal){
            angular.forEach(listVal.parameters, function(paramVal){
             if(paramVal !== null){
               if(paramVal.id === moduleName){
                 result= paramVal.domDecider;
               }
             }
            });
         });
         return result;
      }


     var kys = [{           
                tKey:'storeName',
                tVal:''        
               },
               {           
                tKey:'itemClassName',
                tVal:''        
               },
               {           
                tKey:'type',
                tVal:''        
               }];

     $scope.templateAdd.keys = kys;

     $scope.addKeysToTemplate = function(){
        var obj ={
                tKey:'Enter Text',
                tVal:''
              };  
        $scope.templateAdd.keys.push(obj);
     };

     $scope.templateAddDeleteKey= function(index){
      $scope.templateAdd.keys.splice(index, 1);
     };
     
     $scope.templateAdd.modules={  
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

    $scope.templateAdd.inherits = {};
    $scope.templateAdd.inherits.parent = {};
    $scope.templateAdd.inherits.parent.id = '';
    $scope.templateAdd.inherits.parent.name = '';
    $scope.templateAdd.inherits.containers = [];

    $scope.saveTemplate = function(templateObj){
      var keyObj = {};

      if(templateObj.parentTempSelected !== null && templateObj.parentTempSelected !== '' && templateObj.parentTempSelected !== 'undefined'){
        templateObj.inherits.parent.id = parentTemplateMap[templateObj.parentTempSelected];
        templateObj.inherits.parent.name = templateObj.parentTempSelected;
      }
      
      angular.forEach($scope.templateAdd.keys , function(obj, ind){
        keyObj[obj.tKey] = obj.tVal;
        delete $scope.templateAdd.keys[ind];
      });
      
      if(keyObj.hasOwnProperty('pid')){
        templateObj.name = templateObj.name+'::'+keyObj.pid;
      }

      if(keyObj.hasOwnProperty('itemClassName') && keyObj.itemClassName !== '' && keyObj.itemClassName !== 'undefined' && keyObj.itemClassName !== null){
        var temp = keyObj.itemClassName.split('--');
        keyObj.itemClassId = temp[1];
        keyObj.itemClassName = temp[0]+' '+'('+temp[2]+')';
      }

      angular.forEach($scope.templateAdd.modules, function(i){
                 angular.forEach(i, function(j){
                    angular.forEach(j, function(k){
                        angular.forEach(k, function(m){
                             angular.forEach(m, function(n){
                                if(angular.isObject(n)){
                                  if(n.param === ''){
                                    m[n.id] = null;
                                  }else{
                                    m[n.id] = n.param;
                                  }
                                }
                             });
                             
                        });
                    });
                });
      });

      var environment = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));
      var createTemplateObj =  {
                                  template:{
                                            name:templateObj.name,
                                            template:templateObj.template,
                                            store:keyObj.storeName,
                                            keys:keyObj,
                                            modules:templateObj.modules
                                           }
                               };

      if(templateObj.parentTempSelected !== null && templateObj.parentTempSelected !== '' && templateObj.parentTempSelected !== undefined){
        createTemplateObj.inheritEnabled = 'enabled';
        createTemplateObj.parentTemplate = templateObj.inherits.parent.id;
        createTemplateObj.template.inherits = templateObj.inherits;
        if(createTemplateObj.template.inherits.containers !== '' && createTemplateObj.template.inherits.containers !== null && createTemplateObj.template.inherits.containers !== undefined){
          if(adminToolUtilityService.containsAll(['row2.col1', 'row2.col2'], createTemplateObj.template.inherits.containers)){
            var index1 = createTemplateObj.template.inherits.containers.indexOf('row2.col1');
            createTemplateObj.template.inherits.containers.splice(index1, 1);
            var index2 = createTemplateObj.template.inherits.containers.indexOf('row2.col2');
            createTemplateObj.template.inherits.containers.splice(index2, 1);
            createTemplateObj.template.inherits.containers.push('row2');
          }
        }
      }else{
        createTemplateObj.template.inherits = null;
      }
        createTemplate.createNewTemplate({env:environment},
                                       createTemplateObj, function(res){
                                       if(res.status === 200){
                                            $scope.errMsg = 'Template Create Success!'+' '+'TemplateId'+' '+res.data.template.id;
                                            $modal.open({
                                                    templateUrl: 'createConfirmation.html',
                                                    controller: 'templateModelPopUpCtrl',
                                                    size:'lg',
                                                    backdrop:'static',
                                                    resolve: {
                                                                eMsg: function(){
                                                                  return $scope.errMsg;
                                                                }
                                                             }
                                            });
                                        }
                                        $location.path('/templatesList');
                                       }, function(err){
                                            $scope.errMsg = err.data.message+' '+'Please redo';
                                            $modal.open({
                                                    templateUrl: 'createConfirmation.html',
                                                    controller: 'templateModelPopUpCtrl',
                                                    size:'lg',
                                                    backdrop:'static',
                                                    resolve: {
                                                                 eMsg: function(){
                                                                  return $scope.errMsg;
                                                                }
                                                             }
                                            });
                                            $route.reload();
                                   });
    };

     $scope.checkKeysForStore = function(a){
        if(a === 'storeName'){
            return true;
        }
     };

     $scope.checkKeysForType = function(a){
        if(a === 'type'){
            return true;
        }
     };

     $scope.checkKeysForItemClass = function(a){
        if(a === 'itemClassName'){
            return true;
        }
     };

     $scope.checkKeysForNotStore = function(a){
        if(a !== 'storeName' && a !== 'itemClassName' && a !== 'type'){
            return true;
        }
     };

     $scope.addTempModulesAddNewRow = function(){
       $scope.templateAdd.modules['row'+(Object.keys($scope.templateAdd.modules).length+1)] = {};
     };

     $scope.addTempModulesAddNewCol = function(rowObj){
       rowObj['col'+(Object.keys(rowObj).length+1)] = [];
     };

     $scope.handleDrop = function(item, bin) {
       var ite = JSON.parse(item);
       var obj ={};
       obj[ite.name] = ite.parameters;
       var partsOfStr = bin.split('+');
       var rowKey = partsOfStr[0];
       var colKey = partsOfStr[1];
       var scopeCol = $scope.templateAdd.modules[rowKey];
       var div = document.getElementById(item);
       if($scope.templateAdd.inherits.containers.length >0 && ['row1','row2','row3'].contains(rowKey)){
       var temp = adminToolUtilityService.find(rowKey, $scope.templateAdd.inherits.containers);
       if(rowKey === 'row1' || rowKey === 'row3'){
         if(adminToolUtilityService.searchString(rowKey, temp)){
          div.parentNode.removeChild(div);
         }else{
               angular.forEach(scopeCol, function(val, ind){
                    if(ind === colKey){
                      val.push(obj);
                      div.parentNode.removeChild(div);
                    }
               });
         }
       }
       if(rowKey === 'row2'){
         if(adminToolUtilityService.searchString(rowKey+'.'+colKey, temp)){
          div.parentNode.removeChild(div);
        }else{
               angular.forEach(scopeCol, function(val, ind){
                    if(ind === colKey){
                      val.push(obj);
                      div.parentNode.removeChild(div);
                    }
               });
        }
       }
      }else{
               angular.forEach(scopeCol, function(val, ind){
                    if(ind === colKey){
                      val.push(obj);
                      div.parentNode.removeChild(div);
                    }
               });
      }
     };

     $scope.getKey = function(v){
        for (var key in v){
          return key;
        }
    };

    $scope.getValue = function(v){
        for (var key in v){
         return v[key];
        }
    };

    $scope.getKeyByValue = function(obj, value){
        for( var prop in obj ) {
            if( obj.hasOwnProperty( prop ) ) {
                 if( obj[ prop ] === value ){
                     return prop;
                 }
            }
        }
    };

    $scope.deleteModule = function(key, mainValue){
       mainValue.splice(key,1);
    };

    $scope.deleteModuleRow = function(modRowkey){
       delete $scope.templateAdd.modules[modRowkey];
    };

    $scope.deleteKeys = function(randomID){
      delete $scope.templateData.data.template.keys[randomID];
    };

    $scope.searchTemplate = function(searchString){
      getDetailsForSearch.getDetails({searchString:searchString}, 
                                            function(res){
                                              $scope.searchResultArray = [];
                                              var searchResult = res;
                                              angular.forEach(searchResult, function(val){
                                                $scope.searchResultArray.push(val);
                                              });
                                    });
    };

    //DOM checkers
    $scope.domCheck = function(dom){
      if(dom !== undefined && dom !== null){
          if(dom.hasOwnProperty('domDecider')){
              $scope.selectOptions = [];
             if(dom.domDecider !== 'undefined' && dom.domDecider !== 'null'){
              var domD = JSON.parse(dom.domDecider);
              if(domD.inputType === 'select' && domD.hasOwnProperty('options')){
                angular.forEach(domD.options, function(domDOption){
                  $scope.selectOptions.push(domDOption);
                });
              }
              return domD.inputType;
            }
          }
       }
    };
   
    $scope.checkRowForDeleteButton = function(rowKey){
      if(['row1', 'row2','row3'].contains(rowKey)){
       return false;
      }
      else{
        return true;
      }
    };

    $scope.deleteColumn = function(colKey, modRowVal){
       delete modRowVal[colKey];
    };

    $scope.getRowInherits = function(row, parentTemplate, rowCheckedVal){
      if(rowCheckedVal){
       var tempID = parentTemplateMap[parentTemplate];
       getTemplateDetails.getDetailsForTemplate({env:environment, templateId:tempID}, 
                                        function(res){
                                          angular.forEach(res.data.template.modules, function(i){
                                            angular.forEach(i, function(j){
                                              angular.forEach(j, function(k){
                                                       angular.forEach(k, function(m){
                                                         angular.forEach(m, function(n){
                                                          var o = {};
                                                          o.id = $scope.getKeyByValue(m,n);
                                                          o.param = n;
                                                          o.domDecider = getInputType(o.id);
                                                          if(typeof o.param !== 'undefined'){
                                                            if(typeof o.domDecider === 'undefined'){
                                                              var domVar =  {
                                                                              inputType:'text'
                                                                            };
                                                              o.domDecider = JSON.stringify(domVar);
                                                            }
                                                          }  
                                                          m[o.id]= o;
                                                         });
                                                   });
                                                });
                                             });
                                          });
                                          var modules = res.data.template.modules;
                                          $scope.templateAdd.modules[row] = modules[row];
                                        });

          if($scope.templateAdd.inherits.containers !== undefined && $scope.templateAdd.inherits.containers !== null){
            if(!$scope.templateAdd.inherits.containers.contains(row)){
                  $scope.templateAdd.inherits.containers.push(row);
            }
          }
        }
        else{
           if($scope.templateAdd.inherits.containers !== undefined && $scope.templateAdd.inherits.containers !== null){
                if($scope.templateAdd.inherits.containers.contains(row)){
                   var index = $scope.templateAdd.inherits.containers.indexOf(row);
                    if (index > -1) {
                         $scope.templateAdd.inherits.containers.splice(index, 1);
                         /*angular.forEach($scope.templateAdd.modules[row], function(val){
                              val.splice(0,val.length);
                         });*/
                    }
                }
           }

          var i = $scope.templateAdd.inherits.containers.length;
          while (i--){
              if ($scope.templateAdd.inherits.containers[i].match(row)) {
                  $scope.templateAdd.inherits.containers.splice(i, 1);
              }
          }
        }
    };

    $scope.getColInherits = function(row, col, parentTemplate, rowCheckedVal){
      var modpluscol = row+'.'+col;
      if(rowCheckedVal){
        if($scope.templateAdd.inherits.containers !== undefined && $scope.templateAdd.inherits.containers !== null){
                      if(!$scope.templateAdd.inherits.containers.contains(modpluscol)){
                        $scope.templateAdd.inherits.containers.push(modpluscol);
                      }
        }
       var tempID = parentTemplateMap[parentTemplate];
       getTemplateDetails.getDetailsForTemplate({env:environment, templateId:tempID}, 
                                        function(res){
                                          angular.forEach(res.data.template.modules, function(i){
                                            angular.forEach(i, function(j){
                                              angular.forEach(j, function(k){
                                                       angular.forEach(k, function(m){
                                                         angular.forEach(m, function(n){
                                                          var o = {};
                                                          o.id = $scope.getKeyByValue(m,n);
                                                          o.param = n;
                                                          o.domDecider = getInputType(o.id);
                                                          if(typeof o.param !== 'undefined'){
                                                            if(typeof o.domDecider === 'undefined'){
                                                              var domVar =  {
                                                                              inputType:'text'
                                                                            };
                                                              o.domDecider = JSON.stringify(domVar);
                                                            }
                                                          }  
                                                          m[o.id]= o;
                                                         });
                                                     });
                                                 });
                                             });
                                          });
                                          var modules = res.data.template.modules;
                                          $scope.templateAdd.modules[row][col] = modules[row][col];
                                        });
        }
        else{
          if($scope.templateAdd.inherits.containers !== undefined && $scope.templateAdd.inherits.containers !== null){
           if($scope.templateAdd.inherits.containers.contains(modpluscol)){
            var index = $scope.templateAdd.inherits.containers.indexOf(modpluscol);
            if (index > -1) {
                $scope.templateAdd.inherits.containers.splice(index, 1);
            }
           }
          }
          //$scope.templateAdd.modules[row][col].splice(0, $scope.templateAdd.modules[row][col].length);
        }
    };

$scope.inheritColumnCheck = function(colKey, modRowkey, container){
  var modpluscol = modRowkey+'.'+colKey;
  if(container !== undefined && container !== null && container.contains(modpluscol)){
        return container.contains(modpluscol);
  }
  else{
    if(modRowkey === 'row2' || modRowkey === 'row1' || modRowkey === 'row3'){
      if(container !== undefined && container !== null){
        if(modRowkey === 'row2'){
          if(!container.contains(modpluscol) && container.contains(modRowkey)){
              container.push(modpluscol);
            if(container.contains('row2.col1') && container.contains('row2.col2') && container.contains('row2')){
              var index = container.indexOf('row2');
              container.splice(index, 1);
            }
          }
        }
        return container.contains(modRowkey);
      }
    }
  }
};


$scope.searchStringInArray = function(str){
  for (var j=0; j<$scope.templateAdd.inherits.containers.length; j++) {
        if ($scope.templateAdd.inherits.containers[j].match(str))
         {
          return true;
         } 
    }
    return false;
};


});
