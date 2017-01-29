'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', '$rootScope','projectService', 'lineService', 'authService', HomeController];

function HomeController($log, $location, $rootScope, projectService, lineService){
  $log.debug('init homeCtrl');

  this.lines = [];
  this.projects = [];
  this.currentProject;

  this.currentLineCheck = function(){
    lineService.fetchLines(this.project._id);
  };

  this.setCurrent = function(item) {
    this.currentProject = item;
  };

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
