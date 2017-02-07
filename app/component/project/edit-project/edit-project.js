'use strict';

module.exports = {
  template: require('./edit-project.html'),
  controller: ['$log', '$location', 'projectService', EditProjectController],
  controllerAs: 'editProjectCtrl',
  bindings: {
    project: '<',
    updateSuccess: '&',
  },
};

function EditProjectController($log, $location, projectService){
  $log.debug('init editprojectCtrl');

  this.updateProject = function(){
    $log.debug('init updateProject()');
    projectService.updateProject(this.project)
    .then(() => {
      $location.url('/home');
      this.updateSuccess();
    });
  };
}
