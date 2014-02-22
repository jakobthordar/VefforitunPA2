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
            if(index <= 0){
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
        isUserBanned: function(room) {
            if(roomBanned.indexOf(room) < 0){
                return false;
            }
            else {
                return true; 
            }
        },
        isUserOp: function(room) {
            if((roomOp == room) && (isOp === true)){
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
