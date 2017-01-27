'use strict';

module.exports = {
  template: require('./new-project.html'),
  controller: ['$log', '$http', 'projectService', NewProjectController],
  controllerAs: 'newProjectCtrl',
  bindings: {
    submission: '&',
  },
};

function NewProjectController($log, $http, projectService){
  $log.debug('init newProjectCtrl');

  this.project = {};
  this.createNewProject = function() {
    $log.debug('init createNewproject()');
    projectService.createProject(this.project)
    .then(project => {
      $log.debug('created a new project');
      this.project = project;
      this.submission({
        projectData: this.project,
      });
    });
  };

}
