'use strict';

module.exports = {
  template: require('./project-li.html'),
  controller: ['$log', '$uibModal', ProjectLIController],
  controllerAs: 'projectLICtrl',
  bindings: {
    project: '<',
  },
};

function ProjectLIController($log, $uibModal){
  $log.debug('init projectLICtrl');

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


}
