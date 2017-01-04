'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:storeEditCtrl
 * @description
 * # storeEditCtrl
 * Controller of the adminToolApp
 */

angular.module('adminToolApp')
  .controller('storeEditCtrl', function ($scope, $timeout, $location, getStoreDetails, storeUpdate, adminToolUtilityService, cacheMap, localStorageService, $modal) {
    $scope.saveAlert = false;
    var storeMboxTempArray = [];
    var environment = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));
    var storeId = localStorageService.get('storeId');
    var storeDetailConfigTemplate = '<input type="button" class="btn btn-danger btn-xs store-config-btn-delete" value="delete" ng-click="deleteStoreConfigParam($index)"/>';
    var storeMboxTemplate = '<input type="button" class="btn btn-danger btn-xs store-config-btn-delete" value="delete" ng-click="deleteStoreEditMboxParameters($index)"/>';
    
    angular.element(document).ready(function(){
       $scope.isStoreEditAdmin = JSON.parse(localStorageService.get('isAdmin'));
    });

    $scope.gridOptionsForStoreDetails = { 
        data: 'storeDetailsConfig',
        showSelectionCheckbox: false,
        enableCellEditOnFocus: true,
        headerRowHeight:0,
        multiSelect: false,
        enableCellSelection: true,
        enableColumnResize: true,
        enableRowSelection: true,
        columnDefs: [{
                     field:'icon',
                     displayName:'',
                     cellTemplate : '<span class="fa fa-pencil grid_icon"></span>',
                     enableCellEdit: false,
                     width: 50
                     }, {field: 'id', displayName: '', enableCellEdit: true}, {field:'name', displayName:'', enableCellEdit: true}, {field: 'remove', displayName:'', cellTemplate: storeDetailConfigTemplate, width:90, enableCellEdit: false}]
    };

    $scope.gridOptionsForStoreMboxParam = { 
        data: 'storeMbox',
        headerRowHeight:0,
        enableCellEditOnFocus: true,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResize: true,
        enableCellSelection: true,
        showSelectionCheckbox: false,
        columnDefs: [{
                     field:'icon',
                     displayName:'',
                     cellTemplate : '<span class="fa fa-pencil grid_icon"></span>',
                     enableCellEdit: false,
                     width: 50
                     }, {field: 'id', displayName: '', enableCellEdit: true}, {field: 'remove', displayName:'', cellTemplate: storeMboxTemplate,  enableCellEdit: false, width:90}]
    };

    getStoreDetails.getStoreDetailsForStoreID({env:environment, storeId:storeId}, function(res){
        var storeDetails = res;
        $scope.saveAlert = false;
        $scope.storeEditInfo = true;
        $scope.storeDetailsName = storeDetails.data.store.name;
        $scope.selectedStoreId = storeId;
        var keys = adminToolUtilityService.getObjectKeys(storeDetails.data.store.config);
        var vals = adminToolUtilityService.getObjectValues(storeDetails.data.store.config);
        $scope.storeDetailsConfig = adminToolUtilityService.buildObject(keys, vals);
        angular.forEach($scope.storeDetailsConfig, function(i, key){
                  if(i.id === 'mBoxList'){
                    $scope.storeDetailsConfig.splice(key, 1);
                  }
        });
        angular.forEach(storeDetails.data.store.config.mBoxList, function(i){
          var obj ={
                     id: i
                  };
          storeMboxTempArray.push(obj);
        });
        $scope.storeMbox = storeMboxTempArray;
    },function(){
        $scope.saveAlert = true;
        $scope.errMsg= 'No Results Found';
        $scope.storeEditInfo= false;
    });

   $scope.addStoreConfigParam = function() {
        $scope.storeDetailsConfig.push({});
        $timeout(function () {
        var grid = $scope.gridOptionsForStoreDetails.ngGrid;
        $scope.gridOptionsForStoreDetails.selectItem($scope.storeDetailsConfig.length - 1, true);
        grid.$viewport.scrollTop((($scope.storeDetailsConfig.length - 1) * grid.config.rowHeight));
        }, 0);
   }; 

   $scope.addStoreEditMboxParams = function(){
        $scope.storeMbox.push({});
        $timeout(function () {
        var grid = $scope.gridOptionsForStoreMboxParam.ngGrid;
        $scope.gridOptionsForStoreMboxParam.selectItem($scope.storeMbox.length-1, true);
        grid.$viewport.scrollTop((($scope.storeMbox.length-1)*grid.config.rowHeight));
        }, 0);
   };
    
   $scope.deleteStoreEditMboxParameters = function(){
        var index = this.row.rowIndex;
        $scope.gridOptionsForStoreMboxParam.selectItem(index, false);
        $scope.storeMbox.splice(index, 1);
   };

   $scope.deleteStoreConfigParam = function() {
        var index = this.row.rowIndex;
        $scope.gridOptionsForStoreDetails.selectItem(index, false);
        $scope.storeDetailsConfig.splice(index, 1);
   };

   $scope.updateStoreInfo = function(storeDetailsName, storeDetailsConfig, mbox){
      var mBoxArr = [];
      var configObj = {};
      angular.forEach(storeDetailsConfig, function(i){
        configObj[i.id] = i.name;
      });
      var storeUpdateObj = {
                            store: {
                                id: localStorageService.get('storeId'),
                                name: storeDetailsName,
                                config: configObj
                            }
                          };

      angular.forEach(mbox, function(i){
        mBoxArr.push(i.id);
      });

      storeUpdateObj.store.config.mBoxList = mBoxArr;
      var storeEnv = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));  
      storeUpdate.updateStoreDetails({env:storeEnv, storeID:storeUpdateObj.store.id},
                                     storeUpdateObj,function(res){
                                      $scope.unsavedAlert = false;
                                      $scope.errMsg= 'store'+' '+res.data.store.name+' '+'update success';
                                      $modal.open({
                                                        templateUrl: 'updateStoreConfirmation.html',
                                                        controller: 'templateModelPopUpCtrl',
                                                        size:'sm',
                                                        backdrop:'static',
                                                        resolve: {
                                                                    eMsg: function(){
                                                                      return $scope.errMsg;
                                                                    }
                                                                 }
                                                });
                                     },function(res){
                                      $scope.errMsg = res.data.store.name+' '+'store update failed';
                                      $modal.open({
                                                        templateUrl: 'updateStoreConfirmation.html',
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
