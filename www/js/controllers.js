angular.module('app.controllers', [])

    .controller('mainCtrl', function ($scope, userFactory, $timeout,
                                      Notification, $ionicLoading,
                                      $localStorage, $ionicHistory
        , $state) {

        //object for controller
        $scope.data = {
            username: ""
        };

        //checking if local storage has been initiate
        if (angular.isUndefined($localStorage.app)) {
            $localStorage.app = {
                user: {},
                userData: {},
                systemInformation: {}
            }
        }

        /***
         * create user object
         */
        userFactory.setEmptyUser().then(function () {
        });

        /**
         * onClickLogOutButton
         */
        $scope.onClickLogOutButton = function () {
            //reset user properties
            $localStorage.app.user.isLogin = !$localStorage.app.user.isLogin;
            delete $localStorage.app.userData;

            $state.go('login', {}, {});
            $timeout(function () {
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                Notification('You have successfully log out');
            }, 300);
        };

        /**
         * before a view has not been rendered
         */
        $scope.$on("$ionicView.beforeLeave", function (event, data) {
            // handle before view has been leave
            $ionicLoading.show({
                template: 'Please waiting'
            });
        });

        /**
         * after view has been render
         */
        $scope.$on("$ionicView.afterEnter", function (event, data) {
            //handling after view has been entered
            $ionicLoading.hide();
            if (angular.isDefined($localStorage.app.userData)) {
                if ($localStorage.app.userData.Name) {
                    var nameArray = $localStorage.app.userData.Name.split(' ');
                    if (nameArray[0]) {
                        $scope.data.username = nameArray[0];
                    }
                }
            }
        });

    })

    .controller('appsCtrl', function ($scope) {

    })

    .controller('accountCtrl', function ($scope) {

    })

    .controller('loginCtrl', function ($scope, appFactory, $q,
                                       userFactory, Notification, systemFactory,
                                       $localStorage, sqlLiteFactory,
                                       $state) {

        //variable declarations
        $scope.data = {
            user: {}
        };
        if (angular.isDefined($localStorage.app.baseUrl)) {
            $scope.data.baseUrl = $localStorage.app.baseUrl;
        }

        reAuthenticatedCurrentUser();
        //@todo re-open database and checking of completed download all data
        function reAuthenticatedCurrentUser() {
            userFactory.getCurrentLoginUser().then(function (user) {
                if (user.isLogin) {
                    appFactory.setAuthorizationOnHeader(user).then(function () {
                        $state.go('tabsController.apps', {}, {});
                    });
                }
            }, function () {
            });
        }

        /**
         * onClickLoginButton
         */
            //@todo open database using base url and loading data to offline storage
        $scope.onClickLoginButton = function () {
            var baseUrl = $scope.data.baseUrl;
            appFactory.getFormattedBaseUrl(baseUrl).then(function (formattedUrl) {
                Notification.clearAll();
                $localStorage.app.baseUrl = formattedUrl;
                if (hasUsernameAndPasswordEntered()) {
                    //set authorization header
                    appFactory.setAuthorizationOnHeader($scope.data.user).then(function () {
                        //authenticate user
                        userFactory.authenticateUser($scope.data.user).then(function (userData) {
                            //setCurrent login user
                            userFactory.setCurrentUser($scope.data.user, userData).then(function () {
                                //getting database name
                                appFactory.getDataBaseName().then(function (databaseName) {
                                    $localStorage.app.baseBaseName = databaseName;
                                    //@todo populate all tables for a given database
                                    var promises = [];
                                    //table as value , tableName as key
                                    angular.forEach(sqlLiteFactory.getDataBaseStructure(), function (table, tableName) {
                                        promises.push(
                                            sqlLiteFactory.createTable(tableName, table.fields).then(function () {

                                            }, function () {
                                            })
                                        );
                                    });
                                    $q.all(promises).then(function () {
                                        //getting dhis 2 instance system information
                                        systemFactory.getDhis2InstanceSystemInfo().then(function (data) {
                                            $localStorage.app.systemInformation = data;
                                            downloadOrganisationUnitsData(userData.organisationUnits);
                                        }, function () {
                                            //error on getting system information
                                            Notification.error('Fail to load System information, please checking your network connection');
                                        });
                                    }, function () {
                                        //error on prepare database
                                        Notification('Fail to prepare database');
                                    });
                                }, function () {
                                });

                            }, function () {
                            });
                        }, function (errorStatus) {
                            if (errorStatus == 401) {
                                //unauthorized access
                                var message = 'Fail to login, please check your username or password';
                                Notification.error(message);
                            } else {
                                //has fail to connect to server
                                var message = 'Fail to connect to the server, please check server URL or Network connection';
                                Notification(message);
                            }
                        });
                    });
                }
            }, function () {
                var message = "'Please enter server url'";
                Notification(message);
            });
        };

        /**
         * downloadOrganisationUnitsData
         * @param organisationUnits
         */
        function downloadOrganisationUnitsData(organisationUnits) {
            var dataBaseStructure = sqlLiteFactory.getDataBaseStructure();
            var promises = [];
            var orgUnitId = null, fields = null, resource = "organisationUnits";
            if (organisationUnits.length > 0) {
                var organisationUnitsData = [];
                organisationUnits.forEach(function (organisationUnit) {
                    if (organisationUnit.id) {
                        orgUnitId = organisationUnit.id;
                        fields = "id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name],dataSets[id],level,children[id,name,ancestors[id,name]]]]]]";
                    }
                    promises.push(
                        systemFactory.downloadMetadata(resource, orgUnitId, fields).then(function (orgUnitData) {
                            //success on downloading
                            organisationUnitsData.push(orgUnitData);
                        }, function () {
                            //error on downloading
                        })
                    );
                });
                $q.all(promises).then(function () {
                    //saving org units
                    var promises = [];
                    organisationUnitsData.forEach(function (data) {
                        promises.push(
                            sqlLiteFactory.insertDataOnTable(resource, dataBaseStructure[resource].fields, data).then(function () {
                            }, function () {
                            })
                        );
                    });
                    $q.all(promises).then(function () {
                        $localStorage.app.user.isLogin = true;
                        $state.go('tabsController.apps', {}, {});
                    }, function () {
                        Notification('Fail to save assigned organisation units data');
                    });

                }, function () {
                    Notification('Fail to download assigned organisation units data');
                });
            } else {
                Notification('You have not been assigned to any organisation Units');
            }

        }

        /**
         * hasUsernameAndPasswordEntered
         * @returns {boolean}
         */
        function hasUsernameAndPasswordEntered() {
            var result = true;
            if ($scope.data.user.username == undefined) {
                Notification('Please Enter Username');
                result = false;
            } else {
                if ($scope.data.user.password == undefined) {
                    Notification('Please Enter Password');
                    result = false;
                }
            }
            return result;
        }

    })

    .controller('helpCtrl', function ($scope) {

    })

    .controller('dataEntryCtrl', function ($scope, $localStorage, sqlLiteFactory, organisationUnitFactory) {

        //object for data entry selection screen
        $scope.data = {
            isLoadingData: false,
            sortedOrganisationUnits: []
        };

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            getUserAssignedOrgUnits();
        });

        /**
         * getUserAssignedOrgUnits
         */
        function getUserAssignedOrgUnits() {
            $scope.data.isLoadingData = true;
            var resource = "organisationUnits", dataBaseStructure = sqlLiteFactory.getDataBaseStructure();
            var ids = [];
            $localStorage.app.userData.organisationUnits.forEach(function (organisationUnit) {
                ids.push(organisationUnit.id);
            });
            sqlLiteFactory.getDataFromTableByAttributes(resource, dataBaseStructure[resource].fields, "id", ids).then(function (assignedOrgUnits) {
                organisationUnitFactory.getSortedOrganisationUnits(assignedOrgUnits).then(function (sortedOrganisationUnits) {
                    $scope.data.sortedOrganisationUnits = sortedOrganisationUnits;
                    $scope.data.isLoadingData = false;
                });
            }, function () {
                //fail to get org units from local storage
                Notation('Fail to get assigned organisation units for local storage ');
            });
        }
    })

    .controller('profileCtrl', function ($scope, userFactory) {

        //object for profile controller
        $scope.data = {
            userInformation: {},
            userRoles: [],
            organisationUnits: [],
            assignedForms: []
        };

        //waiting for view to be render to pull data form storage
        $scope.$on("$ionicView.afterEnter", function (event, data) {
            //getting user data for profile view from local storage
            userFactory.getCurrentLoginUserUserdata().then(function (userData) {
                //prepare data for profile view
                $scope.data.userInformation = getUserInformation(userData);
                $scope.data.userRoles = getUserRoles(userData.userRoles);
                $scope.data.assignedOrgnisationUnits = userData.organisationUnits;
                $scope.data.assignedForms = getAssignedFormsList(userData.userRoles);
            }, function () {
            })
        });

        function getUserInformation(userData) {
            var userInformation = {};
            for (var key in userData) {
                if (key != "userRoles" && key != "organisationUnits") {
                    userInformation[key] = userData[key];
                }
            }
            return userInformation;
        }

        /**
         * getUserRoles
         * @param userRolesWithForms
         * @returns {Array}
         */
        function getUserRoles(userRolesWithForms) {
            var userRoles = [];
            userRolesWithForms.forEach(function (userRolesWithForm) {
                userRoles.push(userRolesWithForm.name);
            });
            return userRoles;
        }

        /**
         * getAssignedFormsList
         * @param userRolesWithForms
         * @returns {Array}
         */
        function getAssignedFormsList(userRoles) {
            var assignedFormsList = [];
            userRoles.forEach(function (userRole) {
                if (userRole.dataSets) {
                    userRole.dataSets.forEach(function (dataSet) {
                        if (shouldAddFormIntoAssigenedFormList(assignedFormsList, dataSet)) {
                            assignedFormsList.push(dataSet);
                        }
                    })
                }
            });
            return assignedFormsList;
        }

        /**
         * shouldAddFormIntoAssigenedFormList
         * @param assignedFormsList
         * @param form
         * @returns {boolean}
         */
        function shouldAddFormIntoAssigenedFormList(assignedFormsList, form) {
            var shouldAdd = true;
            assignedFormsList.forEach(function (assignedForm) {
                if (assignedForm.id == form.id) {
                    shouldAdd = false;
                }
            });
            return shouldAdd;
        }

    })

    .controller('aboutCtrl', function ($scope, $localStorage) {

        //object for about controller
        $scope.data = {
            appInformation: {
                Name: 'DHIS 2 Touch',
                Version: '1.01',
                'App revision': '3e8e302',
                'Release status': 'Snapshot'
                //'Release' 'Snapshot'
            },
            systemInformation: {},
            storageStatus: {
                dataValues: {
                    synced: {
                        value: 0
                    },
                    unSynced: {
                        value: 0
                    }
                },
                events: {
                    synced: {
                        value: 0
                    },
                    unSynced: {
                        value: 0
                    }
                },
                metaData: {}
            }
        };


        /**
         * getSystemInfoName
         * @param key
         * @returns {string}
         */
        $scope.getSystemInfoName = function (key) {
            return (key.charAt(0).toUpperCase() + key.slice(1)).replace(/([A-Z])/g, ' $1').trim();
        };

        /**
         * getSystemInformation
         */
        function getSystemInformation() {
            if (angular.isDefined($localStorage.app)) {
                $scope.data.systemInformation = $localStorage.app.systemInformation;
            }
        }

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            getSystemInformation();
        });
    })

    .controller('settingsCtrl', function ($scope) {
        $scope.$on("$ionicView.afterEnter", function (event, data) {
            console.log('setting view has been loaded successfully', data, event)
        });
    })

    .controller('dashBoardCtrl', function ($scope) {
        $scope.$on("$ionicView.afterEnter", function (event, data) {
            console.log('dashboard view has been loaded successfully', data, event)
        });
    })

    .controller('trackerCaptureCtrl', function ($scope) {
        $scope.$on("$ionicView.afterEnter", function (event, data) {
            console.log('tracker view has been loaded successfully', data, event)
        });

    })

    .controller('reportListCtrl', function ($scope) {

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            console.log("Populate report list")
        });
    })

    .controller('eventCaptureCtrl', function ($scope, $localStorage, sqlLiteFactory, organisationUnitFactory) {
        //object for data entry selection screen
        $scope.data = {
            isLoadingData: false,
            sortedOrganisationUnits: []
        };

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            getUserAssignedOrgUnits();
        });

        /**
         * getUserAssignedOrgUnits
         */
        function getUserAssignedOrgUnits() {
            $scope.data.isLoadingData = true;
            var resource = "organisationUnits", dataBaseStructure = sqlLiteFactory.getDataBaseStructure();
            var ids = [];
            $localStorage.app.userData.organisationUnits.forEach(function (organisationUnit) {
                ids.push(organisationUnit.id);
            });
            sqlLiteFactory.getDataFromTableByAttributes(resource, dataBaseStructure[resource].fields, "id", ids).then(function (assignedOrgUnits) {
                organisationUnitFactory.getSortedOrganisationUnits(assignedOrgUnits).then(function (sortedOrganisationUnits) {
                    $scope.data.sortedOrganisationUnits = sortedOrganisationUnits;
                    $scope.data.isLoadingData = false;
                });
            }, function () {
                //fail to get org units from local storage
                Notation('Fail to get assigned organisation units for local storage ');
            });
        }
    })

    .controller('reportParameterSelectionCtrl', function ($scope, $localStorage, sqlLiteFactory, organisationUnitFactory) {
        //object for data entry selection screen
        $scope.data = {
            isLoadingData: false,
            sortedOrganisationUnits: []
        };

        $scope.$on("$ionicView.afterEnter", function (event, data) {
            getUserAssignedOrgUnits();
        });

        /**
         * getUserAssignedOrgUnits
         */
        function getUserAssignedOrgUnits() {
            $scope.data.isLoadingData = true;
            var resource = "organisationUnits", dataBaseStructure = sqlLiteFactory.getDataBaseStructure();
            var ids = [];
            $localStorage.app.userData.organisationUnits.forEach(function (organisationUnit) {
                ids.push(organisationUnit.id);
            });
            sqlLiteFactory.getDataFromTableByAttributes(resource, dataBaseStructure[resource].fields, "id", ids).then(function (assignedOrgUnits) {
                organisationUnitFactory.getSortedOrganisationUnits(assignedOrgUnits).then(function (sortedOrganisationUnits) {
                    $scope.data.sortedOrganisationUnits = sortedOrganisationUnits;
                    $scope.data.isLoadingData = false;
                });
            }, function () {
                //fail to get org units from local storage
                Notation('Fail to get assigned organisation units for local storage ');
            });
        }
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

    });
 