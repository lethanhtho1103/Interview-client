var app = angular.module("myApp", ["ngRoute"]);

app.config(function ($routeProvider) {
  $routeProvider
    .when("/home", {
      templateUrl: "app/views/home.html",
      controller: "HomeController",
      resolve: {
        auth: function (AuthService, $location) {
          if (!AuthService.isLoggedIn()) {
            $location.path("/login");
          }
        },
      },
    })
    .when("/login", {
      templateUrl: "app/views/login.html",
      controller: "LoginController",
      resolve: {
        auth: function (AuthService, $location) {
          if (AuthService.isLoggedIn()) {
            $location.path("/home");
          }
        },
      },
    })
    .otherwise({
      redirectTo: "/login",
    });
});
