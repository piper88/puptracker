'use strict';

module.exports = {
  template: require('./delete-line-modal.html'),
  controller: ['$log', '$location', 'lineService', DeleteLineModalController],
  controllerAs: 'deleteLineModalCtrl',
  bindings: {
    modalInstance: '<',
    resolve: '<',
  },
};

function DeleteLineModalController($log, $location, lineService){
  $log.debug('init deleteLine modalCtrl');

  this.deleteLine = function(){
    lineService.deleteLine(this.resolve.deleteLine)
    .then(() => {
      this.modalInstance.close();
    });
  };

  // Close modal when cancel button is clicked
  this.handleClose = function() {
    this.modalInstance.close();
  };
}
