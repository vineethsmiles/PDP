'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:sideBarNavCtrl
 * @description
 * # sideBarNavCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('sideBarNavCtrl', function ($scope, $route) {

    $scope.reloadPage = function(){
		$route.reload();
	};

  });
