'use strict';

/**
 * @ngdoc service
 * @name adminToolApp.environmentService
 * @description
 * # environmentService
 * Service in the adminToolApp.
 */
angular.module('adminToolApp')
  .service('environmentService', function () {
    this.environments = [
	                     {id:'INT1',     value:'web301p.dev.ch3.s.com:2580'},
	                     {id:'QA1',      value:'pdpvip.qa.ch3.s.com'},
	                     {id:'QA2',      value:'pdp2vip.qa.ch3.s.com'},
	                     {id:'QA3',      value:'pdp3vip.qa.ch3.s.com'},
	                     {id:'QA4',      value:'pdp4vip.qa.ch3.s.com'},
	                     {id:'QA5',      value:'pdp5vip.qa.ch3.s.com'},
	                     {id:'STAGE',    value:'pdpvip.stag.ch4.s.com'},
	                     {id:'STRESS',   value:'pdpvip.stress.ch3.s.com'},
	                     {id:'INT2',     value:'web301p.dev.ch3.s.com:2581'},
	                     {id:'PROD',     value:'pdpbotvip.prod.ch4.s.com'}
	                  ]; 

	 this.getEnvironments= function(){
	 	return this.environments;
	 };
  });
