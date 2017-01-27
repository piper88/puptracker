'use strict';

require('./_navbar.scss');

module.exports = {
  template: require('./navbar.html'),
  controller: ['$log', '$location', '$rootScope', '$window', '$uibModal', 'authService', 'projectService', NavbarController],
  controllerAs: 'navbarCtrl',
  bindings: {
    projects: '<',
  },
};

function NavbarController($log, $location, $rootScope, $window, $uibModal, authService, projectService) {
  $log.debug('init navbarCtrl');

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

  this.logout = function() {
    $log.debug('navbarCtrl.logout()');
    authService.logout()
      .then(() => {
        $location.url('/');
        console.log('logged out');
      });
  };

}
