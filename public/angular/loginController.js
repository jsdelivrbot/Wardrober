/**
 * Created by Student on 5/18/17.
 */
wardroberapp.controller('loginController', function ($scope, $http) {
   //alert("angular works");
    $scope.doLogin = function() {
        $http({
            method: 'POST',
            url: '/api/login',
            data:{
                "email":$scope.email,
                "password":$scope.password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data) {
            window.location = "/home";
        });

    };
});