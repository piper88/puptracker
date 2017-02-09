'use strict';

module.exports = {
  template: require('./edit-modal.html'),
  controller: ['$log', EditModalController],
  controllerAs: 'editModalCtrl',
  bindings: {
    modalInstance: '<',
    resolve: '<',
    updateSuccess: '&',
  },
};

function EditModalController($log){
  $log.debug('init editModalCtrl');

 // What will show up when modal is opened
  this.$onInit = function(){
    this.editToggle = this.resolve.editToggle;
    this.editData = this.resolve.editData;
  };

  // Close modal when cancel button is clicked
  this.handleClose = function() {
    this.modalInstance.close();
  };

}
