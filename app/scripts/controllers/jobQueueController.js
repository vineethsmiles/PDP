'use strict';
/**
 * @ngdoc function
 * @name adminToolApp.controller:jobQueueCtrl
 * @description
 * # jobQueueCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('jobQueueCtrl', function($scope, jobQueues, cacheMap, localStorageService, jobStatus, adminToolUtilityService, singleJobStatus) {
   $('#operations').addClass('active');

    var paginationArray = [];
    $scope.filterOptions = {
      filterText: '',
      useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    //pagination
    $scope.pagingOptions = {
        pageSizes: [12, 20, 25],
        pageSize: 12,
        currentPage: 1
    };  

    //pagination
    $scope.setPagingData = function(data, page, pageSize){
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.jobQueueData = pagedData;
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

   $scope.$watch('env' , function(){
       $scope.loading = true;
       $scope.alert = false;
       $scope.pagingOptions.currentPage = 1;
       var environment = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));
        jobQueues.getAllJobQueues({env:environment}, function(res){
            $scope.alert = false;
            $scope.jobQueueData = [];
            paginationArray = [];
            angular.forEach(res.data.configjobs, function(v){
             if(v.configjob.hasOwnProperty('properties')){
                v.configjob.props=[];
                angular.forEach(v.configjob.properties, function(k){
                  v.configjob.props.push(adminToolUtilityService.objToString(k));
                });  
             }
             else{
                  v.configjob.props = 'N/A';
             }
             if(v.configjob.hasOwnProperty('status')){
                  v.configjob.status = v.configjob.status.toUpperCase();
             }
             $scope.jobQueueData.push(v.configjob);
             paginationArray.push(v.configjob);
             $scope.loading = false;
            });
            $scope.setPagingData($scope.jobQueueData, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
           }, function(err){
             $scope.alert = true;
             $scope.errMsg = 'No Results Found';
             $scope.loading = false;
             if(err.status === 403){
               $scope.errMsg = err.statusText+'.'+' '+err.data.message;                                     
             }
           });
   });
  
   $scope.gridOptionsJobQueueGrid = { 
            data: 'jobQueueData',
            filterOptions: $scope.filterOptions,
            enableSorting: true,
            enableColumnResize: true,
            enableCellSelection: false,
            enableRowSelection: false,
            enablePaging: true,
            showFooter: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            columnDefs: [{
                           field:'environment',
                           displayName: 'environment'
                         }, 
                         {
                           field:'id',
                           displayName: 'id'
                         },
                         {
                           field:'uid',
                           displayName: 'uid'
                         },
                         {
                           field:'props',
                           displayName: 'Parameters',
                           cellFilter: 'stringArrayFilter',
                           cellTemplate:'<div class="ngCellText"><span ng-repeat="item in row.entity.props">{{item}}</span></div>'
                         },
                         {
                           field:'updated',
                           displayName: 'updated'
                         },
                         {
                           field:'status',
                           displayName: 'status',
                           cellTemplate: '<div><div class="{{row.entity.status}}"><strong>{{row.getProperty(col.field)}}</strong></div></div>'
                         }]   
    }; 

    $scope.refreshStatus = function(){
      var refreshJobArray = [];
      var environment = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));
      angular.forEach($scope.jobQueueData, function(job){
        refreshJobArray.push(job.id);
      });
      $scope.jobQueueData = [];
      angular.forEach(refreshJobArray, function(job){
            angular.forEach(paginationArray, function(pag, u){
                   if(pag.id === job){
                      paginationArray.splice(u, 1);
                   }
            });
            singleJobStatus.getSingleJobStatus({env:environment, jobId:job}, function(res){
                   if(res.data.configjob.hasOwnProperty('properties')){
                        res.data.configjob.props=[];
                        angular.forEach(res.data.configjob.properties, function(k){
                          res.data.configjob.props.push(adminToolUtilityService.objToString(k));
                        });  
                   }
                   else{
                          res.data.configjob.props = 'N/A';
                   }
                   if(res.data.configjob.hasOwnProperty('status')){
                        res.data.configjob.status = res.data.configjob.status.toUpperCase();
                   }
                   $scope.jobQueueData.push(res.data.configjob);
                   paginationArray.push(res.data.configjob);
            });
      });
    };

}).filter('stringArrayFilter', function() {
  return function(myArray) {
    return myArray.join(', ');
  };
});
