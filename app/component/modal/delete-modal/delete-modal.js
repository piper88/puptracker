'use strict';

module.exports = {
  template: require('./delete-modal.html'),
  controller: ['$log', '$location', 'projectService', DeleteModalController],
  controllerAs: 'deleteModalCtrl',
  bindings: {
    modalInstance: '<',
    resolve: '<',
  },
};

function DeleteModalController($log, $location, projectService){
  $log.debug('init modalCtrl');

  this.deleteProject = function(){
    projectService.deleteProject(this.resolve.deleteProject)
    .then(() => {
      this.modalInstance.close();
    });
  };

  // Close modal when cancel button is clicked
  this.handleClose = function() {
    this.modalInstance.close();
  };
}
