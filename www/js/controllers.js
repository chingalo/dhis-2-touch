angular.module('app.controllers', [])

    .controller('mainCtrl',function($scope){

        $scope.$on("$ionicView.beforeEnter", function(event, data){
            // handle event
            console.log("State Params: ", data,event);
        });

        $scope.$on("$ionicView.enter", function(event, data){
            // handle event
            console.log("State Params: ", data,event);
        });

        $scope.$on("$ionicView.afterEnter", function(event, data){
            // handle event
            console.log("State Params: ", data,event);
        });
    })
  
.controller('appsCtrl', function($scope) {

})
   
.controller('accountCtrl', function($scope) {

})
      
.controller('loginCtrl', function($scope) {

})
   
.controller('helpCtrl', function($scope) {

})
   
.controller('dataEntryCtrl', function($scope) {

})
   
.controller('profileCtrl', function($scope) {

})
   
.controller('aboutCtrl', function($scope) {

})
   
.controller('settingsCtrl', function($scope) {

})
   
.controller('dashBoardCtrl', function($scope) {

})
   
.controller('trackerCaptureCtrl', function($scope) {

})
   
.controller('reportListCtrl', function($scope) {

})
   
.controller('eventCaptureCtrl', function($scope) {

})
   
.controller('reportParameterSelectionCtrl', function($scope) {

})
   
.controller('reportViewCtrl', function($scope) {

})
   
.controller('dataEntryFormCtrl', function($scope) {

})
   
.controller('eventRegisterCtrl', function($scope) {

})
   
.controller('helpDetailsCtrl', function($scope) {

})
   
.controller('settingDetailsCtrl', function($scope) {

})
 