'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:headerPanelCtrl
 * @description
 * # headerPanelCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('headerPanelCtrl', function ($scope, $route, localStorageService, $location, $rootScope, $modal, environmentService) {
  
    $scope.envChange = localStorageService.get('env');
    $scope.environments = environmentService.getEnvironments();
    $rootScope.firstName = localStorageService.get('firstName');
      
    $rootScope.$on('env_changes_on_login', function(event, value){
      $scope.userNav.selectBox.$setViewValue(value);
      $scope.userNav.selectBox.$render();
    });

    $scope.environmentSelect = function(env){
       $rootScope.env = env;
       localStorageService.set('env', env);
       $rootScope.$emit('env_changes_on_user_nav', env);
    };

    $scope.logOut = function(){
       localStorageService.clearAll();
       $('#sel').select2('val', '');
       $rootScope.firstName=null;
       $location.path('/login');
    };

    $scope.open = function () {
      $modal.open({
        templateUrl: 'modelPopUp.html',
        controller: 'versionsPopUpCtrl',
        size:'lg',
        backdrop:'static'
      });
    };
  });
