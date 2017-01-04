'use strict';

describe('adminToolUtilityService test', function(){
    describe('methods in adminToolUtilityService', function(){
        beforeEach(module('adminToolApp'));
        var currentEnvironments = {
                EXTERNAL_PRICE_API_ENDPOINT:    'http://prqcvip.qa.ch3.s.com',
                EXTERNAL_GREENBOX_API_ENDPOINT: 'http://green1vip.qa.ch3.s.com:8080',
                EXTERNAL_RANKING_API_ENDPOINT:  'http://iftrank301p.qa.ch3.s.com:8180',
                EXTERNAL_SHC_API_ENDPOINT:  'http://wsapp304p.dev.ch3.s.com:8880',
                EXTERNAL_SEARS_API_ENDPOINT:    'http://qa.ecom.sears.com:4680',
                EXTERNAL_CIS_API_ENDPOINT:  'http://web301p.qa.ch3.s.com:5781',
                EXTERNAL_CAS_SERVICE_ENDPOINT:  'http://web301p.qa.ch3.s.com:5780',
                EXTERNAL_UNIVERSAL_LIST_PROFILE_ENDPOINT:   'http://ssapp301p.qa.ch3.s.com:9080',
                AUTO_FITMENT_HOST:  'http://fitmentapp301p.stag.ch3.s.com:8180',
                SOLRX_SEARCH_HOST_UVD:  'http://solrx323p.stress.ch3.s.com:8280'
            };
            var gridObj = [{
                id:'EXTERNAL_PRICE_API_ENDPOINT',
                name:'http://prqcvip.qa.ch3.s.com'
            },{
                id:'EXTERNAL_GREENBOX_API_ENDPOINT',
                name:'http://green1vip.qa.ch3.s.com:8080'
            },{
            	id:'EXTERNAL_RANKING_API_ENDPOINT',
            	name:'http://iftrank301p.qa.ch3.s.com:8180'
            },{
            	id:'EXTERNAL_SHC_API_ENDPOINT',
            	name:'http://wsapp304p.dev.ch3.s.com:8880'
            },{
                id:'EXTERNAL_SEARS_API_ENDPOINT',
                name:'http://qa.ecom.sears.com:4680'
            },{
                id:'EXTERNAL_CIS_API_ENDPOINT',
                name:'http://web301p.qa.ch3.s.com:5781'
            },{
                id:'EXTERNAL_CAS_SERVICE_ENDPOINT',
                name:'http://web301p.qa.ch3.s.com:5780'
            },{
                id:'EXTERNAL_UNIVERSAL_LIST_PROFILE_ENDPOINT',
                name:'http://ssapp301p.qa.ch3.s.com:9080'
            },{
            	id:'AUTO_FITMENT_HOST',
            	name:'http://fitmentapp301p.stag.ch3.s.com:8180'
            },{
            	id:'SOLRX_SEARCH_HOST_UVD',
                name:'http://solrx323p.stress.ch3.s.com:8280'
            }
            ];
         var keyArray = [ 'EXTERNAL_PRICE_API_ENDPOINT',
                          'EXTERNAL_GREENBOX_API_ENDPOINT',
                          'EXTERNAL_RANKING_API_ENDPOINT',
                          'EXTERNAL_SHC_API_ENDPOINT',
                          'EXTERNAL_SEARS_API_ENDPOINT',
                          'EXTERNAL_CIS_API_ENDPOINT',
                          'EXTERNAL_CAS_SERVICE_ENDPOINT',
                          'EXTERNAL_UNIVERSAL_LIST_PROFILE_ENDPOINT',
                          'AUTO_FITMENT_HOST',
                          'SOLRX_SEARCH_HOST_UVD'];

          var valueArray = ['http://prqcvip.qa.ch3.s.com',
                            'http://green1vip.qa.ch3.s.com:8080',
                            'http://iftrank301p.qa.ch3.s.com:8180',
                            'http://wsapp304p.dev.ch3.s.com:8880',
                            'http://qa.ecom.sears.com:4680',
                            'http://web301p.qa.ch3.s.com:5781',
                            'http://web301p.qa.ch3.s.com:5780',
                            'http://ssapp301p.qa.ch3.s.com:9080',
                            'http://fitmentapp301p.stag.ch3.s.com:8180',
                            'http://solrx323p.stress.ch3.s.com:8280'];
           var dupArray=[{id: 'EXTERNAL_BUNDLE_CONTENT_API_TIMEOUT',name: '5saa'},{id: 'EXTERNAL_BUNDLE_CONTENT_API_TIMEOUT',name: '5saa'}];

        it('test adminToolUtilityService.getObjectKeys', inject(function(adminToolUtilityService){ //parameter name = service name
            expect(angular.isArray(adminToolUtilityService.getObjectKeys(currentEnvironments))).toBe(true);
            expect(adminToolUtilityService.getObjectKeys(currentEnvironments)).toEqual(keyArray);
        }));

        it('test adminToolUtilityService.getObjectValues', inject(function(adminToolUtilityService){ //parameter name = service name
            expect(angular.isArray(adminToolUtilityService.getObjectValues(currentEnvironments))).toBe(true);
            expect(adminToolUtilityService.getObjectValues(currentEnvironments)).toEqual(valueArray);
        }));

        it('test to build object from keys and values', inject(function(adminToolUtilityService){ //parameter name = service name
            expect(angular.isArray(adminToolUtilityService.buildObject(keyArray, valueArray))).toBe(true);
            expect(adminToolUtilityService.buildObject(keyArray, valueArray)).toEqual(gridObj);
        }));

        it('test to remove duplicates from array', inject(function(adminToolUtilityService){ //parameter name = service name
            adminToolUtilityService.removeDuplicatesFromArray(dupArray);
            expect(angular.isArray(adminToolUtilityService.removeDuplicatesFromArray(dupArray))).toBe(true);
        }));
    });
});


