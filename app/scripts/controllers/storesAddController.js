'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:storesAddCtrl
 * @description
 * # storesAddCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('storesAddCtrl', function ($scope, storeAdd, cacheMap, localStorageService, $modal, $location) {
    $('#pageConfigurations').addClass('active');

    $scope.saveAlert = false;
    $scope.storeDetailsConfig = [];
    $scope.storeMbox = [];

    var storeDetailConfigTemplate = '<input type="button" class="btn btn-danger btn-xs store-config-btn-delete" value="delete" ng-click="deleteStoreConfigParam($index)"/>';
    var storeMboxTemplate = '<input type="button" class="btn btn-danger btn-xs store-config-btn-delete" value="delete" ng-click="deleteStoreEditMboxParameters($index)"/>';

    $scope.addParameters = function() {
      $scope.storeDetailsConfig.push({});
    };

    $scope.gridOptionsForStoreCreate = { 
        data: 'storeDetailsConfig',
        showSelectionCheckbox: false,
        enableCellEditOnFocus: true,
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
                     }, {field: 'name', displayName: 'Parameter Name', enableCellEdit: true}, {field:'value', displayName:'Parameter Value', enableCellEdit: true}, {field: 'remove', displayName:'', cellTemplate: storeDetailConfigTemplate, width:90, enableCellEdit: false}]
    };

    $scope.deleteStoreConfigParam = function() {
        var index = this.row.rowIndex;
        $scope.gridOptionsForStoreCreate.selectItem(index, false);
        $scope.storeDetailsConfig.splice(index, 1);
    };

    $scope.deleteStoreEditMboxParameters = function(){
        var index = this.row.rowIndex;
        $scope.gridOptionsForStoreMboxParam.selectItem(index, false);
        $scope.storeMbox.splice(index, 1);
   };

   $scope.gridOptionsForStoreMboxParam = { 
        data: 'storeMbox',
        enableCellEditOnFocus: true,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResize: true,
        showSelectionCheckbox: false,
        columnDefs: [{
                     field:'icon',
                     displayName:'',
                     cellTemplate : '<span class="fa fa-pencil grid_icon"></span>',
                     enableCellEdit: false,
                     width: 50
                     }, {field: 'mBoxParam', displayName: 'mBox Parameter', enableCellEdit: true}, {field: 'remove', displayName:'', cellTemplate: storeMboxTemplate,  enableCellEdit: false, width:90}]
    };

   $scope.addMboxParams = function(){
        $scope.storeMbox.push({});
   };

    $scope.addStore = function(storeName){
        $scope.saveAlert = false;
        var mbox = [];
        angular.forEach($scope.storeMbox, function(k){
            mbox.push(k.mBoxParam);
        });
        var config = {};
        for(var i=0; i<$scope.storeDetailsConfig.length; i++) {
          config[$scope.storeDetailsConfig[i].name] = $scope.storeDetailsConfig[i].value;
        }
        config.mBoxList = mbox;

        var addStoreObj = {
                            store: {
                                name: storeName,
                                config: config
                            }
                         };

        var storeEnv = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));               
        storeAdd.addNewStore({env:storeEnv},
                                addStoreObj,
                                 function(res){
                                    $scope.errMsg = 'Success.New store'+' '+res.data.store.name+' '+'created';
                                    $modal.open({
                                                        templateUrl: 'addStoreConfirmation.html',
                                                        controller: 'templateModelPopUpCtrl',
                                                        size:'sm',
                                                        backdrop:'static',
                                                        resolve: {
                                                                    eMsg: function(){
                                                                      return $scope.errMsg;
                                                                    }
                                                                 }
                                                }); 
                                    $location.path('/storesList');
                                 }, function(res){
                                    $scope.errMsg = res.data.message+' '+'Store create failed'; 
                                    $modal.open({
                                                        templateUrl: 'addStoreConfirmation.html',
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