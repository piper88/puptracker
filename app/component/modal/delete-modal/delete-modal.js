'use strict';

module.exports = {
  template: require('./delete-modal.html'),
  controller: ['$log', '$location', 'projectService', 'lineService', 'cageService', DeleteModalController],
  controllerAs: 'deleteModalCtrl',
  bindings: {
    modalInstance: '<',
    resolve: '<',
  },
};

function DeleteModalController($log, $location, projectService, lineService, cageService){
  $log.debug('init modalCtrl');

  // What will show up when modal is opened
  this.$onInit = function(){
    this.deleteToggle = this.resolve.deleteToggle;
  };

  // resolve.deleteData = project._id
  this.deleteProject = function(){
    projectService.deleteProject(this.resolve.deleteData._id)
    .then(() => {
      this.modalInstance.close();
    });
  };

  // resolve.deleteData = line._id
  this.deleteLine = function(){
    lineService.deleteLine(this.resolve.deleteData._id, this.resolve.deleteData.projectId)
    .then(() => {
      this.modalInstance.close();
    });
  };

  // resolve.deleteData = cage._id
  this.deleteCage = function(){
    cageService.deleteCage(this.resolve.deleteData._id, this.resolve.deleteData.lineId)
    .then(() => {
      this.modalInstance.close();
    });
  };

  this.handleClose = function() {
    this.modalInstance.close();
  };
}
