'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:storesListCtrl
 * @description
 * # storesListCtrl
 * Controller of the adminToolApp
 */

angular.module('adminToolApp')
  .controller('storesListCtrl', function ($scope, $location, localStorageService, cacheMap, getAdminStores) {
     $('#pageConfigurations').addClass('active');
     angular.element(document).ready(function(){
       $scope.isStoreListAdmin = JSON.parse(localStorageService.get('isAdmin'));
     });

      $scope.$watch('env', function(){
         $scope.loading = true;
         $scope.storesInfo = false;
         $scope.alert = false;
         $scope.currentEnvironment = localStorageService.get('env');
         var environment = cacheMap.get($scope.currentEnvironment.replace(/\s+/g,''));
         getAdminStores.getStoresList({env:environment},
                                  function(res){
                                    $scope.alert = false;
                                    $scope.storesInfo = true;
                                    $scope.storesList = res.data.stores;
                                    $scope.loading = false;
                                  },function(err){
                                    $scope.alert= true;
                                    $scope.errMsg = 'No Results Found';
                                    $scope.storesInfo = false;
                                    $scope.loading = false;
                                    $scope.storesList = [];
                                    if(err.status === 403){
                                     $scope.errMsg = err.statusText+'.'+' '+err.data.message;                                     
                                    }
         });
      });

     $scope.storeSelected = function(_storeId){
       localStorageService.set('storeId', _storeId);
     };

     $scope.addStores = function(){
       $location.path('/storesAdd');
     };
});
