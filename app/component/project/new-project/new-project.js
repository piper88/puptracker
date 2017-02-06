'use strict';

module.exports = {
  template: require('./new-project.html'),
  controller: ['$log', '$http', 'projectService', NewProjectController],
  controllerAs: 'newProjectCtrl',
};

function NewProjectController($log, $http, projectService){
  $log.debug('init newProjectCtrl');

  this.project = {};

  this.createNewProject = function() {
    projectService.createProject(this.project)
    .then(() => {
      // on success, nulls out inputs so it doesn't repeat the old data
      // ng-model is using it, so they stay in there
      this.project.name = null;
    });
  };
}
