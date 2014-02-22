app.controller("RoomController", ["$scope", "$location", "$routeParams", "SocketService", "$timeout", function($scope, $location, $routeParams, SocketService, $timeout) {
    $scope.roomName = $routeParams.roomName;
    $scope.currentMessage = "";
    $scope.users = [];
    $scope.messages = [];

    var socket = SocketService.getSocket();

    //I add a delay to the scope to avoid the thingymajig
    var updateScope = function(tempUsers) {
        $scope.users = tempUsers;
    };

    if(socket) {

        /* Initially update the userlist */
        if(SocketService.isUserBanned($scope.roomName) === false){
            socket.emit("joinroom", { room: $scope.roomName, pass: "" }, function(success, errorMessage) {});
        }
        else{
            $location.path("/menu/");
            SocketService.setBanMessage($scope.roomName);
            console.log("Oops, you have been banned from the room. Shame on you!");
            socket.emit("partroom", $scope.roomName);
        }

        /* You receive this message each time the chat updates */
        socket.on("updatechat", function(roomname, messageHistory) {
            console.log("test: " + messageHistory);
            $scope.messages = messageHistory;
            $scope.$apply();
        });

        /* If you receive a kicked message you are removed from the room and returned to the menu */
        socket.on("kicked", function(room, user, opname) {
            console.log("Kicking: " + user);
            console.log("Sockerservice name: " + SocketService.getUsername());
            if(SocketService.getUsername() == user) {
                console.log("You just got kicked by: " + opname);
                $location.path("/menu");
            }
        });

        /* If you receive a banned message you are removed from the room and returned to the menu */
        socket.on("banned", function(room, user, opname) {
            console.log("Banning: " + user);
            console.log("Sockerservice name: " + SocketService.getUsername());
            if(SocketService.getUsername() == user) {
                SocketService.setUserBanned(room);
                console.log("You just got banned by: " + opname);
                $location.path("/menu");
            }
        });

        /* If you receive an unbanned message you are removed from the banned array in socket services */
        socket.on("unbanned", function(room, user, opname) {
            console.log("Unbanning: " + user);
            console.log("Socketservice name: " + SocketService.getUsername());
            if(SocketService.getUsername() == user) {
                SocketService.removeUserBanned(room);
                console.log("You have been removed from the banned user list");
            }
        });

        /* You receive this message each time the users list updates, when someone leaves, joins is kicked etc */
        socket.on("updateusers", function(room, users, ops) {
            if(room === $scope.roomName) {
                var tempusers = [];
                for (var user in users){
                    tempusers.push(user);
                    console.log("User: " + user);
                }
                for (var op in ops) {
                    tempusers.push(op);
                    SocketService.setUserOp(room, op);
                    console.log("Op: " + op);
                }
                if(SocketService.isUserOp(room) === true) {
                    console.log("Yay im an op!");
                }else{
                    console.log("I'm not an op :(");
                }
                updateScope(tempusers);
            }
            $scope.$apply();
        });

        /* You receive this message each time you receive a private messge */
        socket.on("recv_privatemsg", function(userName, msgObject) { 
            console.log("Received private message: " + msgObject + " from user: " + userName);
            $scope.messages.push({message: msgObject, nick: userName + " sent (private): ", timestamp: new Date()}); 
            $scope.$apply();
        });

        /* This function gets called when you press the send button,  */
        $scope.send = function() {
            /* Parse message entered to check if we are sending a private message */
            if ($scope.currentMessage.substring(0,5) == '/send' || $scope.currentMessage.substring(0,2) == '/t') {
                console.log("Inside private message");
                var userName = $scope.currentMessage.split(' ')[1]; 
                var message = $scope.currentMessage.split(' ').splice(2).join(' '); 
                console.log("I sent a private message to " + userName + ": " + message); 
                socket.emit('privatemsg', { nick: userName, message: message}, function(success, errorMessage) {});
                $scope.messages.push({message: message, nick: "You sent (private): ", timestamp: new Date()});
            }
            /* Parse message entered to check if we are kicking a player *
               you have to be OP to be able to kick people, no newbs allowed */
            else if ($scope.currentMessage.substring(0,5) == '/kick' || $scope.currentMessage.substring(0,2) == '/k') {
                if(SocketService.isUserOp($scope.roomName) === true) {
                    console.log("Kicking");
                    var kickedUser = $scope.currentMessage.split(' ')[1]; 
                    console.log("I just kicked " + kickedUser); 
                    socket.emit('kick', { user: kickedUser, room: $scope.roomName}, function(success, errorMessage) {});
                } else{ 
                    console.log("You can't kick someone if you are not OP"); 
                }
            }
            /* Parse message entered to check if we are banning a player *
               you have to be OP to be able to ban people, no newbs allowed */
            else if ($scope.currentMessage.substring(0,4) == '/ban' || $scope.currentMessage.substring(0,2) == '/b') {
                if(SocketService.isUserOp($scope.roomName) === true) {
                    console.log("Banning");
                    var bannedUser = $scope.currentMessage.split(' ')[1];
                    console.log("I just banned " + bannedUser);
                    socket.emit("ban", {user: bannedUser, room: $scope.roomName}, function(success, errorMessage) {}); 
                } else{
                    console.log("You can't ban someone if you are not OP");
                }
            }
            /* Parse message entered to check if we are unbanning a user *
             * you have to be OP to be able to unban people, no newbs allowed */
            else if ($scope.currentMessage.substring(0,6) == '/unban' || $scope.currentMessage.substring(0,3) == '/ub') {
                if(SocketService.isUserOp($scope.roomName) === true) {
                    console.log("Unbanning");
                    var unbannedUser = $scope.currentMessage.split(' ')[1];
                    console.log("I just unbanned " + unbannedUser);
                    socket.emit("unban", {user: unbannedUser, room: $scope.roomName}, function(success, errorMessage) {}); 
                }
            }
            /* If all else fails we resort to sending a message */
            else {
                console.log("I sent a message to " + $scope.roomName + ": " + $scope.currentMessage);
                socket.emit("sendmsg", { roomName: $scope.roomName, msg: $scope.currentMessage });
            }
            $scope.currentMessage = ""; //Reset the message >(O-O)>
        };

        $scope.leave = function() {
            if (socket) {
                console.log("You are leaving the room: " + $scope.roomName);
                socket.emit("partroom", $scope.roomName);
                $location.path("/menu");
            }
        };
    }

    $scope.keyPress = function($event) {
        if($event.keyCode === 13) {
            $scope.send();
        }
    };
}]);
