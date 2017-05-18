/**
 * Created by Student on 5/18/17.
 */


wardroberapp.controller('homeController', function ($scope, $http) {

    var isUserLoggedIn = function() {
      var isLoggedInResponse = $http.get('/api/isLoggedIn');
      isLoggedInResponse.success(function(data) {
         if(data.status != 200) {
             window.location = "/";
         }
      });
    };
    isUserLoggedIn();

    $scope.doLogout = function() {
      var logout_response = $http.get('/api/logout');
      logout_response.success(function(data) {
         if(data.status == 200) {
             window.location = "/";
         }
      });
    };
});
