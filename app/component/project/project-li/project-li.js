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
  this.openDeleteModal = function(itemToDelete, data) {
    let modalInstance = $uibModal.open({
      component: 'delete-modal',
      resolve: {
        deleteToggle: function(){
          return itemToDelete;
        },

        deleteData: function(){
          return data;
        },
      },
    });
    return modalInstance;
  };

  // Opens Edit Project, Line, Cage Modal
  this.openEditModal = function(itemToEdit, data) {
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
