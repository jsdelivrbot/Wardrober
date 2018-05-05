/**
 * Created by Student on 5/18/17.
 */

documentFinderApp.controller('galleryController', function ($scope, $http, $location) {
    var isUserLoggedIn = function() {
        var isLoggedInResponse = $http.get('/api/isLoggedIn');
        isLoggedInResponse.success(function(data) {
            if(data.status != 200) {
                $location.url('/');
            }
            else {
                $scope.user = data.user;
                get_gallery();
            }
        });
    };
    isUserLoggedIn();

    $scope.doLogout = function() {
        var logout_response = $http.get('/api/logout');
        logout_response.success(function(data) {
            if(data.status == 200) {
                //$location.url('/');
            }
        });
    };

    var get_gallery = function() {
        var gallery_response = $http.get('/api/users/images');
        gallery_response.success(function(data) {
            $scope.urls = data.urls;
        });
    };
});