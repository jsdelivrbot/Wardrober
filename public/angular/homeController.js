/**
 * Created by Student on 5/18/17.
 */


wardroberapp.controller('homeController', function ($scope, $http) {

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

    $scope.filesInfo = [];

    $scope.uploadFile = function(files) {
        $scope.filesInfo = [];
        $scope.filesInfo = files;
        console.log($scope.filesInfo);
        console.log($scope.filesInfo[0]);
    };

    $scope.upload_image = function() {
        var reqData = new FormData();
        reqData.append("image", $scope.filesInfo[0]);
        console.log(reqData);
        $http({
            method: 'POST',
            url: '/api/users/images',
            data: reqData,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        }).success(function(data) {
            $("#myModal").modal();
        });
    };
});
