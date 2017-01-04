'use strict';

describe('Directive: markable directive test', function() {
  var element, scope;
  beforeEach(module('adminToolApp'));
  beforeEach(inject(function($rootScope, $compile) {
      scope = $rootScope;
      element = angular.element('<li markable><a href="#storesList">List</a></li>');
      $compile(element)(scope);
      scope.$digest();
  }));

  it('should add class "active" on event Click', function(){
    //before click event no "active" css class added
    expect(element.hasClass('active')).toBe(false);
    //trigger click.
    element.trigger('click');
    //after click event "active" css added.
    expect(element.hasClass('active')).toBe(true);
  });

});