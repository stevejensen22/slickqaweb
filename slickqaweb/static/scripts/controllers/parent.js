/**
 * User: jcorbett
 * Date: 6/26/13
 * Time: 9:15 AM
 */
"use strict";


angular.module('slickPrototypeApp')
    .controller('ParentCtrl', ['$scope', 'NavigationService', function ($scope, nav) {
        $scope.nav = nav;
    }]);
