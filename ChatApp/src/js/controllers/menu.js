app.controller("MenuController", ["$scope", "$location", "$routeParams", "SocketService",  function($scope, $location, $routeParams, SocketService) {
    $scope.roomname = "";
    $scope.rooms = [];

    var socket = SocketService.getSocket();

    if(socket){
        socket.emit("rooms");
        socket.on("roomlist", function(roomlist){
            for (var item in roomlist){
                $scope.rooms.push(item);
            }
            console.log($scope.rooms);
        });

        $scope.join = function() {
            SocketService.setRoom($scope.roomname);
            console.log("I am joining the room " + $scope.roomname);
            $location.path("/room/" + $scope.roomname);
        };
    }

}]);
