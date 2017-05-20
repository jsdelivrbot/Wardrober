/**
 * Created by Student on 5/18/17.
 */

var wardroberapp = angular.module('wardroberapp', ['ngRoute']);
//console.log(history.config);
wardroberapp.config(['$routeProvider', '$locationProvider',
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
            }).when('/api/users/images/:image_name/matches', {
                templateUrl: 'matcher.html',
                controller: 'matchController'
            }).otherwise({
                templateUrl: 'login.html',
                controller: 'loginController'
            });
        $locationProvider.html5Mode(true);
    }
]);