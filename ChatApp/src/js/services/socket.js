app.factory("SocketService", ["$http", function($http) {
    var username = "";
    var socket;
    var roomname = "";
    return {
        setConnected: function(theSocket) {
            socket = theSocket;
        },
        setUsername: function(user) {
            username = user;
        },
        setRoom: function(user, room) {
            roomname = room;
        },
        getUsername: function() {
            return username;
        },
        getSocket: function() {
            return socket;
        },
        getRoom: function() {
            return roomname;
        }
    };
}]);
