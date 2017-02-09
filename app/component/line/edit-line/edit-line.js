'use strict';

module.exports = {
  template: require('./edit-line.html'),
  controller: ['$log', '$location', 'lineService', EditLineController],
  controllerAs: 'editLineCtrl',
  bindings: {
    line: '<',
    project: '<',
    updateSuccess: '&',
  },
};

function EditLineController($log, $location, lineService){
  $log.debug('init editLineCtrl');

  this.updateLine = function(){
    lineService.updateLine(this.project, this.line)
    .then(() => {
      $location.url('/home');
      this.updateSuccess();
    });
  };
}
