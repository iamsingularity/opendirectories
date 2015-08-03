// Generated by CoffeeScript 1.9.3
(function() {
  var app, debug, icons;

  app = angular.module("opendl", ["ng-token-auth", "ngAria", "ngAnimate", "ngMaterial", "ngMdIcons", "opendl.auth"]);

  icons = {
    initial: "cloud_circle",
    queued: "cloud",
    busy: "cloud_download",
    done: "done",
    error: "error"
  };

  debug = true;

  app.service("Logging", [
    function() {
      return {
        debug: function(message) {
          if (debug) {
            return console.debug(message);
          }
        }
      };
    }
  ]);

  app.factory("Server", [
    function() {
      return {
        service: {
          server: "localhost",
          port: 3000,
          build: function(path) {
            return "http://" + this.server + ":" + this.port + path;
          }
        }
      };
    }
  ]);

  app.config(function($authProvider) {
    return $authProvider.configure({
      apiUrl: "http://localhost:3000"
    });
  });

  app.controller("appController", [
    "$scope", "$rootScope", "$mdMedia", "$http", "$mdDialog", "Server", "Logging", "$auth", function($scope, $rootScope, $mdMedia, $http, $mdDialog, Server, Logging, $auth) {
      var deleteDownload;
      $scope.path = "Authenticate";
      $auth.validateUser().then(function(data) {
        return $scope.getDownloads();
      }, function() {
        return $mdDialog.show({
          templateUrl: "log-in.html",
          controller: "authController",
          clickOutsideToClose: false
        });
      });
      $scope.logOut = function() {
        return $auth.signOut().then(function() {
          $scope.downloads = [];
          return $mdDialog.show({
            templateUrl: "log-in.html",
            controller: "authController",
            clickOutsideToClose: false
          });
        });
      };
      $rootScope.$on("reload", function() {
        return $scope.getDownloads();
      });
      $scope.getDownloads = function() {
        $scope.path = "Downloads";
        return $http({
          method: "GET",
          url: Server.service.build("/api/v1/downloads.json"),
          dataType: "jsonp"
        }).success(function(data) {
          $.map(data.items, function(e, i) {
            e.visible = false;
            return e.icon = icons[e.status];
          });
          return $scope.downloads = data;
        });
      };
      $scope.newDownload = function($event) {
        $scope.path = "New Download";
        return $mdDialog.show({
          templateUrl: "new-download.html",
          controller: "DialogController",
          clickOutsideToClose: true
        }).then(function() {
          return $scope.getDownloads();
        });
      };
      $scope.deleteDownload = function(download, $event) {
        var confirm;
        $scope.path = "Delete Download";
        confirm = $mdDialog.confirm().title("Delete Download").content("Are you sure you want to delete '" + download.url + "'?").ok('BE GONE WITH IT!').cancel('No').targetEvent($event);
        return $mdDialog.show(confirm).then((function() {
          return deleteDownload(download);
        }), function() {
          return $scope.getDownloads();
        });
      };
      return deleteDownload = function(download) {
        return $http({
          method: "DELETE",
          url: Server.service.build("/api/v1/downloads/" + download.id),
          dataType: "jsonp"
        }).success(function() {
          return $scope.getDownloads();
        });
      };
    }
  ]);

  app.controller("DialogController", [
    "$scope", "$rootScope", "$mdDialog", "$http", "Server", "Logging", function($scope, $rootScope, $mdDialog, $http, Server, Logging) {
      $scope.model = {
        url: "",
        http_username: "",
        http_password: ""
      };
      $scope.save = function() {
        var data;
        Logging.debug("post");
        data = {
          download: $scope.model
        };
        return $http({
          method: "POST",
          url: Server.service.build("/api/v1/downloads?" + ($.param(data)))
        }).success(function() {
          $rootScope.$broadcast("reload");
          $mdDialog.hide();
        });
      };
      return $scope.close = function() {
        return $mdDialog.hide();
      };
    }
  ]);

}).call(this);