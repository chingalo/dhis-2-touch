angular.module('app.services', [])
    .factory('appFactory', ['$q', 'Base64', '$http', function ($q, Base64, $http) {
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
            setAuthorizationOnHeader: function (user) {
                 var defer = $q.defer();
                $http.defaults.headers.common.Authorization = 'Basic ' + Base64.encode(user.username + ':' + user.password);
                defer.resolve();
                return defer.promise;
            }
        };
        return appFactory;
    }])
    .factory('userFactory', ['$q', '$localStorage','$http',
        '$httpParamSerializerJQLike', function ($q, $localStorage,$http,$httpParamSerializerJQLike) {
        var emptyUser = {username: '', password: '', isLogin: false, baseUrl: ''};
        var userFactory = {
            authenticateUser: function () {
                var defer = $q.defer();
                defer.resolve();
                //defer.reject();
                return defer.promise;
            },
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
            getCurrentLoginUser: function () {
                var currentUser = $localStorage.currentUser;
                var defer = $q.defer();
                defer.resolve(currentUser);
                //defer.reject();
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

    .factory('blankFactory', ['$q', function ($q) {

    }])
    .factory('blankFactory', ['$q', function ($q) {

    }])
    .service('BlankService', [function () {

    }]);

