'use strict';

/**
 * @ngdoc service
 * @name adminToolApp.adminToolAppServices
 * @description
 * # adminToolAppServices
 * Service in the adminToolApp.
 */
var adminServiceModule = angular.module('adminToolAppServices', ['ngResource']);

adminServiceModule.factory( 'cacheMap', function($cacheFactory, environmentService) {
      var cache = $cacheFactory('environmentsMap');
	  var environments = environmentService.getEnvironments();
	  angular.forEach(environments, function(i){
	     cache.put(i.id, i.value);
	  });
	  return cache;
});

adminServiceModule.factory('getOperationsConfig', function($resource){
	return $resource('http://:env/pdp-services/version/ping', {}, {
		getOpConfig: {method:'GET', isArray:true} 
	});
});

adminServiceModule.factory('getAdminConfigurations', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/config?internal=true', {}, {
		getAdminConfig: {method:'GET'} 
	});
});

adminServiceModule.factory('logIn', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/login', {}, {
		auth: {method:'POST'}
	});
});

adminServiceModule.factory('getAdminStores', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/stores', {}, {
		getStoresList: {method:'GET'} 
	});
});

adminServiceModule.factory('getStoreDetails', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/stores/:storeId', {}, {
		getStoreDetailsForStoreID: {method:'GET'} 
	});
});

adminServiceModule.factory('storeAdd', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/stores', {}, {
		addNewStore: {method:'POST'} 
	});
});

adminServiceModule.factory('storeUpdate', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/stores/:storeID', {}, {
		updateStoreDetails: {method:'PUT'} 
	});
});

adminServiceModule.factory('getAllTemplates', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/templates', {}, {
		getAllTemplatesList: {method:'GET'} 
	});
});

adminServiceModule.factory('getTemplateDetails', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/templates/:templateId', {}, {
		getDetailsForTemplate: {method:'GET'} 
	});
});

adminServiceModule.factory('updateTemplate', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/templates/:templateID', {}, {
		 updateTemplateDetails: {method:'PUT'} 
	});
});

adminServiceModule.factory('deleteTemplate', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/templates/:templateId', {}, {
		 deleteTemplateDetails: {method:'DELETE'} 
	});
});

adminServiceModule.factory('createTemplate', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/templates', {}, {
		 createNewTemplate: {method:'POST'} 
	});
});

adminServiceModule.factory('templatesToInherit', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/templates?type=parent', {}, {
		 inheritableTemplates: {method:'GET'} 
	});
});

adminServiceModule.factory('templateChildren', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/templates/:templateId/children', {}, {
		 templateChildrenList: {method:'GET'} 
	});
});

adminServiceModule.factory('templateRevert', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/templates/:ID/revert/:revID', {env: '@env', ID:'@ID', revID:'@revID'}, {
		 templateRevertRevision: {method:'PUT'} 
	});
});

adminServiceModule.factory('getAllModules', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/modules', {}, {
		getAllModulesList: {method:'GET'} 
	});
});

adminServiceModule.factory('moduleEdit', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/modules/:moduleId', {}, {
		moduleEditUpdate: {method:'GET'} 
	});
});

adminServiceModule.factory('moduleUpdate', function($resource){
	return $resource('http://:env/pdp-services/v1/admin/modules/:moduleId', {}, {
		putModuleUpdate: {method:'PUT'} 
	});
});

adminServiceModule.factory('moduleAdd', function($resource){
	 return $resource('http://:env/pdp-services/v1/admin/modules', {}, {
	    addNewModule: {method:'POST'} 
	 });
});

adminServiceModule.factory('jobQueues', function($resource){
	 return $resource('http://:env/pdp-services/v1/admin/config/jobs', {}, {
	    getAllJobQueues: {method:'GET'} 
	 });
});

adminServiceModule.factory('updateConfig', function($resource){
	 return $resource('http://:env/pdp-services/v1/admin/config/jobs', {}, {
	    postUpdateConfig: {method:'POST'} 
	 });
});

adminServiceModule.factory('jobStatus', function($resource){
	 return $resource('http://:env/pdp-services/v1/admin/config/jobs/:jobID', {}, {
	    getJobStatus: {method:'GET'} 
	 });
});

adminServiceModule.factory('activityLog', function($resource){
	 return $resource('http://:env/pdp-services/v1/admin/activity', {}, {
	    getActivityLog: {method:'GET'} 
	 });
});

adminServiceModule.factory('activityLogForYM', function($resource){
	 return $resource('http://:env/pdp-services/v1/admin/activity?from=:YM', {}, {
	    getActivityLogYM: {method:'GET'} 
	 });
});

adminServiceModule.factory('getDetailsForSearch', function($resource){
 return $resource('http://blogweb301p.qa.ch3.s.com:3580/ajax/api/taxonomy?term=:searchString', {callback: 'JSON_CALLBACK'}, {
         getDetails: {method:'JSONP', isArray:true} 
     });
});

adminServiceModule.factory('Types', function($resource){
	 return $resource('http://:env/pdp-services/v1/admin/templates/types', {}, {
	    getTemplateTypes: {method:'GET'} 
	 });
});

adminServiceModule.factory('singleJobStatus', function($resource){
	 return $resource('http://:env/pdp-services/v1/admin/config/jobs/:jobId', {}, {
	    getSingleJobStatus: {method:'GET'} 
	 });
});

adminServiceModule.factory('AuthInterceptor', function (localStorageService, $q, $location, $rootScope) {
    return {
        request: function(config) {
            config.headers = config.headers || {};
            if (localStorageService.get('token')) {
                 config.headers['x-pdp-token'] = localStorageService.get('token');
            }
            return config || $q.when(config);
        },
        responseError: function(response) {
            if (response.status === 401) {
                localStorageService.clearAll();
                $('#sel').select2('val', '');
                $rootScope.firstName=null;
                $location.path('/login').search('returnTo', $location.path());
            }
            return $q.reject(response);
        }
    };
});
