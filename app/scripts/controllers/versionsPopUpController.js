'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:modelPopUpCtrl
 * @description
 * # modelPopUpCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('versionsPopUpCtrl', function ($scope, getOperationsConfig, localStorageService, $modalInstance, cacheMap) {
    
    $scope.currentEnvironment = localStorageService.get('env');
    var environment = cacheMap.get($scope.currentEnvironment.replace(/\s+/g,''));
    $scope.loading = true;

    getOperationsConfig.getOpConfig({env:environment},function(res) {
         $scope.operationConfig = res;
         $scope.loading = false;
    }, function(){
         $scope.alert = true;
         $scope.loading = false;
         $scope.errorMsg = 'No Results Found';
    });

   $scope.cancel = function () {
         $modalInstance.dismiss('cancel');
   };

    $scope.accordianToggle = true;
  });
