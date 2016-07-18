angular.module('app.services', [])

    .factory('appFactory', ['$q', 'Base64', '$http','$localStorage', function ($q, Base64, $http,$localStorage) {
        var appFactory = {
            getFormattedBaseUrl: function (url) {
                var defer = $q.defer();
                if (url != undefined) {
                    var baseUrl = appFactory.getFormatUrl(url);
                    defer.resolve(baseUrl);
                } else {
                    defer.reject()
                }
                return defer.promise;
            },
            getFormatUrl: function (url) {
                var urlToBeFormatted = '', newArray = [], formattedBaseUrl = null, baseUrlString = null;
                if (!(url.split('/')[0] == "https:" || url.split('/')[0] == "http:")) {
                    urlToBeFormatted =  "http://" + url;
                } else {
                    urlToBeFormatted = url;
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
            },
            getDataBaseName : function(){
                var defer = $q.defer();
                var databaseName = $localStorage.app.baseUrl;
                databaseName = databaseName.replace('://','_').replace('/','_').replace('.','_').replace(':','_');
                defer.resolve(databaseName + '.db');
                return defer.promise;
            },
            setAuthorizationOnHeader: function (user) {
                 var defer = $q.defer();
                $http.defaults.headers.common.Authorization = 'Basic ' + Base64.encode(user.username + ':' + user.password);
                defer.resolve();
                return defer.promise;
            }
        };
        return appFactory;
    }])

    .factory('userFactory', ['$q', '$localStorage','$http', function ($q, $localStorage,$http) {
        var emptyUser = {username: '', password: '', isLogin: false};
        var userFactory = {
            authenticateUser: function () {
                var defer = $q.defer();
                var fields = "fields=[:all],userCredentials[userRoles[name,dataSets[id,name]]";
                $http.get($localStorage.app.baseUrl + '/api/me.json?'+fields).then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    defer.reject(error.status);
                });
                return defer.promise;
            },
            setCurrentUser: function (user,userData) {
                var defer = $q.defer();
                if (angular.isDefined(user.username) && angular.isDefined(user.password)) {
                    $localStorage.app.user = user;
                }
                if (angular.isDefined(userData)) {
                    $localStorage.app.userData = {
                        "Name": userData.name,
                        "Employer": userData.employer,
                        "Job Title": userData.jobTitle,
                        "Education": userData.education,
                        "Gender": userData.gender,
                        "Birthday" : userData.birthday,
                        "Nationality": userData.nationality,
                        "Interests": userData.interests,
                        "userRoles" : userData.userCredentials.userRoles,
                        "organisationUnits" : userData.organisationUnits
                    };
                }
                defer.resolve();
                return defer.promise;

            },
            setEmptyUser: function () {
                var defer = $q.defer();
                if (!angular.isDefined($localStorage.app)) {
                    $localStorage.app.user= emptyUser;
                }
                defer.resolve(emptyUser);
                //defer.reject();
                return defer.promise;
            },
            getCurrentLoginUser: function () {
                var currentUser = $localStorage.app.user;
                var defer = $q.defer();
                defer.resolve(currentUser);
                return defer.promise;
            },
            getCurrentLoginUserUserdata : function(){
                var currentUserData = $localStorage.app.userData;
                var defer = $q.defer();
                defer.resolve(currentUserData);
                return defer.promise;
            }
        };

        return userFactory;

    }])
    .factory('Base64', function () {
        /* jshint ignore:start */

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },

            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };

        /* jshint ignore:end */
    })

    .factory('sqlLiteFactory', ['$q','$cordovaSQLite', function ($q,$cordovaSQLite) {
        var db = null;
        var sqlLiteFactory = {
            openDatabase : function(databaseName){
                var defer = $q.defer();
                if (window.cordova) {
                    console.log('Before database creation Android');
                    db = $cordovaSQLite.openDB({name: databaseName, location: 'default'}); //device
                    console.log('after database creation Android');
                } else {
                    var databaseNameArray = databaseName.split('.');
                    console.log('Before database creation browser');
                    db = window.openDatabase(databaseName, '1', databaseNameArray[0], 1024 * 1024 * 10000); // browser
                    console.log('After database creation browser');
                }
                defer.resolve();
                return defer.promise;
            }
        };
        return sqlLiteFactory;

    }])

    .factory('systemFactory', ['$q','$http','$localStorage', function ($q,$http,$localStorage) {
        var systemFactory = {
            getDhis2InstanceSystemInfo : function(){
                var defer = $q.defer();
                $http.get($localStorage.app.baseUrl + '/api/system/info').then(function(response){
                    defer.resolve(response.data);
                },function(error){
                    console.log('error',error);
                    defer.reject(error.status);
                });
                return defer.promise;
            }
        };
        return systemFactory;
    }])

    .factory('blankFactory', ['$q', function ($q) {

    }])

    .service('BlankService', [function () {

    }]);

