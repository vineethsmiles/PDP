'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('loginCtrl', function ($scope, localStorageService, environmentService, $rootScope, $location, logIn, cacheMap, jwtHelper) {
    $('#sidebar li.active').removeClass('active');
    
    $scope.environments = environmentService.getEnvironments();
  
    $scope.environmentSelect = function(env){
      $rootScope.$emit('env_changes_on_login', env);
    };

    $rootScope.$on('env_changes_on_user_nav', function(event, value){
      $scope.loginEnv = value;
    });

    $scope.login = function(uid, pwd, loginEnv){
      if(uid !== undefined && loginEnv !== undefined){
          localStorageService.set('env', loginEnv);

          var loginPostData={
                              'username':uid,
                              'password':pwd
                            };
          var environment = cacheMap.get(loginEnv.replace(/\s+/g,''));
          logIn.auth({env:environment},  
                     loginPostData,
                         function(response){
                             $scope.logout = false;
                             var tokenPayload = jwtHelper.decodeToken(response.data.token);
                             if(tokenPayload.roles.contains('admin')){
                              localStorageService.set('isAdmin', true);
                             }else{
                              localStorageService.set('isAdmin', false);
                             }
                             localStorageService.set('token', response.data.token);
                             localStorageService.set('firstName', tokenPayload.firstname);
                             $rootScope.firstName = tokenPayload.firstname;
                             $location.path('/dashboard');
                         }, function(){
                             $scope.logout = true;
                             $scope.loginMsg = 'Authentication Failed';
                         });
        }
    };

  });
