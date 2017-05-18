/**
 * Created by Student on 5/18/17.
 */

var wardroberapp = angular.module('wardroberapp', ['ngRoute']);
//console.log(history.config);
wardroberapp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider, $routeParams) {
        $routeProvider
            .when('/', {
                templateUrl: 'login.html',
                controller: 'loginController'
            }).when('/signup', {
            templateUrl: 'signup.html',
            controller: 'signupController'
        }).when('/home', {
            templateUrl: 'home.html',
            controller: 'homeController'
        }).otherwise({
            templateUrl: 'login.html',
            controller: 'loginController'
        });
        $locationProvider.html5Mode(true);
    }
]);