'use strict';

module.exports = {
  template: require('./edit-project.html'),
  controller: ['$log', 'projectService', EditProjectController],
  controllerAs: 'editProjectCtrl',
  bindings: {
    project: '<',
    onUpdate: '&',
  },
};

function EditProjectController($log, projectService){
  $log.debug('init editprojectCtrl');

  this.updateProject = function(){
    $log.debug('init updateProject()');
    projectService.updateProject(this.project);
  };
}
