documentFinderApp.controller('signupController', function ($scope, $http, $location) {

    var isUserLoggedIn = function() {
        var isLoggedInResponse = $http.get('/api/isLoggedIn');
        isLoggedInResponse.success(function(data) {
            if(data.status == 200) {
                $location.url('/home');
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
            $location.url('/');
        });

    };
});