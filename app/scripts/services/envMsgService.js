'use strict';

/**
 * @ngdoc service
 * @name adminToolApp.envMsgService
 * @description
 * # envMsgService
 * Service in the adminToolApp.
 */
angular.module('adminToolApp')
  .service('envMsgService', function () {
        var message = null;
        return {
            getMessage: function() {
                return message;
            },
            setMessage: function(value) {
                message = value;
            }
        };
});
