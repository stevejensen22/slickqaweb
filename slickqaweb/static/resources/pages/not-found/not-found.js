'use strict';
/**
 * User: jcorbett
 * Date: 5/28/13
 * Time: 11:06 PM
 */

angular.module('slickApp')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({
            templateUrl: 'static/resources/pages/not-found/not-found.html',
            controller: 'NotFoundCtrl'
        });
    }])
    .controller('NotFoundCtrl', ['$scope', function ($scope) {
        // nothing to do right now
    }]);
