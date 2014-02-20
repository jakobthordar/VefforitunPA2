app.controller("MenuController", ["$scope", "$location", "$routeParams", "SocketService", "$timeout", function($scope, $location, $routeParams, SocketService, $timeout) {
    $scope.rooms = [];
    var socket = SocketService.getSocket();

    //I add a delay to the scope to avoid the thingymajig
    var updateScope = function(room) {
        $scope.rooms.push(room);
    };
    $timeout(updateScope, 100);

    if(socket){
        socket.emit("rooms");
        console.log("Before room print");
        socket.on("roomlist", function(roomlist){
            for (var room in roomlist){
                updateScope(room);
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
