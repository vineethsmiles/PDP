'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:templatesEditCtrl
 * @description
 * # templatesEditCtrl
 * Controller of the adminToolApp
 */

angular.module('adminToolApp')
  .controller('templatesEditCtrl', function ($scope, cacheMap, getDetailsForSearch, getTemplateDetails, getAllModules, localStorageService, updateTemplate, $modal, $route, templatesToInherit, templateChildren, getAdminStores, templateRevert, Types, adminToolUtilityService) {
     $('#pageConfigurations').addClass('active');

    var environment = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));
    var templateID = localStorageService.get('templateId'); 
    var parentTemplateMap = {};

    angular.element(document).ready(function(){
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
                    $scope.modulesList = res.data.modules; 
                  }, function(){
                      $scope.saveAlert = true;
                      $scope.errMsg = 'No Modules Found';
                 });
        $scope.isTemplateEditAdmin = JSON.parse(localStorageService.get('isAdmin'));
    });

    $scope.searchResultArray = [];
    $scope.isCollapsed = true;
    $scope.isCollapsedCol = true;
    $scope.isCollapsedModule = false;

     // Edit template Inheritance Widget enable switch
     $('[name="editTemp-inherit-toggle"]').bootstrapSwitch('state', false); //jshint ignore:line
     // Edit template Inheritance Widget Parent Template select toggle
     $('input[name="editTemp-inherit-toggle"]').on('switchChange.bootstrapSwitch', function(event, state) { //jshint ignore:line
        if(state===false){ 
            $('#enableSelect').prop('disabled', 'disabled');
            $scope.parentTemplateList = null;
            $('#enableSelect').select2('val', '');
            $scope.templateData.data.template.inherits.containers = [];
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

templateChildren.templateChildrenList({env:environment, templateId:templateID}, function(res){
    $scope.children = res.data.templates;
});

getAdminStores.getStoresList({env:environment}, function(res){
    $scope.strNameList = res.data.stores;
});

Types.getTemplateTypes({env:environment}, function(res){
    $scope.typeList = res.data;
});

function getInputType(moduleName){
   var result;
   angular.forEach($scope.modulesList, function(listVal){
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

getTemplateDetails.getDetailsForTemplate({env:environment, templateId:templateID}, 
                                        function(res){
                                          $scope.saveAlert = false;
                                          $scope.templateData = res;
                                          if($scope.templateData.data.template.inherits!== undefined && $scope.templateData.data.template.inherits!== null){
                                           if($scope.templateData.data.template.inherits.parent.name !== undefined && $scope.templateData.data.template.inherits.parent.name !== null && $scope.templateData.data.template.inherits.parent.name !== ''){
                                             $('[name="editTemp-inherit-toggle"]').bootstrapSwitch('state', true); //jshint ignore:line
                                           }
                                          }
                                          else{
                                            $scope.templateData.data.template.inherits={};
                                            $scope.templateData.data.template.inherits.containers = [];
                                          }
                                          angular.forEach($scope.templateData.data.template.modules, function(i){
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
                                          angular.forEach($scope.templateData.data.template.keys, function(x){
                                             var ob = {};
                                             ob.tKey = $scope.getKeyByValue($scope.templateData.data.template.keys, x);
                                             ob.tVal = x;
                                             $scope.templateData.data.template.keys[Object.keys($scope.templateData.data.template.keys).length] = ob;
                                          });

                                          angular.forEach($scope.templateData.data.template.keys, function(i){
                                            if(!(angular.isObject(i))){
                                              delete $scope.templateData.data.template.keys[$scope.getKeyByValue($scope.templateData.data.template.keys,i)];
                                            }
                                          });
                                        }, function(){
                                            $scope.saveAlert = true;
                                            $scope.errMsg='No Results Found';
                                      });

$scope.colBoxChecked = function(colKey, modRowkey, container, checkedVal, parentTemplate){
  var modpluscol = modRowkey+'.'+colKey;
  if(checkedVal){
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
                                          $scope.templateData.data.template.modules[modRowkey][colKey] = modules[modRowkey][colKey];
                                        });
    if(container !== undefined && container !== null){
      if(!container.contains(modpluscol)){
        container.push(modpluscol);
      }
    }
  }
  else{
        if(container !== undefined && container !== null){
          if(container.contains(modpluscol)){
            var index = container.indexOf(modpluscol);
            if(index > -1){
                container.splice(index, 1);
            }
          }
        }
   //$scope.templateData.data.template.modules[modRowkey][colKey].splice(0, $scope.templateData.data.template.modules[modRowkey][colKey].length);
  }
};

$scope.rowBoxChecked = function(modRowkey, container, rowCheckedVal, parentTemplate){
  var row = modRowkey;
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
                                          $scope.templateData.data.template.modules[row] = modules[row];
                                        });
    if(container !== undefined && container !== null){
      if(!container.contains(row)){
            container.push(row);
      }
    }
  }
  else{
      if(container !== undefined && container !== null){
      if(container.contains(row)){
      var index = container.indexOf(row);
      if(index > -1){
            container.splice(index, 1);
          /*angular.forEach($scope.templateData.data.template.modules[row], function(val){
            val.splice(0,val.length);
          });*/
      }
     }
    }
    var i = container.length;
    while (i--){
        if (container[i].match(row)) {
        container.splice(i, 1);
        }
    }
  }
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

 $scope.childtemplateSelection = function(id){
    localStorageService.set('templateId',id);
    $route.reload();
 };

$scope.updateTemplate = function(templateObj){
  var templateObjCopy = templateObj.data;
  angular.forEach(templateObjCopy.template.modules, function(i){
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
  angular.forEach(templateObjCopy.template.keys, function(r, s){
    if(angular.isObject(r)){
      templateObjCopy.template.keys[r.tKey] = r.tVal;
      delete templateObjCopy.template.keys[s];
    }
  });

  if(templateObjCopy.template.keys.hasOwnProperty('itemClassName') && templateObjCopy.template.keys.itemClassName !== '' && templateObjCopy.template.keys.itemClassName !== 'undefined' && templateObjCopy.template.keys.itemClassName !== null){
        var temp = templateObjCopy.template.keys.itemClassName.split('--');
        templateObjCopy.template.keys.itemClassId = temp[1];
        templateObjCopy.template.keys.itemClassName = temp[0]+' '+'('+temp[2]+')';
  }else{
    templateObjCopy.template.keys.itemClassName = '';
    delete templateObjCopy.template.keys.itemClassId;
  }
  
  delete templateObjCopy.template.updated;
  var templateUpdateObj = {
    template: templateObjCopy.template
  };
 
  if(templateUpdateObj.template.inherits.containers.length >0){
    if(templateUpdateObj.template.inherits.parent.name !== '' && templateUpdateObj.template.inherits.parent.name !== null && templateUpdateObj.template.inherits.parent.name !== undefined){
      templateUpdateObj.template.inherits.parent.id = parentTemplateMap[templateUpdateObj.template.inherits.parent.name];
      templateUpdateObj.template.inherits.parent.name = templateUpdateObj.template.inherits.parent.name;
      templateUpdateObj.template.parentName = templateUpdateObj.template.inherits.parent.name;
      templateUpdateObj.template.parentId = templateUpdateObj.template.inherits.parent.id;
      if(templateUpdateObj.template.inherits.containers.length > 0){
        if(adminToolUtilityService.containsAll(['row2.col1', 'row2.col2'], templateUpdateObj.template.inherits.containers)){
          var index1 = templateUpdateObj.template.inherits.containers.indexOf('row2.col1');
          templateUpdateObj.template.inherits.containers.splice(index1, 1);
          var index2 = templateUpdateObj.template.inherits.containers.indexOf('row2.col2');
          templateUpdateObj.template.inherits.containers.splice(index2, 1);
          templateUpdateObj.template.inherits.containers.push('row2');
        }
      }
    }
    else{
      templateUpdateObj.template.inherits.containers =[];
      templateUpdateObj.template.inherits.parent = {};
    }
  }
  else{
    delete templateUpdateObj.template.inherits;
  }
  
  updateTemplate.updateTemplateDetails({env:environment, templateID:templateUpdateObj.template.id},
                                    templateUpdateObj, 
                                    function(res){
                                      $scope.errMsg = 'Template'+' '+res.data.template.name+' '+'update success';
                                      $modal.open({
                                                        templateUrl: 'updateConfirmation.html',
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
                                    }, function(res){
                                      $scope.errMsg = res.data.message;
                                      $modal.open({
                                                        templateUrl: 'updateConfirmation.html',
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
};


$scope.editTempAddKeyParams = function(){
  var obj ={
    Key:Math.random(),
    Val:{
      tKey:'Enter Text',
      tVal:''
    }
  };  
  $scope.templateData.data.template.keys[obj.Key] = obj.Val;
};

$scope.deleteModule = function(key, mainValue){
  mainValue.splice(key,1);
};

$scope.deleteKeys = function(randomID){
  delete $scope.templateData.data.template.keys[randomID];
};

//DOM checkers and DOM manipulators
$scope.checkTemplateKeyForSelectBoxForStore = function(tempKey){
  if(tempKey === 'storeName'){
    return true;
  }
};

$scope.checkTemplateKeyForSelectBoxForType = function(tempKey){
  if(tempKey === 'type'){
    return true;
  }
};

$scope.checkTemplateKeyForInputBox = function(tempKey){
  if(tempKey !== 'storeName' && tempKey !== 'itemClass' && tempKey !=='itemClassName' && tempKey !== 'type'){
    return true;
  }
};

$scope.checkTemplateKeyForSearchBox = function(tempKey){
  if(tempKey === 'itemClass' || tempKey === 'itemClassName'){
    return true;
  }
};

$scope.modulesAddNewRow = function(){
   $scope.templateData.data.template.modules['row'+(Object.keys($scope.templateData.data.template.modules).length+1)] = {};
};

$scope.modulesAddNewCol = function(rowObj){
  rowObj['col'+(Object.keys(rowObj).length+1)] = [];
};

$scope.handleDrop = function(item, bin) {
   var ite = JSON.parse(item);
   var obj ={};
   obj[ite.name] = ite.parameters;
   var partsOfStr = bin.split('+');
   var rowKey = partsOfStr[0];
   var colKey = partsOfStr[1];
   var scopeCol = $scope.templateData.data.template.modules[rowKey];
   var div = document.getElementById(item);
   if($scope.templateData.data.template.inherits !== undefined && $scope.templateData.data.template.inherits !== null && ['row1','row2','row3'].contains(rowKey)){
      var temp = adminToolUtilityService.find(rowKey, $scope.templateData.data.template.inherits.containers);
      if(rowKey === 'row1' || rowKey === 'row3'){
       if($scope.searchStringInArray(rowKey, temp)){
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
       if($scope.searchStringInArray(rowKey+'.'+colKey, temp)){
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

$scope.deleteModuleRow = function(modRowkey){
    delete $scope.templateData.data.template.modules[modRowkey];
};

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

 $scope.searchForColumnReference = function(col, row){
  if(row === 'row1'){
    if(col === 'col1'){
      return true;
    }else{
      return false;
    }
  }
  if(row === 'row2'){
    if(['col1','col2'].contains(col)){
      return true;
    }else
    {
      return false;
    }
  }
  if(row === 'row3'){
    if(col === 'col1'){
      return true;
    }else
    {
      return false;
    }
  }
 };

$scope.searchStringInArray = function(str, strArray){
  if(str !== null && str !== undefined && strArray !== null && strArray !==undefined){
     for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str))
         {
          return true;
         } 
     }
  }
    return false;
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

$scope.getKeyByValue = function(obj, value) {
    for( var prop in obj ) {
        if( obj.hasOwnProperty( prop ) ) {
             if( obj[ prop ] === value ){
                 return prop;
             }
        }
    }
};

$scope.revertRevision = function(revertId){
   templateRevert.templateRevertRevision({env:environment, ID:templateID, revID:revertId}, function(){
       $scope.errMsg = 'Template Revert Success';
       $modal.open({
                          templateUrl: 'updateConfirmation.html',
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
       $scope.errMsg = 'Template Revert Failed';
       $modal.open({
                          templateUrl: 'updateConfirmation.html',
                          controller: 'templateModelPopUpCtrl',
                          size:'sm',
                          backdrop:'static',
                          resolve: {
                                      eMsg: function(){
                                        return $scope.errMsg;
                                      }
                                   }
       });
   });
};

});
