'use strict';

/**
 * @ngdoc function
 * @name adminToolApp.controller:dashboardCtrl
 * @description
 * # MainCtrl
 * Controller of the adminToolApp
 */
angular.module('adminToolApp')
  .controller('dashboardCtrl', function () {
  	$('#sidebar li.active').removeClass('active');
    $('#dashboard').addClass('active');
  });
