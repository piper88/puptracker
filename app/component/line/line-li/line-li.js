'use strict';

module.exports = {
  template: require('./line-li.html'),
  controller: ['$log', '$uibModal',  lineLIController],
  controllerAs: 'lineLICtrl',
  bindings: {
    line: '<',
  },
};

function lineLIController($log, $uibModal){
  $log.debug('init lineLICtrl');

  // Opens Delete Line Modal
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
