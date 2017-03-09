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

  // Opens Create Breeder Modal
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
    this.calculateLineInfo();
    return cageService.fetchCages(this.currentLine._id)
    .then(cages => {
      $log.debug('currentLine', this.currentLine);
      this.currentLine.cages = cages;
    });
  };

  this.fetchMice = function() {
    $log.debug('homeCtrl.fetchMice');
    $log.debug('currentCage', this.currentCage);
    this.calculateCageInfo();
    return mouseService.fetchMice(this.currentCage._id)
    .then(mice => {
      this.mice = mice;
      this.currentCage.mice = mice;
    });
  };

  //Fetch all projects on page load
  this.fetchProjects();

  //calculate expected total pups
  //calculate expected usable pups
  this.calculateLineInfo = function() {
    $log.debug('homeCtrl.calculateLineInfo()');
    //calculate expected total pups
    let numBreedingFemales = this.currentLine.cages.numberOfFemales;
    let litterSize = 6;
    let numberLittersMonthly = this.currentLine.cages.numberLittersMonthly;
    this.expectedTotalPups = numBreedingFemales * litterSize * numberLittersMonthly;

    //calculate expected usable pups
    //a line has multiple cages, each cage has multiple mice,
    //iterate through the cages of the current line
    // for (var i = 0; i < this.currentLine.cages.length; i++) {
    //   //iterate through all the mice of the cage[i]
    //   for (var i = 0; i < this.currentLine.cage[i].mice.length; i++) {
    //     ????
    //   };
    // }
    // let usablePercent = this.currentLine.
  };

  this.calculateLineInfo = function(){
    $log.debug('homeCtrl.calculateLineInfo');
    let numCages = this.currentLine.cages.length;
    let totalFemales = 0, litterSize = 6, usablePercent =.25;
    for(var i = 0; i < this.currentLine.cages.length; i++){
      let currentCage = this.currentLine.cages[i];
      totalFemales += currentCage.numberOfFemales;
    }
    this.numLitters = numCages;
    this.expectedTotalPups = litterSize * this.numLitters * totalFemales;
    this.expectedUsablePups = totalFemales * litterSize * usablePercent;
  };

  this.calculateCageInfo = function() {
    $log.debug('homeCtrl.calculateCageInfo');
    // Calculate Expected DOB and return formatted date
    let d = this.currentCage.breedingStartDate;
    let date =  new Date(d);
    date.setDate(date.getDate() + 22);
    date.toDateString();
    let expectedDOB = (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();

    // Return formatted date for actualDOB
    let d2 = this.currentCage.actualDOB;
    let date2 = new Date(d2);
    date2.toDateString();
    let actualDOB = (date2.getMonth()+1) + '/' + date2.getDate() + '/' + date2.getFullYear();

    // Constants from inputs and pre-known
    let numFemales = this.currentCage.numberOfFemales;
    let litterSize = 6;
    let usablePercent = .25;

    this.expectedPupsPerCage = litterSize * numFemales;
    this.expectedUsablePupsPerCage = numFemales * litterSize * usablePercent;
    this.expectedDOB = expectedDOB;
    this.actualDOB = actualDOB;
  };
}
