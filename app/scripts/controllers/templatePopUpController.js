'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:templateModelPopUpCtrl
 * @description
 * # templateModelPopUpCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('templateModelPopUpCtrl', function ($scope, eMsg) {
  	$scope.errorMsg = eMsg;
});
