/**
 * Created by Student on 5/19/17.
 */

wardroberapp.controller('matchController', function ($scope, $http, $location) {
    //$("div#divLoading").addClass('show');
    //$('#preloader').fadeOut('slow',function(){$(this).remove();});
    var isUserLoggedIn = function() {
        var isLoggedInResponse = $http.get('/api/isLoggedIn');
        isLoggedInResponse.success(function(data) {
            if(data.status != 200) {
                $location.url('/');
            }
        });
    };
    isUserLoggedIn();

    $scope.doLogout = function() {
        var logout_response = $http.get('/api/logout');
        logout_response.success(function(data) {
            if(data.status == 200) {
                $location.url('/home');
            }
        });
    };
});