angular.module('app.controllers', [])

    .controller('mainCtrl', function ($scope, userFactory) {

        //object for controller
        $scope.data = {
            loaderState : false
        };

        userFactory.setEmptyUser().then(function () {
            //empty user is added
        });

        /**
         * setChangeViewLoader
         * @param stateName
         */
        function setChangeViewLoader(stateName,loaderState){
            if(stateName != "login" && stateName != undefined ){
                $scope.data.loaderState = loaderState;
            }else{
                $scope.data.loaderState = false;
            }
        }

        /**
         * Controller for view rendering, enter and leave
         */
        $scope.$on("$ionicView.beforeEnter", function (event, data) {
            setChangeViewLoader(data.stateName,true);
        });
        $scope.$on("$ionicView.afterEnter", function (event, data) {
            setChangeViewLoader(data.stateName,false);
        });

        //$scope.$on("$ionicView.beforeEnter", function (event, data) {
        //    // handle event
        //    console.log("State Params: ", data, event);
        //});
        //$scope.$on("$ionicView.enter", function (event, data) {
        //    // handle event
        //    console.log("State Params: ", data, event);
        //});

    })

    .controller('appsCtrl', function ($scope) {

    })

    .controller('accountCtrl', function ($scope) {

    })

    .controller('loginCtrl', function ($scope,appFactory,
                                       userFactory,Notification,
                                       $localStorage,
                                       $state) {

        //variable declarations
        $scope.data = {
            user : {}
        };
        if(angular.isDefined($localStorage.currentUser.baseUrl)){
            $scope.data.baseUrl = $localStorage.currentUser.baseUrl;
        }

        //onclick login button
        $scope.onClickLoginButton = function(){
            var baseUrl = $scope.data.baseUrl;
            appFactory.getFormattedBaseUrl(baseUrl).then(function(formattedUrl){
                Notification.clearAll();
                $localStorage.currentUser.baseUrl = formattedUrl;
                if(hasUsernameAndPassword()){
                    $localStorage.currentUser.username = $scope.data.user.username;
                    $localStorage.currentUser.password = $scope.data.user.password;
                    appFactory.setAuthorizationOnHeader($scope.data.user).then(function(){
                        userFactory.authenticateUser().then(function(){
                            $state.go('tabsController.apps',{},{});
                        },function(){
                            Notification.error('Fail')
                        })
                    });
                }
            },function(){
                Notification('Please enter server url');
            });
        };

        function hasUsernameAndPassword(){
            var result = true;
            if($scope.data.user.username == undefined){
                Notification('Please Enter Username');
                result = false;
            }else{
                if($scope.data.user.password == undefined){
                    Notification('Please Enter Password');
                    result = false;
                }
            }
            return result;
        }

    })

    .controller('helpCtrl', function ($scope) {

    })

    .controller('dataEntryCtrl', function ($scope) {

    })

    .controller('profileCtrl', function ($scope) {

    })

    .controller('aboutCtrl', function ($scope) {

    })

    .controller('settingsCtrl', function ($scope) {

    })

    .controller('dashBoardCtrl', function ($scope) {

    })

    .controller('trackerCaptureCtrl', function ($scope) {

    })

    .controller('reportListCtrl', function ($scope) {

    })

    .controller('eventCaptureCtrl', function ($scope) {

    })

    .controller('reportParameterSelectionCtrl', function ($scope) {

    })

    .controller('reportViewCtrl', function ($scope) {

    })

    .controller('dataEntryFormCtrl', function ($scope) {

    })

    .controller('eventRegisterCtrl', function ($scope) {

    })

    .controller('helpDetailsCtrl', function ($scope) {

    })

    .controller('settingDetailsCtrl', function ($scope) {

    })
 