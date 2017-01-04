'use strict';

/**
 * @ngdoc overview
 * @name adminToolApp
 * @description
 * # adminToolApp is primary module. All the routes and submodules are configured on primary module.
 * adminToolApp: Main module of the application.
 */
angular
  .module('adminToolApp', [
    'ngGrid',
    'uiSwitch',
    'ngRoute',
    'ngSanitize',
    'ui.select2',
    'adminToolAppServices',
    'adminToolAppDirectives',
    'LocalStorageModule',
    'ui.bootstrap',
    'angular-jwt'
  ])
  .config(function ($routeProvider, $httpProvider, localStorageServiceProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardCtrl'
      })
      .when('/storesList', {
        templateUrl: 'views/storesList.html',
        controller: 'storesListCtrl'
      }).when('/storesAdd', {
        templateUrl: 'views/storesAdd.html',
        controller: 'storesAddCtrl'
      }).when('/storeEdit', {
        templateUrl: 'views/storesEdit.html',
        controller: 'storeEditCtrl'
      }).when('/templatesList', {
        templateUrl: 'views/templatesList.html',
        controller: 'templatesListCtrl'
      }).when('/editTemplate', {
        templateUrl: 'views/templatesEdit.html',
        controller: 'templatesEditCtrl'
      }).when('/templatesAdd', {
        templateUrl: 'views/templatesAdd.html',
        controller: 'templatesAddCtrl'
      }).when('/modulesList', {
        templateUrl: 'views/modulesList.html',
        controller: 'modulesListCtrl'
      }).when('/modulesEdit', {
        templateUrl: 'views/modulesEdit.html',
        controller: 'modulesEditCtrl'
      }).when('/modulesAdd', {
        templateUrl: 'views/modulesAdd.html',
        controller: 'modulesAddCtrl'
      }).when('/activityLog', {
        templateUrl: 'views/activityLog.html',
        controller: 'activityLogCtrl'
      }).when('/Qa_Job_Queue', {
        templateUrl: 'views/jobQueue.html',
        controller: 'jobQueueCtrl'
      }).when('/operations', {
        templateUrl: 'views/operations.html',
        controller: 'operationsCtrl'
      }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      }).when('/featureFlag', {
        templateUrl: 'views/featureFlag.html',
        controller: 'featureFlagCtrl'
      })
      .otherwise({
        redirectTo: '/dashboard'
      });

      localStorageServiceProvider.setPrefix('adminToolApp').setStorageType('localStorage'); 
      $httpProvider.interceptors.push('AuthInterceptor');
  }).
  run(function($rootScope, $location, localStorageService) {
    $rootScope.$on('$routeChangeStart', function(event, next) {
      if(localStorageService.get('env') === null || localStorageService.get('env') === undefined) {
        if (next.templateUrl === 'views/login.html') {
        } else {
          $location.path('/login');
        }
      }
    });
  });
