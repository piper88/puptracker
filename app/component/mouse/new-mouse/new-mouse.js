'use strict';

module.exports = {
  template: require('./new-mouse.html'),
  controller: ['$log', '$http', '$scope', '$rootScope', 'mouseService', NewMouseController],
  controllerAs: 'newMouseCtrl',
  bindings: {
    cage: '<',
    updateSuccess: '&',
  },
};

function NewMouseController($log, $http, $scope, $rootScope, mouseService){
  $log.debug('init newMouseCtrl');

  $scope.status = {
    isOpen: false,
  };

  this.mouse = {};

//the method that runs on submit
  this.createNewMouse = function() {
    $log.debug('init createNewMouse()');
    $log.debug('the mouse right before it goes to the service to be created', this.mouse);
    mouseService.createMouse(this.cage._id, this.mouse)
    .then( mousey => {
      this.mouse = mousey;
      $log.debug('the geneticMakeup of the mouse just created', mousey.geneticMakeup[0]);
      this.mouse.name = null;
      this.updateSuccess();
    });
  };

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true,
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    minMode: 'day',
    startingDay: 1,
  };

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open5 = function() {
    $scope.popup5.opened = true;
  };


  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];
  $scope.altInputFormats = ['M!/d!/yyyy'];

  $scope.popup5 = {
    opened: false,
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full',
    },
    {
      date: afterTomorrow,
      status: 'partially',
    },
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }
    return '';
  }
}
