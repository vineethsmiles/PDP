'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:TemplateclonecontrollerCtrl
 * @description
 * # TemplateclonecontrollerCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('templateDeleteCtrl', function ($scope, deleteMsg, deleteTemplate, $modalInstance, cacheMap, localStorageService, $route) {
    var templateID = deleteMsg;
    $scope.delete = true;
    $scope.msg = 'Are you sure you want to delete the  template:'+' '+templateID.name+'.'+'This cannot be undone.';
    $scope.deleteTemp = function(){
        $scope.currentEnvironment = localStorageService.get('env');
        var environment = cacheMap.get($scope.currentEnvironment.replace(/\s+/g,''));
        deleteTemplate.deleteTemplateDetails({env:environment, templateId:templateID.id},
                                             function(res){
                                              $scope.delete = false;
                                              $scope.msg = 'Template with'+res.message;  
                                             }, function(){
                                              $scope.delete = true;
                                              $scope.msg = 'Template Delete Failed';
                                            });
   };

  $scope.close = function(c){
  	$modalInstance.dismiss(c);
  	$route.reload();
  };

});
