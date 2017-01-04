'use strict';

/**
 * @ngdoc directive
 * @name adminToolApp.directive:markable
 * @description: marks and puts active css class on selected li elements
 * # markable
 */
var adminToolDirectives = angular.module('adminToolAppDirectives',[]);

//marks and puts active css class on selected li elements.
adminToolDirectives.directive('markable', function () {
    return {
      restrict: 'A',
      link: function(scope, elem) {
            elem.on('click', function() {
                $('#sidebar li.active').removeClass('active');
                  elem.addClass('active');
            });
        }
    };
}).directive('contenteditable', function () {
      return {
          restrict: 'A', // only activate on element attribute
          require: '?ngModel', // get a hold of NgModelController
          link: function (scope, element, attrs, ngModel) {
              if (!ngModel) 
              {
              return;
              } // do nothing if no ng-model

              // Specify how UI should be updated
              ngModel.$render = function () {
                  element.html(ngModel.$viewValue || '');
                  if(ngModel.$modelValue === 'Enter Text'){
                    element.addClass('labelHighlight');
                  }
              };
              
              element.on('focus', function () {
                  if(attrs.stripBr === 'true'){
                    if(ngModel.$modelValue === 'Enter Text'){
                      ngModel.$setViewValue('');
                      ngModel.$render();
                    }
                    if(ngModel.$modelValue ==='storeName' || ngModel.$modelValue === 'itemClassName' || ngModel.$modelValue === 'itemClass'){
                      element[0].removeAttribute('contenteditable');
                    }
                  }
              });

              element.on('blur', function () {
                  if(attrs.stripBr === 'true'){
                    if(ngModel.$modelValue === ''){
                      ngModel.$setViewValue('Enter Text');
                      ngModel.$render();
                    }

                    if(ngModel.$modelValue !== undefined && ngModel.$modelValue !== 'Enter Text'){
                      element.removeClass('labelHighlight');
                    }
                  }
              });

              // Listen for change events to enable binding
              element.on('blur keyup change', function () {
                  scope.$apply(readViewText);
              });

              // No need to initialize, AngularJS will initialize the text based on ng-model attribute

              // Write data to the model
              function readViewText() {
                  var html = element.html();
                  // When we clear the content editable the browser leaves a <br> behind
                  // If strip-br attribute is provided then we strip this out
                  if (attrs.stripBr && html === '<br>') {
                      html = '';
                  }
                  ngModel.$setViewValue(html);
              }
          }
      };
  }).directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];
    
    el.draggable = true;
    
    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('Text', this.id);
        this.classList.add('drag');
        return false;
      },
      false
    );
    
    el.addEventListener(
      'dragend',
      function() {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  };
}).directive('droppable', function() {
  return {
    scope: {
      drop: '&',
      bin: '='
    },
    link: function(scope, element) {
      // again we need the native object
      var el = element[0];
      
      el.addEventListener(
        'dragover',
        function(e) {
          e.dataTransfer.dropEffect = 'move';
          // allows us to drop
          if (e.preventDefault){ 
            e.preventDefault();
          }
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragenter',
        function() {
          this.classList.add('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'dragleave',
        function() {
          this.classList.remove('over');
          return false;
        },
        false
      );
      
      el.addEventListener(
        'drop',
        function(e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation){
            e.stopPropagation();
          } 
          
          this.classList.remove('over');
          
          var binId = this.id;
          var item = document.getElementById(e.dataTransfer.getData('Text'));
          this.appendChild(item.cloneNode(true));
          // call the passed drop function
          scope.$apply(function(scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {            
              fn(item.id, binId);
            }
          });
          
          return false;
        },
        false
      );
    }
  };
}).directive('amResetField', ['$compile', '$timeout', function($compile, $timeout) {
  return {
    require: 'ngModel',
    scope: {},
    link: function(scope, el, attrs, ctrl) {
      // limit to input element of specific types
      var inputTypes = /text|search|tel|url|email|password/i;
      if (el[0].nodeName !== 'INPUT'){
        throw new Error('resetField is limited to input elements');
      }
      if (!inputTypes.test(attrs.type)){
        throw new Error('Invalid input type for resetField:' + attrs.type);
      }
      // compiled reset icon template
      var template = $compile('<span class="input-group-addon"><i style="float:right" ng-mousedown="reset()" class="fa fa-times-circle"></i></span>')(scope);
      el.after(template);

      scope.reset = function() {
        ctrl.$setViewValue(null);
        ctrl.$render();
        $timeout(function() {
            el[0].focus();
        }, 0, false);
      };

      el.bind('input', function() {
        scope.enabled = !ctrl.$isEmpty(el.val());
      })
      .bind('focus', function() {
        scope.enabled = !ctrl.$isEmpty(el.val());
        scope.$apply();
      })
      .bind('blur', function() {
        scope.enabled = false;
        scope.$apply();
      });
    }
  };
}]).directive('disableField',function(){
    return{
       scope:{
         disableField:'=' 
       },
       link:function(scope, element ){
         if(scope.disableField){
          if(scope.disableField.id === '_disabled' && scope.disableField.param === true){
            angular.element(element[0].parentNode).attr('disabled',true) ;
          }
        }
      }
   };
});