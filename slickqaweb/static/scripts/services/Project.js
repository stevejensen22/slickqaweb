/**
 * User: jcorbett
 * Date: 6/28/13
 * Time: 12:28 AM
 */
"use strict";

angular.module('slickServicesModule')
    .factory('Project', [ '$resource', function($resource) {
        return $resource('api/projects/:id');
    }]);

