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

  // need project id
  this.deleteProject = function(){
    projectService.deleteProject(this.resolve.deleteData._id)
    .then(() => {
      this.modalInstance.close();
    });
  };

  // need project and line id
  this.deleteLine = function(){
    lineService.deleteLine(this.resolve.deleteData.project, this.resolve.deleteData._id)
    .then(() => {
      this.modalInstance.close();
    });
  };

  // need line and cage id
  this.deleteCage = function(){
    cageService.deletecage(this.resolve.deleteData.line, this.resolve.deleteData._id)
    .then(() => {
      this.modalInstance.close();
    });
  };

  this.handleClose = function() {
    this.modalInstance.close();
  };
}
