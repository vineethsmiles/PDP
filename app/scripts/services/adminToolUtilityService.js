'use strict';

/**
 * @ngdoc service
 * @name adminToolApp.adminToolUtilityService
 * @description
 * # adminToolUtilityService
 * Service in the adminToolApp.
 */
angular.module('adminToolAppServices')
  .service('adminToolUtilityService', function () {

    this.getObjectKeys = function(obj){
      var objKeys = Object.keys(obj);
      return objKeys;
    };

    this.getObjectValues = function(obj){
      var objValues = Object.keys(obj).map(function (key) {
            return obj[key];
        });
        return objValues;
    };
    
    this.buildObject = function(objectKeys, objectValues){
       var gridArray = [];
        for (var i = 0; i < objectKeys.length; i++)
        {
            var result = {
                          id:'',
                          name:''
                     };
              result.id = objectKeys[i];
              result.name = objectValues[i];
              gridArray.push(result);
        }
           return gridArray;
    };

    this.removeDuplicatesFromArray = function(origArr) {
          var newArr = [],
            origLen = origArr.length,
            found, x, y;

            for (x = 0; x < origLen; x++) {
                found = undefined;
                for (y = 0; y < newArr.length; y++) {
                   if (origArr[x] === newArr[y]) {
                        found = true;
                        break;
                   }
                }
                if (!found) {
                   newArr.push(origArr[x]);
                }
            }
            return newArr;
     };

     this.convertGridObject = function(gridBackupData, paramChangeArray){
          for (var i = 0, len = gridBackupData.length; i < len; i++) { 
                for (var j = 0, len2 = paramChangeArray.length; j < len2; j++) { 
                    if (gridBackupData[i].id === paramChangeArray[j].id) {
                        var newObj={
                          id:paramChangeArray[j].id,
                          currentName:paramChangeArray[j].name,
                          prevName:gridBackupData[i].name
                        };
                        paramChangeArray.splice(j, 1);
                        len2=paramChangeArray.length;
                        paramChangeArray.push(newObj);
                    }
                }
            }
     };

     this.checkBackUpGridData = function(a, b){
         for (var i = 0, len = a.length; i < len; i++) { 
                for (var j = 0, len2 = b.length; j < len2; j++) { 
                    if (a[i].name === b[j].name) {
                       if(a[i].id === b[j].id){
                         b.splice(j, 1);
                         len2=b.length;
                       }
                    }
                }
         }
     };

     this.toObject = function(arr){
          var objectList=[];
          for (var i = 0; i < arr.length; ++i){
            var mBoxObject = {
                                id:'',
                                mBoxParam:''
                             };
            if (arr[i] !== undefined){
                mBoxObject.id= i+1;
                mBoxObject.mBoxParam= arr[i];
            } 
            objectList.push(mBoxObject);
          }
            return objectList;
     };

     this.objToString = function(obj){
         var str = '';
                for (var p in obj) {
                    if (obj.hasOwnProperty(p)) {
                        str += p + '::' + obj[p] + '\n'+','+'\n';
                    }
                }
         return str;
     };

     this.isEmptyForModulesAdd = function(obj){
         for(var prop in obj) {
              if(obj.hasOwnProperty(prop) && prop !== 'undefined' && prop === Object.keys(obj)[Object.keys(obj).length - 1]){
                 var propValue = obj[prop];
                 if(propValue.inputType !== undefined || angular.isArray(propValue.options)){
                   return false;
                 }
              }
          }
          if(Object.keys(obj).length === 0){
                   return false;
          }
          return true;
     };

     this.isEmptyForModulesUpdate = function(obj){
         for(var prop in obj) {
              if(obj.hasOwnProperty(prop) && prop !== 'undefined'){
                 var propValue = obj[prop];
                 if(propValue.id === 'inputType' && propValue.param === ''){
                     return true;
                 }
                 if(!propValue.hasOwnProperty('modName') || propValue.modName === undefined){
                     return true;
                 }
              }
         }
          return false;
     };

     this.containsAll = function(subArray, Array){
        for(var i = 0, len = subArray.length; i < len; i++){
           if($.inArray(subArray[i], Array) === -1){
               return false;
           } 
        }
        return true;
     };

     this.find = function(key, array){
          var results = [];
          for (var i = 0; i < array.length; i++) {
            if (array[i].indexOf(key) === 0) {
              results.push(array[i]);
            }
          }
          return results;
     };

     this.searchString = function(str, strArray){
        if(str !== null && str !== undefined && strArray !== null && strArray !==undefined){
           for (var j=0; j<strArray.length; j++) {
              if (strArray[j].match(str))
               {
                return true;
               } 
           }
        }
          return false;
     };
});
