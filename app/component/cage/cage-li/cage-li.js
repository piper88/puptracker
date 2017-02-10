'use strict';

module.exports = {
  template: require('./cage-li.html'),
  controller: ['$log', '$uibModal', cageLIController],
  controllerAs: 'cageLICtrl',
  bindings: {
    cage: '<',
  },
};

function cageLIController($log, $uibModal){
  $log.debug('init cageLiCtrl');
  // Opens Delete Line Modal
  this.openDeleteModal = function(itemToDelete) {
    let modalInstance = $uibModal.open({
      component: 'delete-line-modal',
      resolve: {
        deleteToggle: function(){
          return itemToDelete;
        },
        deleteData: function(){
          return itemToDelete._id;
        },
      },
    });
    return modalInstance;
  };

  // Opens Edit Project, Line, Cage Modal
  this.openUpdateModal = function(itemToEdit, data) {
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
