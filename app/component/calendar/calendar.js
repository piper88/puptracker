'use strict';

// require('./_calendar.scss');

module.exports = {
  template: require('./calendar.html'),
  controller: ['$log', CalendarController],
  controllerAs: 'calendarCtrl',
  bindings: {
    line: '<',
  },
};

function CalendarController($log){
  $log.debug('init calendarCtrl');

  this.uiConfig = {
    calendar:{
      height: 500,
      width: 100,
      editable: false,
      header:{
        left:'title',
        center: '',
        right: 'today prev,next',
      },
      eventClick: this.alertOnEventClick,
      eventDrop: this.alertOnDrop,
      eventResize: this.alertOnResize,
      eventRender: this.eventRender,
    },
  };

  // event source that contains custom events on the scope
  this.events = [];
  this.colorArray = {
    0:'#ff0040',
    1:'#ec891d',
    2:'#55b555',
    3:'#0079c0',
    4:'#d6e03e',
    5:'#6d276a',
  };

  // Adds event to represent breeding start and expected end for each cage
  this.updateEvents = function(line) {
    for(var i = 0; i < line.cages.length; i++) {
       // Breeding Start Date
      let cage = line.cages[i];
      $log.debug('cage', cage.breedingStartDate);
      let start = cage.breedingStartDate;
      let startDate =  new Date(start);
      startDate.toDateString();
      let startDay = startDate.getDate();
      let startMonth = startDate.getMonth();
      let startYear = startDate.getFullYear();

      // Expected Date of Birth
      let endDate = new Date(start);
      endDate.setDate(endDate.getDate() + 22);
      endDate.toDateString();
      let endDay = endDate.getDate();
      let endMonth = endDate.getMonth();
      let endYear= endDate.getFullYear();


      // Push events into array
      this.events.push({
        title: cage.name,
        start: new Date(startYear, startMonth, startDay),
        end: new Date(endYear, endMonth, endDay),
        color: this.colorArray[i],
      });
    }
  };

  // Remove event
  this.remove = function(index) {
    this.events.splice(index,1);
  };

  // Event sources array
  this.eventSources = [this.events];
}
