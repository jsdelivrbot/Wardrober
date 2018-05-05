documentFinderApp.controller('loginController', function ($scope, $http, $location) {
    //$("div#divLoading").addClass('show');
    //$('#preloader').fadeOut('slow',function(){$(this).remove();});
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
            $location.url('/home');
        });

    };
});