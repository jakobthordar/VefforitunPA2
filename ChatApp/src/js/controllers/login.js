app.controller("LoginController", ["$scope", "$location", "SocketService", function($scope, $location, SocketService) {
    $scope.username = "";
    $scope.message = "";
    var socket = io.connect('http://localhost:8080');

    $scope.connect = function() {
        if(socket) {
            socket.emit("adduser", $scope.username, function(available) {
                if(available) {
                    SocketService.setConnected(socket);
                    SocketService.setUsername($scope.username);

                    $location.path("/menu");
                }
                else {
                    $scope.message = "Your name is taken, please choose another";
                }
            $scope.$apply();
            });
        }
    };
    $scope.keyPress = function($event) {
        if($event.keyCode === 13) {
            $scope.connect();
        }
    };
}]);
