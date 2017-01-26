'use strict';

// require('./_calendar.scss');

module.exports = {
  template: require('./calendar.html'),
  controller: ['$log', CalendarController],
  controllerAs: 'CalendarCtrl',
};

function CalendarController($log){
  $log.debug('init CalendarCtrl');


}
