'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:templatesListCtrl
 * @description
 * # templatesListCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('templatesListCtrl', function ($scope, $location, getAllTemplates, localStorageService, cacheMap, deleteTemplate, $modal) {
$('#pageConfigurations').addClass('active');
     
$scope.mainTableSelection = [];
$scope.filterOptions = {
      filterText: '',
      useExternalFilter: true
};
$scope.totalServerItems = 0;

angular.element(document).ready(function(){
  $scope.isTemplateListAdmin = JSON.parse(localStorageService.get('isAdmin'));
});
$scope.disabled = true;
var paginationArray = [];

//pagination
$scope.pagingOptions = {
    pageSizes: [15, 20, 25],
    pageSize: 15,
    currentPage: 1
};  

//pagination
$scope.setPagingData = function(data, page, pageSize){
    var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
    $scope.templatesList = pagedData;
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

$scope.deleteSelectedTemplate = function(){
  $scope.alert = false;
  $scope.delObj = $scope.mainTableSelection[0];
  $modal.open({
                          templateUrl: 'templateDeletePopUp.html',
                          controller: 'templateDeleteCtrl',
                          backdrop:'static',
                          size:'sm',
                          resolve: {
                                      deleteMsg: function(){
                                        return $scope.delObj ;
                                      }
                                   }
                  });
};

$scope.templateSelected = function(entity){
    localStorageService.set('templateId', entity.id);
    $location.path('/editTemplate');
};

$scope.$watch('env', function(){
         $scope.loading = true;
         $scope.alert = false;
         $scope.currentEnvironment = localStorageService.get('env');
         var environment = cacheMap.get($scope.currentEnvironment.replace(/\s+/g,''));
         getAllTemplates.getAllTemplatesList({env:environment},
                                  function(res){
                                    $scope.alert = false;
                                    paginationArray = [];
                                    $scope.pagingOptions.currentPage = 1;
                                    $scope.templatesList = res.data.templates;
                                    angular.forEach($scope.templatesList, function(i){
                                        if(i.parentName === null || i.parentName === undefined){
                                            i.parentName = 'N/A';
                                        }
                                        paginationArray.push(i);
                                    });
                                    $scope.loading = false; 
                                    $scope.setPagingData($scope.templatesList, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);        
                                  }, function(err){
                                    $scope.alert = true;
                                    $scope.templatesList = [];
                                    $scope.errMsg = 'No Results Found';
                                    $scope.loading = false;
                                    if(err.status === 403){
                                     $scope.errMsg = err.statusText+'.'+' '+err.data.message;                                     
                                    }
                                 });
});
    
// To navigate to Create New Template screen
$scope.createNewTemplate = function(){
  $location.path('/templatesAdd');
};

$scope.columnData =[
                       {
                         field: 'name',
                         displayName: 'Name',
                         cellTemplate: '<div class="ngCellText"><a href="#editTemplate" ng-click="templateSelected(row.entity)" ng-cell-text>{{row.getProperty(col.field)}}</a></div>',
                         width: '40%'
                       },
                       {
                         field: 'store',
                         displayName:'Store',
                         width: '20%'
                       },
                       {
                         field: 'type',
                         displayName: 'Type',
                         width: '15%'
                       },
                       {
                         field: 'parentName',
                         displayName: 'Parent',
                         width: '12%'
                       },
                       {
                         cellTemplate: '<a href="" ng-click="cloneTemplate(row.entity)" class="btn btn-inverse btn-xs"><i class="fa fa-copy"></i> Clone</a>',
                         width: '2%'
                       },
                   ];

// Template list grid options
 $scope.gridOptions = { 
                         data : 'templatesList',
                         columnDefs:  'columnData',         
                         showSelectionCheckbox: true,
                         enableRowSelection: true,
                         multiSelect: false,
                         selectedItems: $scope.mainTableSelection, 
                         keepLastSelected: false,
                         enablePaging: true,
                         showFooter: true,
                         totalServerItems: 'totalServerItems',
                         pagingOptions: $scope.pagingOptions,
                         filterOptions: $scope.filterOptions,
                         afterSelectionChange: function() {
                             if ($scope.mainTableSelection.length === 0){
                               $scope.disabled = true;
                             }
                             else if ($scope.mainTableSelection.length > 0) {
                               $scope.disabled = false;
                             }
                         }  
                      };

  $scope.cloneTemplate= function(rowObj){
      $scope.rowObj = rowObj;
      $modal.open({
                          templateUrl: 'templateClonePopUp.html',
                          controller: 'templateCloneCtrl',
                          backdrop:'static',
                          size:'lg',
                          resolve: {
                                      eMsg: function(){
                                        return $scope.rowObj ;
                                      }
                                   }
                  });
  };

});