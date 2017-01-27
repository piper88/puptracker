'use strict';

require('./_home.scss');

module.exports = ['$log', '$rootScope', 'projectService', 'lineService', HomeController];

function HomeController($log, $rootScope, projectService){
  $log.debug('init homeCtrl');

  this.project;
  this.currentProject;
  this.projects = [];

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
