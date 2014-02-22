app.controller("MenuController", ["$scope", "$location", "$routeParams", "SocketService", "$timeout", function($scope, $location, $routeParams, SocketService, $timeout) {
    $scope.rooms = [];
    var socket = SocketService.getSocket();
    $scope.banMessage = "";

    //I add a delay to the scope to avoid the thingymajig
    var updateScope = function(temprooms) {
        $scope.rooms = temprooms;
    };
    var updateBanMessage = function() {
        $scope.banMessage = SocketService.getBanMessage();
    };
    $timeout(updateBanMessage, 200);

    if(socket){
        socket.emit("rooms");
        updateBanMessage();
        socket.on("roomlist", function(roomlist){
            var temprooms = [];
            for (var room in roomlist){
                temprooms.push(room);
            }
            updateScope(temprooms);
            $scope.$apply();
        });
        /* You are probably in the menu when you are being unbanned */
        socket.on("unbanned", function(room, user, opname) {
            console.log("Unbanning: " + user);
            console.log("Socketservice name: " + SocketService.getUsername());
            if(SocketService.getUsername() == user) {
                SocketService.removeUserBanned(room);
                console.log("You have been removed from the banned user list");
            }
        });
        var temp = SocketService.getUserBannedList($scope.roomname);
        /* Allow the user to join a room, only if he has not been banned *
         * from that room though! */
        $scope.join = function() {
            console.log("I am joining the room " + $scope.roomname);
            $location.path("/room/" + $scope.roomname);
        };
    }
    $scope.keyPress = function($event) {
        if($event.keyCode === 13) {
            $scope.join();
        }
    };
}]);
