'use strict';

require('./_home.scss');

module.exports = ['$log', '$location', '$rootScope', '$uibModal', 'projectService', 'lineService', 'cageService', 'mouseService', HomeController];

function HomeController($log, $location, $rootScope, $uibModal, projectService, lineService, cageService, mouseService){
  $log.debug('init homeCtrl');

  this.projects = [];
  this.lines = [];
  this.cages = [];

  this.status = {
    isopen1:false,
    isopen2: false,
    isopen3: false,
  };

  // Opens Delete Project Modal
  this.open = function(project) {
    let modalInstance = $uibModal.open({
      component: 'delete-modal',
      resolve: {
        deleteProject: function(){
          return project._id;
        },
      },
    });
    return modalInstance;
  };

  // Opens Delete Line Modal
  this.open2 = function(line) {
    let modalInstance = $uibModal.open({
      component: 'delete-line-modal',
      resolve: {
        deleteLine: function(){
          return line._id;
        },
      },
    });
    return modalInstance;
  };

  // Opens Edit Project, Line, Cage Modal
  this.open3 = function(itemToEdit, data) {
    let modalInstance = $uibModal.open({
      component: 'edit-modal',
      resolve: {
        editToggle: function(){
          return itemToEdit;
        },

        editData: function(){
          return data;
        },
      },
    });
    return modalInstance;
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
    $log.debug('currentCage', this.currentCage);
    this.calculate();
    return mouseService.fetchMice(this.currentCage._id)
    .then(mice => {
      this.mice = mice;
      this.currentCage.mice = mice;
    });
  };

  //Fetch all projects on page load
  this.fetchProjects();


  // this.deleteLine = function() {
  //   lineService.deleteLine(this.currentLine._id);
  //   $log.debug('Successfully deleted line!');
  // };

  this.deleteCage = function() {
    cageService.deleteCage(this.currentCage._id);
    $log.debug('Successfully deleted cage!');
  };

  this.calculate = function(){
      // Calculations
    let numFemales = this.currentCage.numberOfFemales;
    let d2 = this.currentCage.actualDOB;
    let d = this.currentCage.breedingStartDate;
    let date =  new Date(d);
    let date2 = new Date(d2);
    date.setDate(date.getDate() + 22);
    date.toDateString();
    date2.toDateString();
    let expectedDOB = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
    let actualDOB = (date2.getMonth()+1) + '/' + date2.getDate() + '/' + date2.getFullYear();


    let litterSize = 6;
    let usablePercent = .25;

    this.expectedTotalPups = litterSize * numFemales;
    this.expectedUsablePups = numFemales * litterSize * usablePercent;
    this.expectedDOB = expectedDOB;
    this.actualDOB = actualDOB;
    this.numLitters = 20;
  };
}
