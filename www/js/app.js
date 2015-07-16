/*global $*/
/*global document*/
/*global angular*/
/*global window*/
/*global cordova*/
/*global StatusBar*/
/*global localStorage*/
/*jslint node: true */
/*global FileUploadOptions*/
/*global FileTransfer*/
/*global navigator*/
"use strict";
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic', 'ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {templateUrl: 'coIns.html'})
        .when('/dash', {templateUrl: 'dashboard.html'})
        .when('/list', {templateUrl: 'liste.html'})
        .when('/recus', {templateUrl: 'recus.html'})
        .when('/success', {templateUrl: 'success.html'})
        .otherwise({redirectTo: '/'});
}]);
angular.module('app', ['ngTouch']);
angular.module('app', ['ngRoute']);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
app.controller('InscriptionController', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    $scope.validate = function () {
        if ($scope.signupMail !== null || $scope.signupPass !== null) {
            $http.post("http://remikel.fr/api.php?option=inscription",
                {'password' : $scope.signupPass, 'email' : $scope.signupMail}).success(function () {
                $location.path('/');
            });
        }
    };
}]);
app.controller('ConnexionController', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    $scope.personnel = function () {
        if ($scope.logMail !== null || $scope.logPass !== null) {
            $http.post("http://remikel.fr/api.php?option=connexion",
                {'password' : $scope.logPass, 'email' : $scope.logMail}).success(function (data) {
                localStorage.setItem("username", data.data[0].username);
                localStorage.setItem("id", data.data[0].id);
                localStorage.setItem("token", data.token);
                $location.path('/dash');
            });
        }
    };
}]);
app.controller('DashController', ['$scope', '$location', function ($scope, $location) {
    this.camera = function () {
        navigator.camera.getPicture(function (imageData) {
            localStorage.setItem("photo", imageData);
            $location.path('/list');
        }, function () {
            $location.path('/dash');
        }, {quality: 50});
    };
    $scope.list = function () {
        $location.path('/list');
    };
    $scope.recus = function () {
        $location.path('/recus');
    };
    $scope.troissecondes = function () {
        var trois = 3;
        localStorage.setItem("tempsDe", trois);
    };
    $scope.cinqsecondes = function () {
        var cinq = 5;
        localStorage.setItem("tempsDe", cinq);
    };
    $scope.dixsecondes = function () {
        var dix = 10;
        localStorage.setItem("tempsDe", dix);
    };
}]);
app.controller('ListController', ['$http', '$scope', '$location', function ($http, $scope, $location) {
    var viewStorage, againToken, showYourId, giveMeTime;
    $scope.dashB = function () {
        $location.path('/dash');
    };
    $scope.notif = function () {
        $location.path('/recus');
    };
    viewStorage = localStorage.getItem("username");
    againToken = localStorage.getItem("token");
    showYourId = localStorage.getItem("id");
    giveMeTime = localStorage.getItem("tempsDe");
    if (viewStorage !== null && againToken !== null) {
        $http.post('http://remikel.fr/api.php?option=toutlemonde',
            {'email' : viewStorage, 'token' : againToken}).success(function (data) {
            $scope.friends = data.data;
        });
    }
    $scope.friendListing = function () {
        var win, fail, options, fileURI, ft, params;
        win = function (r) {
            console.log(r);
        };
        fail = function (error) {
            console.log(error);
        };
        options = new FileUploadOptions();
        fileURI = localStorage.getItem("photo");
        options.fileKey = "file";
        options.fileName = fileURI.substr(fileURI.lastIndexOf('/') + 1);//substr extrait un sous chaine d'une chaine.cherche la derniere occurence de fileURI
        options.mimeType = "image/jpeg";
        ft = new FileTransfer();
        params = {};
        params.email = viewStorage;
        params.u2 = showYourId;
        params.temps = giveMeTime;
        params.token = againToken;
        options.params = params;
        if (fileURI !== null) {
            ft.upload(fileURI, encodeURI('http://remikel.fr/api.php?option=image'), win, fail, options);
            $location.path('/success');
        }
    };
}]);
app.controller('RecipeController', ['$http', '$scope', '$location', '$timeout', function ($http, $scope, $location, $timeout) {
    $scope.dashBo = function () {
        $location.path('/dash');
    };
    $scope.liste = function () {
        $location.path('/list');
    };
    var showYourToken, showYourMail;
    showYourMail = localStorage.getItem("username");
    showYourToken = localStorage.getItem("token");
    if (showYourMail !== null && showYourToken !== null) {
        $http.post('http://remikel.fr/api.php?option=newsnap',
            {'email' : showYourMail, 'token' : showYourToken}).success(function (data) {
            $scope.pictures = data.data;
            localStorage.setItem("yourTime", data.data[0].temps);
            localStorage.setItem("yourUrl", data.data[0].url);
        });
    }
    $scope.pictureListing = function (url, tps) {
        $timeout(function () {
            $location.path('/dash');
        }, tps * 1000);
        var viewMail, againTokenVu, voirLaPhoto;
        voirLaPhoto = url;
        viewMail = localStorage.getItem("username");
        againTokenVu = localStorage.getItem("token");
        $http.post('http://remikel.fr/api.php?option=vu',
                {'email': viewMail, 'token' : againTokenVu}).success(function () {
            $location.path('/recus');
        });
        $scope.url = voirLaPhoto;
    };
}]);
app.controller('SuccessController', ['$scope', '$location', function ($scope, $location) {
    $scope.backToDash = function () {
        $location.path('/dash');
    };
}]);