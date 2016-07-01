// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    //hide splash screen
    navigator.splashscreen.hide();

    var db = null;
    if (window.cordova) {
      alert('Before database creation Android');
      db = $cordovaSQLite.openDB({name :"my.db",location: 'default'}); //device
      console.log("Android");
      alert('after database creation Android');

    }else{
      alert('Before database creation browser');
      db = window.openDatabase("hisptz.db", '1', 'hisptz', 1024 * 1024 * 100); // browser
      console.log("browser");
      alert('After database creation browser');
    }
    $cordovaSplashscreen.hide();
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)").then(function(){
      alert('table created');
    },function(){
      alert('table failed to be created');
    });


  });
})