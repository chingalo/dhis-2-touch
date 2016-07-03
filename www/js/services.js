angular.module('app.services', [])
    .factory('appFactory', ['$q',function ($q) {
        var appFactory = {
            getFormattedUrl : function(url){
                var defer = $q.defer();
                if(url != undefined){
                    defer.resolve(url);
                }else{
                    defer.reject()
                }
                return defer.promise;
            }
        };
        return appFactory;
    }])
    .factory('userFactory', ['$q', '$localStorage', function ($q, $localStorage) {
        var emptyUser = {username: '', password: '', isLogin: false};
        var userFactory = {
            setCurrentUser: function (user) {
                var defer = $q.defer();
                if (angular.isDefined(user.name) && angular.isDefined(user.password)) {
                    $localStorage.currentUser.isLogin = true;
                    $localStorage.currentUser.username = user.username;
                    $localStorage.currentUser.password = user.password;
                }
                defer.resolve();
                //defer.reject();
                return defer.promise;

            },
            setEmptyUser: function () {
                var defer = $q.defer();
                if (!angular.isDefined($localStorage.currentUser)) {
                    $localStorage.currentUser = emptyUser;
                }
                defer.resolve();
                //defer.reject();
                return defer.promise;
            },
            getCurrentLoginUser: function (){
                var currentUser = $localStorage.currentUser;
                var defer = $q.defer();
                defer.resolve(currentUser);
                //defer.reject();
                return defer.promise;
            }

        };

        return userFactory;

    }])

    .factory('blankFactory', ['$q',function ($q) {

    }])
    .factory('blankFactory', ['$q',function ($q) {

    }])
    .service('BlankService', [function () {

    }]);

