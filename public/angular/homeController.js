documentFinderApp.controller('homeController', function ($scope, $http, $location) {

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
             $location.url('/');
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

    bootstrap_alert = function() {};
    bootstrap_alert.warning = function(message) {
        $('#alert_placeholder').html('<div class="alert alert-success alert-dismissable"> <a href="#" class="close" data-dismiss="alert" aria-label="close">×</a> <strong>Success!</strong> Your image is uploaded successfully!!!. </div>');
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
            $('#basicModal').modal('toggle');
            //jQuery.noConflict();
            //$('#myModal').modal();
            bootstrap_alert.warning('Your text goes here');
            //$("div#divLoading").removeClass('show');
        });
    };
});
