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

}
