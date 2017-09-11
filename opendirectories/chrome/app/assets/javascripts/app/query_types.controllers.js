var app;

app = angular.module("opendirectories.queryTypes.controllers", ["opendirectories.services"]);

app.controller("QueryTypesIndexController", [
  "$scope", "$location", "ListService", "Topbar", "DEFAULT_SETTINGS", function($scope, $location, ListService, Topbar, DEFAULT_SETTINGS) {
    Topbar.reset();
    Topbar.linkBackTo("/");
    Topbar.setTitle("Settings");
    Topbar.addSubtitle("Query Types");
    $scope.queryTypes = {
      "default": $.extend([], DEFAULT_SETTINGS.QUERY_TYPES),
      chrome: []
    };
    chrome.storage.local.get("queryTypes", function(data) {
      if (data.queryTypes) {
        return $scope.queryTypes.chrome = JSON.parse(data.queryTypes);
      }
    });
    $scope.edit = function(index) {
      return $location.path("/settings/queryTypes/" + index);
    };
    return $scope["delete"] = function(index) {
      ListService.service.removeAndStore($scope.queryTypes.chrome, "queryTypes", index);
      return $rootScope.$broadcast("reload.chrome");
    };
  }
]);

app.controller("QueryTypeNewController", [
  "$scope", "$rootScope", "$timeout", "Topbar", "ListService", function($scope, $rootScope, $timeout, Topbar, ListService) {
    Topbar.reset();
    Topbar.linkBackTo("/settings/queryTypes");
    Topbar.setTitle("Settings");
    Topbar.addSubtitle("Query Types");
    Topbar.addSubtitle("Add new");
    $timeout((function() {
      return $(".new-query-type input").focus();
    }), 500);
    $scope.form = {};
    $scope.formLabel = "Add";
    $scope.model = {
      name: "",
      exts: ""
    };
    return $scope.save = function() {
      if (!$scope.form.$invalid) {
        ListService.service.addToList("queryTypes", $scope.model);
        $rootScope.$broadcast("reload.chrome");
        return $timeout((function() {
          return $scope.visit("/settings/queryTypes");
        }), 500);
      }
    };
  }
]);

app.controller("QueryTypeEditController", [
  "$scope", "$rootScope", "$routeParams", "$timeout", "Topbar", "ListService", function($scope, $rootScope, $routeParams, $timeout, Topbar, ListService) {
    Topbar.reset();
    Topbar.linkBackTo("/settings/queryTypes");
    Topbar.setTitle("Settings");
    Topbar.addSubtitle("Query Types");
    Topbar.addSubtitle("Edit");
    $scope.form = {};
    $scope.formLabel = "Edit";
    $scope.model = {
      name: "",
      exts: ""
    };
    $scope.queryTypes = [];
    chrome.storage.local.get("queryTypes", function(data) {
      if (data.queryTypes) {
        $scope.queryTypes = JSON.parse(data.queryTypes);
        return $scope.model = $scope.queryTypes[$routeParams.index];
      }
    });
    return $scope.save = function() {
      if (!$scope.form.$invalid) {
        ListService.service.update($scope.queryTypes, "queryTypes", $scope.model, $routeParams.index);
        $rootScope.$broadcast("reload.chrome");
        return $timeout((function() {
          return $scope.visit("/settings/queryTypes");
        }), 500);
      }
    };
  }
]);
