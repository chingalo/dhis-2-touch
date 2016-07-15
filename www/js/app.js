// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic',
        'ngCordova',
        'ngStorage',
        'app.controllers',
        'ui-notification',
        'app.routes',
        'app.services',
        'angular-spinkit',
        'app.directives'])

    .run(function ($ionicPlatform, $cordovaSplashscreen, $cordovaSQLite) {
        $ionicPlatform.ready(function () {
            var db = null;
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
            if (window.cordova) {
                console.log('Before database creation Android');
                db = $cordovaSQLite.openDB({name: "demo.db", location: 'default'}); //device
                console.log("Android");
                console.log('after database creation Android');
                $cordovaSplashscreen.hide();

            } else {
                console.log('Before database creation browser');
                db = window.openDatabase("demo.db", '1', 'demo', 1024 * 1024 * 10000); // browser
                console.log("browser");
                console.log('After database creation browser');
            }


        });
    })
    .config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            positionX: 'center',
            positionY: 'bottom'
        });
    });