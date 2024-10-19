var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/home", {
      templateUrl: "app/views/home.html",
      controller: "HomeController",
    })
    .when("/login", {
      templateUrl: "app/views/login.html",
      controller: "LoginController",
    })
    .otherwise({
      redirectTo: "/login",
    });
});
