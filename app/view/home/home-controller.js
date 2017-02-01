'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', '$rootScope','projectService', 'lineService', 'cageService', HomeController];

function HomeController($log, $location, $rootScope, projectService, lineService, cageService){
  $log.debug('init homeCtrl');

  this.lines = [];
  this.projects = [];
  this.currentProject;
  this.currentLine;
  this.cages = [];

  this.status = {
    isopen1:false,
    isopen2: false,
  };

  // Only show project and line information and create line when clicked on
  this.showCreateLine = false;
  this.showLineInfo = false;
  this.showProjectInfo = false;

  this.showCreateCage = false;
  this.showCageInfo = false;
  this.showEditProject = false;

  this.showProject = function() {
    this.showProjectInfo = true;
  };

  this.showCageForm = function() {
    this.showCreateCage = true;
  };

  this.showCage = function() {
    this.showCageInfo = true;
  };

  this.showLine = function() {
    this.showLineInfo = true;
  };

  this.currentLineCheck = function(){
    lineService.fetchLines(this.project._id);
  };

  // Close Edit Project on Submit
  this.handleEditProject = function(){
    this.showEditProject = false;
  };

  this.fetchProject = function(project){
    this.currentProject = project;
    console.log('the current project', this.currentProject);
    lineService.fetchLines(this.currentProject._id);
  };

  this.fetchLine = function(line){
    this.currentLine = line;
    console.log('the current line in home controller', this.currentLine);
    console.log('the current project in home controller', this.currentProject);
    cageService.fetchCages(this.currentLine)
    .then(cages => {
      $log.debug('The cages in the fetchLine() on homeCtrl', cages);
      this.cages = cages.cages;
    });
  };

  this.fetchProjects = function(){
    console.log('THIS SHOULD HAPPEN EVERYTIME I SELECT A PROJECT');
    projectService.fetchProjects()
    .then( projects => {
      this.projects = projects;
      // this.currentProject = projects[0];
      $log.debug('Succesfully found projects', projects);
    });
  };

  this.fetchLines = function(){
    lineService.fetchLines(this.currentProject._id)
    .then( lines => {
      this.lines = lines;
      this.project.lines = lines;
      $log.debug('Succesfully found lines');
    });
  };

  this.fetchProjects();

  this.deleteProject = function() {
    projectService.deleteProject(this.currentProject._id);
    $log.debug('Successfully deleted project!');
  };
}
