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

  this.fetchProject = function(project){
    this.currentProject = project;
    $log.debug('the current project: ', this.currentProject);
    lineService.fetchLines(this.currentProject._id);
  };

  this.fetchLine = function(line){
    $log.debug('fetched current line');
    this.currentLine = line;
    $log.debug('the current line: ', this.currentLine);
    cageService.fetchCages(this.currentLine._id);
    // .then (cages =>{
    //   this.cages = cages;
    //   $log.debug('Succesfully found cages', cages);
    // });
  };
  this.fetchCage = function(cage){
    $log.debug('fetched current cage');
    this.currentCage = cage;
    $log.debug('the current cage: ', this.currentCage);
    // mouseService.fetchMice(this.currentCage._id);
  };

  this.fetchProjects = function(){
    projectService.fetchProjects()
    .then( projects => {
      this.projects = projects;
      $log.debug('Succesfully found projects', projects);
    });
  };

  // Called when a specific project is seleted
  this.fetchLines = function(){
    lineService.fetchLines(this.currentProject._id)
    .then( lines => {
      this.lines = lines;
      this.project.lines = lines;
      $log.debug('Succesfully found lines');
    });
  };

  // Called when a specific project is seleted
  this.fetchCages = function(){
    cageService.fetchCages(this.currentLine._id)
    .then( cages => {
      this.cages = cages;
      this.line.cages = cages;
      $log.debug('Succesfully found cages');
    });
  };

  //Fetch projects initially
  this.fetchProjects();

  this.deleteProject = function() {
    projectService.deleteProject(this.currentProject._id);
    $log.debug('Successfully deleted project!');
  };
}
