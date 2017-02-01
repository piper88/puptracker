'use strict';

module.exports = {
  template: require('./edit-project.html'),
  controller: ['$log', 'projectService', EditProjectController],
  controllerAs: 'editprojectCtrl',
  bindings: {
    project: '<',
  },
};

function EditProjectController($log, projectService){
  $log.debug('init editprojectCtrl');

  this.updateProject = function(){
    projectService.updateProject(this.project);
  };
}
