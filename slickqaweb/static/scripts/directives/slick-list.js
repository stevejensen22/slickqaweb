/**
 * User: jcorbett
 * Date: 7/22/13
 * Time: 4:01 PM
 */

angular.module("slickApp")
    .directive("slickListHeader", function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: "static/views/directives/slick-list-header.html",
            scope: {
                model: "=",
                search: "@",
                pagination: "@",
                defaultSort: "@"
            },
            controller: function($scope) {
                $scope.paginationOn = $scope.pagination == 'on' || $scope.pagination == 'yes' || $scope.pagination == 'true';

                if($scope.paginationOn) {
                    $scope.model.pagenum = 1;
                    $scope.model.pageSize = 10;
                    $scope.nextPage = function() {
                        if($scope.model.pagenum < $scope.model.totalpages) {
                            $scope.model.pagenum++;
                        }
                    }
                    $scope.prevPage = function() {
                        if($scope.model.pagenum > 1) {
                            $scope.model.pagenum--;
                        }
                    }
                }

                if(!$scope.model.orderBy && $scope.defaultSort) {
                    $scope.model.orderBy = $scope.defaultSort;
                }
                if(!_.has($scope.model, "reverseOrder")) {
                    $scope.model.reverseOrder = false;
                }
                this.orderBy = function(propertyName) {
                    if($scope.model.orderBy == propertyName) {
                        $scope.model.reverseOrder = !$scope.model.reverseOrder;
                    } else {
                        $scope.model.orderBy = propertyName;
                        $scope.model.reverseOrder = false;
                    }
                };

                this.getOrderBy = function() {
                    return $scope.model.orderBy;
                };

                this.sortReversed = function() {
                    return $scope.model.reverseOrder;
                };
            },
            link: function(scope, element, attrs) {
            }
        }
    })
    .directive("slickListColumns", function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            require: "^slickListHeader",
            template: "<div class=\"slick-list-columns\" ng-transclude></div>",
            scope: {},
            controller: function($scope) {
            //controller: function($scope) {
                this.orderBy = function(propertyName) {
                    $scope.orderBy(propertyName);
                };

                this.getOrderBy = function() {
                    return $scope.getOrderBy();
                };

                this.sortReversed = function() {
                    return $scope.sortReversed();
                };
            },
            link: function(scope, element, attrs, slickListHeaderController) {
                scope.orderBy = function(propertyName) {
                    slickListHeaderController.orderBy(propertyName);
                };

                scope.getOrderBy = function() {
                    return slickListHeaderController.getOrderBy();
                };

                scope.sortReversed = function() {
                    return slickListHeaderController.sortReversed();
                };
            }
        }
    })
    .directive("slickListColumn", function() {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            require: "^slickListColumns",
            scope: {
               sortable: "@",
               sortPropertyName: "@"
            },
            template: "<div class=\"slick-list-column\" ng-click=\"setOrderBy()\"><span ng-transclude></span><img class=\"slick-list-column-sort-image\" src=\"static/images/sort-down.png\" ng-show=\"currentlySorted() && !sortReversed()\" /><img class=\"slick-list-column-sort-image\" src=\"static/images/sort-up.png\" ng-show=\"currentlySorted() && sortReversed()\" /></div>",
            link: function(scope, element, attrs, slickListColumnsController) {
                var sortable = scope.sortable == "yes" || scope.sortable == "on" || scope.sortable == "true";
                if(sortable) {
                    element.addClass("slick-list-sortable-column");
                }
                scope.currentlySorted = function() {
                    return slickListColumnsController.getOrderBy() == scope.sortPropertyName;
                };

                scope.sortReversed = function() {
                    return slickListColumnsController.sortReversed();
                };

                scope.setOrderBy = function() {
                    if(sortable) {
                        slickListColumnsController.orderBy(scope.sortPropertyName);
                    }
                };
            }
        }
    })
    .filter('slickListFilter', ['filterFilter', 'orderByFilter', function(filter, orderBy) {
        return function(array, model) {
            if(!_.isArray(array)) { return array; }
            var orderedArray = filter(array, model.searchField);
            if(model.orderBy) {
                orderedArray = orderBy(orderedArray, model.orderBy, model.reverseOrder);
            }

            var finalArray = orderedArray;
            if(_.has(model, 'pageSize')) {
                model.totalpages = Math.ceil(orderedArray.length / model.pageSize);
                if(model.pagenum > 1 && model.pagenum > model.totalpages) {
                    model.pagenum = model.totalpages;
                }
                finalArray = orderedArray.slice((model.pagenum - 1) * model.pageSize, ((model.pagenum) * model.pageSize));
            }

            return finalArray;
        }
    }]);


