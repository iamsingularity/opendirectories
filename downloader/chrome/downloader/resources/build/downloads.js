// Generated by CoffeeScript 1.9.3
(function() {
  var app;

  app = angular.module("downloader.downloads", []);

  app.controller("NewDownloadController", [
    "$scope", "$rootScope", "$mdDialog", "$http", "Server", function($scope, $rootScope, $mdDialog, $http, Server) {
      $scope.model = {
        url: "",
        http_username: "",
        http_password: ""
      };
      $scope.forms = {};
      $scope.error = null;
      $scope.save = function() {
        var data;
        data = {
          download: $scope.model
        };
        return $http({
          method: "POST",
          url: Server.service.build("/api/v1/downloads.json"),
          data: data
        }).then(function() {
          $rootScope.$broadcast("downloads.get");
          $mdDialog.hide();
        }, function(message) {
          $scope.error = message.data.error;
        });
      };
      return $scope.close = function() {
        return $mdDialog.hide();
      };
    }
  ]);

}).call(this);
