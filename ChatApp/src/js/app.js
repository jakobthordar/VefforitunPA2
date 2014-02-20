var app = angular.module("ChatApp", ["ngRoute"]);

app.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/", {
		templateUrl: "templates/home.html",
		controller: "LoginController",
	}).when("/room/:roomName", {
		templateUrl: "templates/room.html",
		controller: "RoomController",
    }).when("/menu",{
        templateUrl: "templates/menu.html",
        controller: "MenuController",
	}).otherwise({ redirectTo: "/" });
}]);
