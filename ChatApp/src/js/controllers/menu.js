app.controller("MenuController", ["$scope", "$location", "$routeParams", "SocketService", "$timeout", function($scope, $location, $routeParams, SocketService, $timeout) {
    $scope.rooms = [];
    var socket = SocketService.getSocket();

    //I add a delay to the scope to avoid the thingymajig
    var updateScope = function(temprooms) {
        $scope.rooms = temprooms;
    };
    //$timeout(updateScope, 100);

    if(socket){
        socket.emit("rooms");
        socket.on("roomlist", function(roomlist){
            var temprooms = [];
            for (var room in roomlist){
                temprooms.push(room);
            }
            updateScope(temprooms);
            $scope.$apply();
        });

        $scope.join = function() {
            console.log("I am joining the room " + $scope.roomname);
            $location.path("/room/" + $scope.roomname);
        };
    }
    $scope.keyPress = function($event) {
        if($event.keyCode === 13) {
            $scope.send();
        }
    };
}]);
