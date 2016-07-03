angular.module('app.services', [])
    .factory('appFactory', ['$q',function ($q) {
        var appFactory = {
            getFormattedBaseUrl : function(url){
                var defer = $q.defer();
                if(url != undefined){
                    var baseUrl = appFactory.getFormatUrl(url);
                    defer.resolve(baseUrl);
                }else{
                    defer.reject()
                }
                return defer.promise;
            },
            getFormatUrl :function(url){
                var urlToBeFormatted = '',newArray = [],formattedBaseUrl = null,baseUrlString = null;
                if(!((url.startsWith('https') || url.startsWith('http')))){
                    urlToBeFormatted = "http://"+url;
                }else{
                    if(!((url.startsWith('https://') || url.startsWith('http://')))){
                        urlToBeFormatted = url + "://";
                    }else{
                        urlToBeFormatted = url;
                    }
                }
                baseUrlString = urlToBeFormatted.split('/');
                for (var i = 0; i < baseUrlString.length; i++) {
                    if (baseUrlString[i]) {
                        newArray.push(baseUrlString[i]);
                    }
                }
                formattedBaseUrl = newArray[0] + '/';
                for (var j = 0; j < newArray.length; j++) {
                    if (j != 0) {
                        formattedBaseUrl = formattedBaseUrl + '/' + newArray[j];
                    }
                }
                return formattedBaseUrl;
            }
        };
        return appFactory;
    }])
    .factory('userFactory', ['$q', '$localStorage', function ($q, $localStorage) {
        var emptyUser = {username: '', password: '', isLogin: false,baseUrl : ''};
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

