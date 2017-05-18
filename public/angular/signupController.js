/**
 * Created by Student on 5/18/17.
 */

wardroberapp.controller('signupController', function ($scope, $http) {

    var isUserLoggedIn = function() {
        var isLoggedInResponse = $http.get('/api/isLoggedIn');
        isLoggedInResponse.success(function(data) {
            if(data.status != 200) {
                window.location = "/home";
            }
        });
    };
    isUserLoggedIn();

    //alert("angular works");
    $scope.doSignUp = function() {
        $http({
            method: 'POST',
            url: '/api/signup',
            data:{
                "firstname": $scope.firstname,
                "lastname": $scope.lastname,
                "email":$scope.email,
                "password":$scope.password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/";
        });

    };
});