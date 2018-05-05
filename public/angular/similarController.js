documentFinderApp.controller('similarController', function ($scope, $http, $location,  $routeParams) {
    //$("div#divLoading").addClass('show');
    //$('#preloader').fadeOut('slow',function(){$(this).remove();});
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
        var match_response = $http.get('/api/users/images/' + $routeParams.image_name +'/results/similar    ');
        //var match_response = $http.get('/api/users/images/aac9cf02-931e-4df4-adcf-d4313ec44759.png/results');
        $scope.urls = [];
        match_response.success(function(data) {
            if(data.status == 200) {
                data.urls.forEach(function(url) {
                    var url_label_response = $http.get('/api/users/images/' + url.split('/')[3] + '/labels');
                    url_label_response.success(function(url_label_data) {
                        var url_entry = {};
                        url_entry.url = url;
                        url_entry.labels = url_label_data.labels;
                        $scope.urls.push(url_entry);
                    });
                });
            }
        })
    };
    get_matches();
});