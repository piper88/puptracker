'use strict';

require('./_project-li.scss');

module.exports = {
  template: require('./project-li.html'),
  controller: ['$log', ProjectLIController],
  controllerAs: 'projectLICtrl',
  bindings: {
    project: '<',
  },
};

function ProjectLIController($log){
  $log.debug('init projectLICtrl');
}
