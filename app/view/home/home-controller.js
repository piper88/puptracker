'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', '$rootScope','projectService', 'lineService', 'cageService', 'mouseService', HomeController];

function HomeController($log, $location, $rootScope, projectService, lineService, cageService, mouseService){
  $log.debug('init homeCtrl');

  this.projects = [];
  this.lines = [];
  this.cages = [];

  this.status = {
    isopen1:false,
    isopen2: false,
    isopen3: false,
  };

  //Fetch projects initially
  this.fetchProjects = function(){
    projectService.fetchProjects()
    .then( projects => {
      this.projects = projects;
      $log.debug('Succesfully found projects');
    });
  };

  // When project is selected, fetch all its lines
  this.fetchProjectLines = function(project){
    $log.debug('fetched current project');
    this.currentProject = project;
    return lineService.fetchLines(this.currentProject._id)
    .then(lines => {
      this.currentProject.lines = lines;
    });
  };

  // When line is selected, fetch all its cages
  this.fetchLineCages = function(line){
    $log.debug('fetched current line');
    this.currentLine = line;
    return cageService.fetchCages(this.currentLine._id)
    .then(cages => {
      $log.debug('currentLine', this.currentLine);
      this.currentLine.cages = cages;
    });
  };

  this.fetchMice = function() {
    $log.debug('homeCtrl.fetchMice');
    if(!this.currentProject) return;
    if(!this.currentLine) return;
    if(!this.currentCage) return;

    return mouseService.fetchMice(this.currentCage._id)
    .then(mice => {
      this.mice = mice;
      this.currentCage.mice = mice;
    });
  };

  //Fetch all projects on page load
  this.fetchProjects();

  this.deleteProject = function() {
    projectService.deleteProject(this.currentProject._id);
    $log.debug('Successfully deleted project!');
  };
}
