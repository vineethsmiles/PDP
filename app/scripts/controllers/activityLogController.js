'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:ActivitylogCtrl
 * @description
 * # ActivitylogCtrl
 * Controller of the adminToolApp
 */

angular.module('adminToolApp')
  .controller('activityLogCtrl', function ($scope, activityLog, activityLogForYM, cacheMap,localStorageService) {
     $('#sidebar li.active').removeClass('active');
     $('#activitylog').addClass('active');

    var today = new Date();
    var currMonth = today.getMonth();
    var currYear =  today.getFullYear();
    var paginationArray = [];

    $scope.filterOptions = {
      filterText: '',
      useExternalFilter: true
    };
    
    $scope.activityLogdata = [];
    $scope.totalServerItems = 0;
    $scope.alert = false;

    //pagination
    $scope.pagingOptions = {
        pageSizes: [15, 20, 25],
        pageSize: 15,
        currentPage: 1
    };  

    //pagination
    $scope.setPagingData = function(data, page, pageSize){
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.activityLogdata = pagedData;
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

    //To populate Grid data //Rest call
    $scope.$watch('env', function(){
        $scope.loading = true;
        $scope.alert =false;
        var envTemp = cacheMap.get(localStorageService.get('env'));         
        activityLog.getActivityLog({env:envTemp}, function(res){
            $scope.alert =false;
            $scope.activityLogdata = [];
            paginationArray = [];
            angular.forEach(res.data.activityevents, function(v){
              $scope.activityLogdata.push(v.activityevent);
              paginationArray.push(v.activityevent);
            });
            $scope.loading = false;
            $scope.setPagingData($scope.activityLogdata, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize); 
        }, function(err){
           if(err.data !== null){
            $scope.errMsg = err.data.message;
           }
           else{
            $scope.errMsg = 'No Results Found';
           }
           $scope.alert = true;
           $scope.loading = false;
        });   
    });

    $scope.populateActivityLogdata = function(month, year){
        $scope.loading = true;
        $scope.alert = false;
        angular.forEach($scope.monthSelection, function(v){
             if(v.value === month){
               month = v.id; 
             }
        });
        var envTemp = cacheMap.get(localStorageService.get('env'));
        activityLogForYM.getActivityLogYM({env:envTemp, YM:year+'-'+month}, function(res){
            $scope.activityLogdata = [];
            paginationArray= [];
            $scope.pagingOptions.currentPage = 1;
            $scope.alert = false;
            angular.forEach(res.data.activityevents, function(v){
               $scope.activityLogdata.push(v.activityevent);
               paginationArray.push(v.activityevent);
            }); 
            $scope.loading = false;
            $scope.setPagingData($scope.activityLogdata, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
        }, function(err){
            $scope.alert = true;
            $scope.loading = false;
            $scope.errMsg = err.data.message;
        });
    }; 

    //ng-Grid options
    $scope.activityLoggridOptions = { 
        data : 'activityLogdata',
        columnDefs: [
                     { field: 'updated', displayName: 'Date', width: '22%' },
                     
                     { field: 'uid', displayName:'User', width: '14%' },
                     
                     { field: 'entity', displayName: 'Entity', width: '14%' },
                     
                     { field: 'action', displayName: 'Action', width: '30%' },
                     
                     { field: 'ipaddress', displayName: 'IP Addr', width: '20%' }
                    ],
        filterOptions: $scope.filterOptions,
        showFooter: true,
        enableRowSelection: false ,
        enablePaging: true,
        totalServerItems:'totalServerItems',
        pagingOptions: $scope.pagingOptions                            
    };

    $scope.monthSelection = [{value:'January', id:'01'},{value:'February', id:'02'},{value:'March',id:'03'},{value:'April',id:'04'},{value:'May',id:'05'},{value:'June',id:'06'},{value:'July',id:'07'},{value:'August',id:'08'},{value:'September',id:'09'},{value:'October',id:'10'},{value:'November',id:'11'},{value:'December',id:'12'}];
    //Preselecting current month
    $scope.selectedMonth = $scope.monthSelection[currMonth].value;
    $scope.yearSelection = [{value:currYear}, {value:currYear-1}, {value:currYear-2}, {value:currYear-3}];
    //Preselecting current Year
    for(var i = 0; i < $scope.yearSelection.length; i++){
        if(currYear === $scope.yearSelection[i].value){
           $scope.selectedYear = currYear;   
        }
    }
});
