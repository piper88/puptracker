'use strict';

require('./_home.scss');

module.exports = ['$log', '$rootScope','projectService', HomeController];

function HomeController($log, $rootScope, projectService){
  $log.debug('init homeCtrl');

  this.currentProject;

  this.fetchProjects = function(){
    projectService.fetchProjects()
    .then( projects => {
      this.projects = projects;
      this.currentProject = projects[0];
      $log.debug('Succesfully found project');
    });
  };
  this.fetchProjects();

  $rootScope.$on('$locationChangeSuccess', () => {
    this.fetchProjects();
  });
}
