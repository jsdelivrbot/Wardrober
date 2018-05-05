/**
 * Created by Student on 5/18/17.
 */

var documentFinderApp = angular.module('documentFinderApp', ['ngRoute']);
//console.log(history.config);
documentFinderApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider, $routeParams, $location) {
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
            }).when('/gallery', {
                templateUrl: 'gallery.html',
                controller: 'galleryController'
            }).when('/api/users/images/:image_name/mine', {
                templateUrl: 'mine.html',
                controller: 'mineController'
            })
            .otherwise({
                templateUrl: 'login.html',
                controller: 'loginController'
            });
        $locationProvider.html5Mode(true);
    }
]);