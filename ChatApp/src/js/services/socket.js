app.factory("SocketService", ["$http", function($http) {
    var username = "";
    var socket;
    var roomOp = "";
    var roomBanned = [];
    var isOp = false;
    var banMessage = "";
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
        setUserBanned: function(room) {
            roomBanned.push(room);
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
        getUserBannedList: function(room) {
            return roomBanned;
        },
        isUserBanned: function() { /* Checks if the user is banned from any room */
            if(roomBanned.length === 0) {
                return false;
            }
            return true;
        },
        isUserBannedFromRoom: function(room) {
        /* Checks if the user is banned from a specific room */
            if(roomBanned.indexOf(room) < 0) {
                return false;
            }
            return true; 
        },
        isUserOp: function(room) {
            if((roomOp == room) && (isOp === true)) {
                return true;
            }
            return false;
        },
        setBanMessage: function(room) {
            banMessage = room;
        },
        getBanMessage: function() {
            var tempmessage = "";
            if(banMessage !== "") {
                tempmessage = "You have been banned from: " + banMessage;
                banMessage = "";
            }
            return tempmessage;
        }
    };
}]);
