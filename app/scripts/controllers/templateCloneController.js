'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:TemplateclonecontrollerCtrl
 * @description
 * # TemplateclonecontrollerCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('templateCloneCtrl', function ($scope, eMsg, getTemplateDetails, $modalInstance, cacheMap, localStorageService, createTemplate, $route) {
    $scope.alert = false;
  
    var environment = cacheMap.get(localStorageService.get('env').replace(/\s+/g,''));
    var cloneTemplate = eMsg;
    var templateID = cloneTemplate.id;

    getTemplateDetails.getDetailsForTemplate({env:environment, templateId:templateID}, 
                                        function(res){
                                           $scope.templateName = res.data.template.template;
                                           $scope.templateKey = res.data.template.keys;
                                           $scope.name = res.data.template.name;
                                        });

    $scope.clone = function(pid){
    	 var segments;
	     if (pid.indexOf(',') !== -1) {
	        segments = pid.split(',');
	        angular.forEach(segments, function(v){
	        	getTemplateDetails.getDetailsForTemplate({env:environment, templateId:templateID}, 
                                        function(res){
                                           var templateCopy = res.data;
	       	                               templateCopy.template.name =  templateCopy.template.name+'::'+v;
                                           templateCopy.template.keys.pid = v;
                                           delete templateCopy.template.id;
                                           delete templateCopy.template.updated;
	                                           createTemplate.createNewTemplate({env:environment},
											                                      templateCopy, 
											                                    function(){
											                                      $scope.alert = true;
											                                      $scope.errMsg = 'Template Clone Success';
											                                    }, function(err){
											                                      $scope.alert = true;
											                                      $scope.errMsg = err.data.message;
											                                    });
                                        });
           });
	     }
	     else{
             segments = pid;
             getTemplateDetails.getDetailsForTemplate({env:environment, templateId:templateID}, 
                                        function(res){
                                           var templateCopy = res.data;
	       	                               templateCopy.template.name =  templateCopy.template.name+'::'+segments;
                                           templateCopy.template.keys.pid = segments;
                                           delete templateCopy.template.id;
                                           delete templateCopy.template.updated;
                                           createTemplate.createNewTemplate({env:environment},
                                                                             templateCopy, 
										                                    function(){
										                                      $scope.alert = true;
										                                      $scope.errMsg = 'Template Clone Success';
										                                    }, function(err){
										                                          $scope.alert = true;
											                                      $scope.errMsg = err.data.message;
										                                    });
                                        });
	     }
    };

    $scope.close = function(c){
    	$modalInstance.dismiss(c);
    	$route.reload();
    };
});
