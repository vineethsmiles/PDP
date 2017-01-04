  'use strict';

  /**
  * @ngdoc function
  * @name adminToolApp.controller:operationsCtrl
  * @description
  * # operationsCtrl
  * Controller of the adminToolApp
  */
  angular.module('adminToolApp')
  .controller('operationsCtrl', function ($scope, getOperationsConfig, getAdminConfigurations, adminToolUtilityService, localStorageService, cacheMap, updateConfig, $modal, $route) {
     $('#operations').addClass('active');
     
     var gridInfoBackUp = [];
     var tempEnvParamArray = [];
     var paginationArray = [];

     angular.element(document).ready(function(){
        $scope.isOperationsAdmin = JSON.parse(localStorageService.get('isAdmin'));
     });

     $scope.showParameterChangeGrid = false;
     $scope.editedEnvParams= [];

      //pagination
      $scope.pagingOptions = {
          pageSizes: [15, 20, 25],
          pageSize: 15,
          currentPage: 1
      };  

      $scope.filterOptions = {
        filterText:'',
        useExternalFilter: true
      };

      $scope.totalServerItems = 0;

      //pagination
      $scope.setPagingData = function(data, page, pageSize){
          var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
          $scope.configurations = pagedData;
          $scope.totalServerItems = data.length;
          if (!$scope.$$phase) {
              $scope.$apply();
          }
      };

      $scope.searchPagingData = function(pageSize,page,searchText){
         var sText = searchText.toLowerCase();
         var searchdata = paginationArray.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(sText) !== -1;
                          });
         $scope.setPagingData(searchdata, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
      };

      //pagination
      $scope.$watch('pagingOptions', function () {
              $scope.setPagingData(paginationArray, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
      }, true);

      $scope.$watch('filterOptions', function () {
          $scope.pagingOptions.currentPage = 1;
          $scope.searchPagingData($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
      }, true);

     $scope.$watch('env', function(){
       $scope.loading = true;
       $scope.adminConfig = false;
       $scope.showParameterChangeGrid = false;
       $scope.envSelected = localStorageService.get('env');
       var envTemp = cacheMap.get($scope.envSelected.replace(/\s+/g,''));
       getAdminConfigurations.getAdminConfig({env:envTemp},function(res){
           $scope.alert = false;
           gridInfoBackUp= [];
           tempEnvParamArray = [];
           paginationArray = [];
           $scope.adminConfig = true;
           var keys = adminToolUtilityService.getObjectKeys(res.data);
           var vals = adminToolUtilityService.getObjectValues(res.data);
           $scope.configurations = adminToolUtilityService.buildObject(keys, vals);
           angular.forEach($scope.configurations, function(val){
            paginationArray.push(val);
           });
           gridInfoBackUp = adminToolUtilityService.buildObject(keys, vals);
           $scope.setPagingData($scope.configurations, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
           $scope.loading = false;
         }, function(){
           $scope.alert = true;
           $scope.errorMsg = 'No Results Found';
           $scope.loading = false;
           $scope.adminConfig = false;
         });
     });

    $scope.gridOptionsParameterGrid = { 
            data: 'configurations',
            enableSorting: true,
            headerRowHeight:0,
            filterOptions: $scope.filterOptions,
            enableCellSelection: false,
            enableRowSelection: false,
            enableCellEditOnFocus: true,
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            columnDefs: [{
                           field:'id',
                           displayName: '',
                           enableCellEdit: false
                         }, 
                         {
                           field:'name',
                           displayName: '', 
                           enableCellEditOnFocus: true,
                           cellTemplate : '<div>{{row.getProperty(col.field)}}<span class="fa fa-pencil grid_icon"></span></div>',
                           editableCellTemplate: '<input style="width:540px" ng-change="updateText(row.entity)" ng-input="COL_FIELD" ng-model="COL_FIELD"/>'
                         }]   
    }; 

    $scope.gridOptionsParameterChangeGrid = { 
         data: 'editedEnvParams',
         showFilter: true,
         enableSorting: true,
         filterOptions: $scope.filterOptions,
         enableCellSelection: false,
         enableRowSelection: false,
         columnDefs: [
                    {
                      field:'id',
                      displayName: 'End Point'
                    },
                    {
                     field:'prevName',
                     displayName:'Previous Value'
                    },
                    {
                      field:'currentName',
                      displayName: 'Changed Value'
                    }]
   };

  $scope.updateText = function(editedParams){
    $scope.showParameterChangeGrid = true;
    tempEnvParamArray.push(editedParams);
    $scope.editedEnvParams = adminToolUtilityService.removeDuplicatesFromArray(tempEnvParamArray);
   
    adminToolUtilityService.checkBackUpGridData(gridInfoBackUp, $scope.editedEnvParams);
    adminToolUtilityService.convertGridObject(gridInfoBackUp, $scope.editedEnvParams);

    $scope.$watch($scope.editedEnvParams,function(){
        if($scope.editedEnvParams.length === 0){
            $scope.showParameterChangeGrid = false;
        }
    });
  };

  $scope.updateParams = function(envSelect){
    envSelect = envSelect.replace(/\s+/g,'');
    angular.forEach($scope.editedEnvParams, function(v){
      delete v.prevName;
      v.key = v.id;
      v.value = v.currentName;
      delete v.id;
      delete v.currentName;
    });

    var configUpdateObj = {
      configjob:{
        environment:envSelect.toLowerCase(),
        environmentUrl:'http://'+cacheMap.get(envSelect),
        properties:$scope.editedEnvParams
      }
    };
    
    var en = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));
    updateConfig.postUpdateConfig({env:en}, configUpdateObj, function(res){
      $scope.errMsg = 'config update success'+' '+'status:'+' '+res.data.configjob.status;
      $modal.open({
                          templateUrl: 'configUpdateConfirmation.html',
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
      $scope.errMsg = 'config update failed';
      $modal.open({
                          templateUrl: 'configUpdateConfirmation.html',
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

});
