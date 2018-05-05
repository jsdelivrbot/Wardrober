documentFinderApp.controller('mineController', function ($scope, $http, $location,  $routeParams) {
    var isUserLoggedIn = function() {
        var isLoggedInResponse = $http.get('/api/isLoggedIn');
        isLoggedInResponse.success(function(data) {
            if(data.status != 200) {
                $location.url('/');
            }
            $scope.user = data.user;
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

    var get_selected_image_details = function() {
        $scope.image_name = $routeParams.image_name;
        var url_label_response = $http.get('/api/users/images/' + $scope.image_name + '/labels');
        url_label_response.success(function(data) {
           $scope.labels = data.labels;
        });
    };
    get_selected_image_details();

    var get_matches = function() {
          var match_response = $http.get('/api/users/images/' + $routeParams.image_name +'/results/mine');

          match_response.success(function(data) {

              // data object contains the details
              // related to the mined info from the internet.


          });
    };
    get_matches();
});