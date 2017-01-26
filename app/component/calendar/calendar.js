'use strict';

// require('./_calendar.scss');

module.exports = {
  template: require('./calendar.html'),
  controller: ['$log', '$uiCalendarConfig', CalendarController],
  controllerAs: 'CalendarCtrl',
};

function CalendarController($log, $uiCalendarConfig){
  $log.debug('init CalendarCtrl');

  console.log($uiCalendarConfig);
}
