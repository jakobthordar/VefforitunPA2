app.factory("SocketService", ["$http", function($http) {
    var username = "";
    var socket;
    var roomOp = "";
    var isOp = false;
    return {
        setConnected: function(theSocket) {
            socket = theSocket;
        },
        setUsername: function(user) {
            username = user;
        },
        setUserOp: function(room, op) {
            if(op == username) {
                roomOp = room;
                isOp = true;
            }
        },
        getUsername: function() {
            return username;
        },
        getSocket: function() {
            return socket;
        },
        isUserOp: function(room) {
            if((roomOp == room) && (isOp === true)){
                return true;
            }
            return false;
        }
    };
}]);
