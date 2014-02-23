app.controller("MenuController", ["$scope", "$location", "$routeParams", "SocketService", "$timeout", function($scope, $location, $routeParams, SocketService, $timeout) {
    $scope.rooms = [];
    $scope.banrooms = [];
    var socket = SocketService.getSocket();
    $scope.banMessage = "";

    //I add a delay to the scope to avoid the thingymajig
    var updateScope = function(roomlist) {
        var temprooms = [];
        for (var room in roomlist){
            temprooms.push(room);
        }
        $scope.rooms = temprooms;
    };
    var updateBanList = function() {
        console.log("Updating banlist");
        var tempbanrooms = [];
        tempbanrooms = SocketService.getUserBannedList();
        for(var i = 0; i < tempbanrooms.length; i++){
            console.log(i + " = " + tempbanrooms[i]);
        }
        $scope.banrooms = SocketService.getUserBannedList();
    };

    if(socket){
        console.log("Welcome to the menu");
        socket.emit("rooms");
        socket.on("roomlist", function(roomlist){
            updateScope(roomlist);
            $scope.$apply();
        });
        if(SocketService.isUserBanned()) {
            console.log("Inside isUserBanned()");
            updateBanList();
        }
        /* You are probably in the menu when you are being unbanned */
        socket.on("unbanned", function(room, user, opname) {
            console.log("Unbanning: " + user + ". from room: " + room + ". by: " + opname);
            console.log("Socketservice name: " + SocketService.getUsername());
            if(SocketService.getUsername() == user) {
                SocketService.removeUserBanned(room);
                console.log("You have been removed from the banned user list");
                updateBanList();
            }
            $scope.$apply();
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
