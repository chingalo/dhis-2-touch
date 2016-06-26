angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('tabsController.apps', {
    url: '/apps',
    views: {
      'tab1': {
        templateUrl: 'templates/apps.html',
        controller: 'appsCtrl'
      }
    }
  })

  .state('tabsController.account', {
    url: '/account',
    views: {
      'tab2': {
        templateUrl: 'templates/account.html',
        controller: 'accountCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tabsController.help', {
    url: '/help',
    views: {
      'tab2': {
        templateUrl: 'templates/help.html',
        controller: 'helpCtrl'
      }
    }
  })

  .state('tabsController.dataEntry', {
    url: '/data-entry-selection',
    views: {
      'tab1': {
        templateUrl: 'templates/dataEntry.html',
        controller: 'dataEntryCtrl'
      }
    }
  })

  .state('tabsController.profile', {
    url: '/profile',
    views: {
      'tab2': {
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      }
    }
  })

  .state('tabsController.about', {
    url: '/about',
    views: {
      'tab2': {
        templateUrl: 'templates/about.html',
        controller: 'aboutCtrl'
      }
    }
  })

  .state('tabsController.settings', {
    url: '/settings',
    views: {
      'tab2': {
        templateUrl: 'templates/settings.html',
        controller: 'settingsCtrl'
      }
    }
  })

  .state('tabsController.dashBoard', {
    url: '/dashboard',
    views: {
      'tab1': {
        templateUrl: 'templates/dashBoard.html',
        controller: 'dashBoardCtrl'
      }
    }
  })

  .state('tabsController.trackerCapture', {
    url: '/tracker-capture',
    views: {
      'tab1': {
        templateUrl: 'templates/trackerCapture.html',
        controller: 'trackerCaptureCtrl'
      }
    }
  })

  .state('tabsController.reportList', {
    url: '/report-list',
    views: {
      'tab1': {
        templateUrl: 'templates/reportList.html',
        controller: 'reportListCtrl'
      }
    }
  })

  .state('tabsController.eventCapture', {
    url: '/event-capture',
    views: {
      'tab1': {
        templateUrl: 'templates/eventCapture.html',
        controller: 'eventCaptureCtrl'
      }
    }
  })

  .state('tabsController.reportParameterSelection', {
    url: '/report-parameter-selection',
    views: {
      'tab1': {
        templateUrl: 'templates/reportParameterSelection.html',
        controller: 'reportParameterSelectionCtrl'
      }
    }
  })

  .state('tabsController.reportView', {
    url: '/report-view',
    views: {
      'tab1': {
        templateUrl: 'templates/reportView.html',
        controller: 'reportViewCtrl'
      }
    }
  })

  .state('tabsController.dataEntryForm', {
    url: '/data-entry-form',
    views: {
      'tab1': {
        templateUrl: 'templates/dataEntryForm.html',
        controller: 'dataEntryFormCtrl'
      }
    }
  })

  .state('tabsController.eventRegister', {
    url: '/event-register',
    views: {
      'tab1': {
        templateUrl: 'templates/eventRegister.html',
        controller: 'eventRegisterCtrl'
      }
    }
  })

  .state('tabsController.helpDetails', {
    url: '/help-details',
    views: {
      'tab2': {
        templateUrl: 'templates/helpDetails.html',
        controller: 'helpDetailsCtrl'
      }
    }
  })

  .state('tabsController.settingDetails', {
    url: '/setting-details',
    views: {
      'tab2': {
        templateUrl: 'templates/settingDetails.html',
        controller: 'settingDetailsCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/login')

  

});