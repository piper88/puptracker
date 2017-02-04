'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', '$rootScope','projectService', 'lineService', 'cageService', HomeController];

function HomeController($log, $location, $rootScope, projectService, lineService, cageService){
  $log.debug('init homeCtrl');

  this.projects = [];
  this.lines = [];
  this.cages = [];

  this.currentProject;
  this.currentLine;
  this.currentCage;

  this.status = {
    isopen1:false,
    isopen2: false,
    isopen3: false,
  };

  // Only show project and line information and create line when clicked on
  this.showCreateLine = false;
  this.showLineInfo = false;
  this.showProjectInfo = false;
  this.showEditProject = false;
  this.showCageInfo = false;

  this.showProject = function() {
    this.showProjectInfo = true;
  };

  this.showLine = function() {
    this.showLineInfo = true;
  };

  this.showCage = function() {
    this.showCageInfo = true;
  };

  this.currentLineCheck = function(){
    lineService.fetchLines(this.project._id);
  };

  // Close Edit Project on Submit
  this.handleEditProject = function(){
    this.showEditProject = false;
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
    this.currentProject = project;
    $log.debug('the current project: ', this.currentProject);
    return lineService.fetchLines(this.currentProject._id)
    .then(lines => {
      this.currentProject.lines = lines;
    });
  };

  // When line is selected, fetch all its cages
  this.fetchLineCages = function(line){
    $log.debug('fetched current line');
    this.currentLine = line;
    $log.debug('the current line: ', this.currentLine);
    return cageService.fetchCages(this.currentLine._id)
    .then(cages => {
      this.currentLine.cages = cages;
    });
  };

  //When Cage is selected, fetch all its mice
  this.fetchCageBreeders = function(cage){
    $log.debug('fetched current cage');
    this.currentCage = cage;
    $log.debug('the current cage: ', this.currentCage);
    // mouseService.fetchMice(this.currentCage._id);
  };


  this.fetchProjects();

  this.deleteProject = function() {
    projectService.deleteProject(this.currentProject._id);
    $log.debug('Successfully deleted project!');
  };
}
