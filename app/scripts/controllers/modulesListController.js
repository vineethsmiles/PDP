'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:modulesListCtrl
 * @description
 * # modulesListCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('modulesListCtrl', function ($scope, $location, getAllModules, localStorageService, cacheMap) {
      $('#pageConfigurations').addClass('active');
      
      angular.element(document).ready(function(){
        $scope.isModulesListAdmin = JSON.parse(localStorageService.get('isAdmin'));
      });

      $scope.filterOptions = {
        filterText: '',
        useExternalFilter: true
      };

      $scope.totalServerItems = 0;
      $scope.disabled = true;
      $scope.modulesTableSelection = [];
      var paginationArray = [];
      //pagination
      $scope.pagingOptions = {
          pageSizes: [11, 20, 30],
          pageSize: 11,
          currentPage: 1
      };  

      //pagination
      $scope.setPagingData = function(data, page, pageSize){
          var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
          $scope.modulesList = pagedData;
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
         $scope.alert = false;
         $scope.loading = true;
         $scope.currentEnvironment = localStorageService.get('env');
         var environment = cacheMap.get($scope.currentEnvironment.replace(/\s+/g,''));
         getAllModules.getAllModulesList({env:environment},
                                  function(res){ 
                                    $scope.alert = false;
                                    paginationArray = [];
                                    $scope.pagingOptions.currentPage = 1;
                                    $scope.modulesList = res.data.modules; 
                                    angular.forEach($scope.modulesList, function(mod){
                                      paginationArray.push(mod);
                                    }); 
                                    $scope.loading = false;
                                    $scope.setPagingData($scope.modulesList, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
                                  }, function(err){
                                    $scope.alert = true;
                                    $scope.errMsg = 'No Results Found';
                                    $scope.loading = false;
                                    $scope.modulesList = [];
                                    if(err.status === 403){
                                     $scope.errMsg = err.statusText+'.'+' '+err.data.message;                                     
                                    }
                                 });
      });

      $scope.addModules = function(){
        $location.path('/modulesAdd');
      };

      $scope.moduleSelected = function(entity){
        localStorageService.set('moduleId', entity.id);
        $location.path('/modulesEdit');
      };

      $scope.columnData =[
                       {
                         field: 'name',
                         displayName: 'Name',
                         cellTemplate: '<div class="ngCellText"><a href="#modulesEdit" ng-click="moduleSelected(row.entity)"ng-cell-text>{{row.getProperty(col.field)}}</a></div>'
                       }
                   ];
      // Modules list grid options
      $scope.modulesListgridOptions = { 
                         data : 'modulesList',
                         columnDefs:  'columnData',         
                         enableRowSelection: true,
                         showSelectionCheckbox: true,
                         selectedItems: $scope.modulesTableSelection, 
                         multiSelect: false,
                         keepLastSelected: false,
                         enablePaging: true,
                         showFooter: true,
                         totalServerItems: 'totalServerItems',
                         pagingOptions: $scope.pagingOptions,
                         filterOptions: $scope.filterOptions,
                         afterSelectionChange: function() {
                             if ($scope.modulesTableSelection.length === 0){
                               $scope.disabled = true;
                             }
                             else if ($scope.modulesTableSelection.length > 0) {
                               $scope.disabled = false;
                             }
                         }                 
      };
  });
