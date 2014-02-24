app.factory("SocketService", ["$http", function($http) {
    var username = "";
    var socket;
    var roomOp = "";
    var roomBanned = [];
    var isOp = false;
    var banMessage = "";
    return {
        /* Miscallaneous functions */
        setConnected: function(theSocket) {
            socket = theSocket;
        },
        setUsername: function(user) {
            username = user;
        },
        removeUserBanned: function(room) {
            var index = roomBanned.indexOf(room);
            if(index > -1){
                roomBanned.splice(index, 1);
            }
        },
        getUsername: function() {
            return username;
        },
        getSocket: function() {
            return socket;
        },

        /* Functions for banning manipulation */
        setUserBanned: function(room) {
            roomBanned.push(room);
        },
        getUserBannedList: function(room) {
            return roomBanned;
        },
        isUserBanned: function() { 
            if(roomBanned.length === 0) {
                return false;
            }
            return true;
        },
        isUserBannedFromRoom: function(room) {
            if(roomBanned.indexOf(room) < 0) {
                return false;
            }
            return true; 
        },

        /* Functions for operator manipulation */
        isUserOp: function(room) {
            if((roomOp == room) && (isOp === true)) {
                return true;
            }
            return false;
        },
        setUserOp: function(room, op) {
            if(op == username) {
                roomOp = room;
                isOp = true;
            }
        },
        removeUserOp: function(room, op) {
            if(op == username) {
                roomOp = "";
                isOp = false;
            }
        }
    };
}]);
