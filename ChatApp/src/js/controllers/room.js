app.controller("RoomController", ["$scope", "$location", "$routeParams", "SocketService", "$timeout", function($scope, $location, $routeParams, SocketService, $timeout) {
    $scope.roomName = $routeParams.roomName;
    $scope.currentMessage = "";
    $scope.users = [];

    var socket = SocketService.getSocket();

    //I add a delay to the scope to avoid the thingymajig
    var updateScope = function(tempUsers) {
        $scope.users = tempUsers;
    };
    $timeout(updateScope, 200);

    if(socket) {
        socket.emit("joinroom", { room: $scope.roomName, pass: "" }, function(success, errorMessage) {

        });

        socket.on("updatechat", function(roomname, messageHistory) {
            console.log(messageHistory);
            $scope.messages = messageHistory;
            $scope.$apply();
        });

        socket.on("updateusers", function(room, users) {
            if(room === $scope.roomName) {
                var tempusers = [];
                for (var item in users){
                    tempusers.push(item);
                    console.log(item);
                }
                updateScope(tempusers);
                console.log("End of user list");
            }
        });

        socket.on("recv_privatemsg", function(userName, msgObject) { 
            console.log("Received private message: " + msgObject + " from user: " + userName);
            $scope.messages.push(msgObject); 
            $scope.$apply();
        });
    }
    $scope.leave = function() {
        if (socket) {
            console.log("You are leaving the room: " + $scope.roomName);
            socket.emit("partroom", $scope.roomName);
            $location.path("/menu");
        }
    };

    $scope.send = function() {
        if(socket) {
            //If is private message 
            if ($scope.currentMessage.substring(0,2) == '/t' || $scope.currentMessage.substring(0,5) == '/send') {
                var userName = $scope.currentMessage.split(' ')[1]; 
                var message = $scope.currentMessage.split(' ').splice(2).join(' '); 
                console.log("I sent a private message to " + userName + ": " + message); 
                socket.emit('privatemsg', { nick: userName, message: message}, function(success, errorMessage) {});
            }
            else {
                console.log("I sent a message to " + $scope.roomName + ": " + $scope.currentMessage);
                socket.emit("sendmsg", { roomName: $scope.roomName, msg: $scope.currentMessage });
            }
            $scope.currentMessage = "";
        }
    };

    $scope.keyPress = function($event) {
        if($event.keyCode === 13) {
            $scope.send();
        }
    };
}]);
