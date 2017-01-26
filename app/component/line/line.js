'use strict';

require('./_line.scss');

module.exports = {
  template: require('./line.html'),
  controller: ['$log', LineController],
  controllerAs: 'LineCtrl',
  bindings: {
    listing: '<',
    deleteListingCheck: '&',
    gallery: '<',
  },
};

function LineController($log){
  $log.debug('init LineCtrl');


}
