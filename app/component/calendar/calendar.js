'use strict';

// require('./_calendar.scss');

module.exports = {
  template: require('./calendar.html'),
  controller: ['$log', CalendarController],
  controllerAs: 'calendarCtrl',
};

function CalendarController($log){
  $log.debug('init calendarCtrl');
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();

  /* event source that contains custom events on the scope */
  this.events = [
    {title: 'All Day Event',start: new Date(y, m, 1)},
    {title: 'Long Event',start: new Date(y, m, d - 5),end: new Date(y, m, d - 2)},
    {id: 999,title: 'Repeating Event',start: new Date(y, m, d - 3, 16, 0),allDay: false},
    {id: 999,title: 'Repeating Event',start: new Date(y, m, d + 4, 16, 0),allDay: false},
    {title: 'Birthday Party',start: new Date(y, m, d + 1, 19, 0),end: new Date(y, m, d + 1, 22, 30),allDay: false},
    {title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'},
  ];
  /* event source that calls a function on every view switch */
  this.eventsF = function (start, end, timezone, callback) {
    var s = new Date(start).getTime() / 1000;
    //var e = new Date(end).getTime() / 1000;
    var m = new Date(start).getMonth();
    var events = [{title: 'Feed Me ' + m,start: s + (50000),end: s + (100000),allDay: false, className: ['customFeed']}];
    callback(events);
  };

  this.calEventsExt = {
    color: '#f00',
    textColor: 'yellow',
    events: [
      {type:'party',title: 'Lunch',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
      {type:'party',title: 'Lunch 2',start: new Date(y, m, d, 12, 0),end: new Date(y, m, d, 14, 0),allDay: false},
      {type:'party',title: 'Click for Google',start: new Date(y, m, 28),end: new Date(y, m, 29),url: 'http://google.com/'},
    ],
  };

  /* add and removes an event source of choice */
  this.addRemoveEventSource = function(sources,source) {
    var canAdd = 0;
    angular.forEach(sources,function(value, key){
      if(sources[key] === source){
        sources.splice(key,1);
        canAdd = 1;
      }
    });
    if(canAdd === 0){
      sources.push(source);
    }
  };
  /* add custom event*/
  this.addEvent = function() {
    this.events.push({
      title: 'Open Sesame',
      start: new Date(y, m, 28),
      end: new Date(y, m, 29),
      className: ['openSesame'],
    });
  };
  /* remove event */
  this.remove = function(index) {
    this.events.splice(index,1);
  };
  /* Change View */
  this.changeView = function(view,calendar) {
    this.uiCalendarConfig.calendars[calendar].fullCalendar('changeView',view);
  };
  /* Change View */
  this.renderCalender = function(calendar) {
    if(this.uiCalendarConfig.calendars[calendar]){
      this.uiCalendarConfig.calendars[calendar].fullCalendar('render');
    }
  };
  //  /* Render Tooltip */
  // this.eventRender = function( event, element, view ) {
  //   element.attr({'tooltip': event.title,'tooltip-append-to-body': true});
  //   $compile(element)(this);
  // };
  /* config object */
  this.uiConfig = {
    calendar:{
      height: 450,
      editable: true,
      header:{
        left: 'title',
        center: '',
        right: 'today prev,next',
      },
      eventClick: this.alertOnEventClick,
      eventDrop: this.alertOnDrop,
      eventResize: this.alertOnResize,
      eventRender: this.eventRender,
    },
  };
  /* event sources array*/
  this.eventSources = [this.events, this.eventSource, this.eventsF];
  this.eventSources2 = [this.calEventsExt, this.eventsF, this.events];
}
