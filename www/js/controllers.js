angular.module('app.controllers', [])

    .controller('mainCtrl', function ($scope, userFactory,$localStorage) {

        //object for controller
        $scope.data = {
            loaderState : false
        };

        //checking if local storage has been initiate
        if(angular.isUndefined($localStorage.app)){
            $localStorage.app = {
                user : {}
            }
        }

        /***
         * create user object
         */
        userFactory.setEmptyUser().then(function () {});

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
        if(angular.isDefined($localStorage.app.baseUrl)){
            $scope.data.baseUrl = $localStorage.app.baseUrl;
        }

        //onclick login button
        $scope.onClickLoginButton = function(){
            var baseUrl = $scope.data.baseUrl;
            appFactory.getFormattedBaseUrl(baseUrl).then(function(formattedUrl){
                Notification.clearAll();
                $localStorage.app.baseUrl = formattedUrl;
                if(hasUsernameAndPasswordEntered()){
                    appFactory.setAuthorizationOnHeader($scope.data.user).then(function(){
                        userFactory.authenticateUser($scope.data.user).then(function(userData){
                            console.log(JSON.stringify(userData));
                            userFactory.setCurrentUser($scope.data.user).then(function(){
                                $state.go('tabsController.apps',{},{});
                            },function(){});
                        },function(errorStatus){
                            Notification.error('Fail : ' + errorStatus);
                        })
                    });
                }
            },function(){
                Notification('Please enter server url');
            });
        };

        function hasUsernameAndPasswordEntered(){
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
 