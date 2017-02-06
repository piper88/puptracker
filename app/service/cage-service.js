'use strict';

module.exports = ['$q', '$log', '$http', 'authService', cageService];

function cageService($q, $log, $http, authService){
  $log.debug('init CageService');
  let service = {};

  service.cages = [];

  service.fetchCages = function(lineId){
    $log.debug('CageService.fetchCages()');

    let url = `${__API_URL__}/api/line/${lineId}/cages`;
    let config = {
      headers: {
        Accept: 'application/json',
      },
    };

    return $http.get(url, config)

    .then(res => {
      $log.debug('successfully fetched cages');
      service.cages = res.data;
      return service.cages;
    })
    .catch(err => {
      $log.error(err.message);
      $q.reject(err);
    });
  };

  service.fetchCage = function(cageId) {
    $log.debug('CageService.fetchCage()');
    let url = `${__API_URL__}/api/cage/${cageId}`;
    let config = {
      headers: {
        Accept: 'application/json',
      },
    };
    return $http.get(url, config)

    .then(res => {
      $log.debug('successfully fetched cage');
      service.cages = res.data;
      return service.cages;
    })
    .catch(err => {
      $log.error(err.message);
      $q.reject(err);
    });
  };

  service.createCage = function(lineId, cage){
    $log.debug('cageService.createCage()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/line/${lineId}/cage`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.post(url, cage, config);
    })
    .then(res => {
      $log.debug('successfully created cage');
      let cage = res.data;
      service.cages.unshift(cage);
      return cage;
    })
    .catch(err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.deleteCage = function(cageId, lineId){
    $log.debug('CageService.deleteCage()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/line/${lineId}/cage/${cageId}`;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.delete(url, config);
    })
    .then(() => {
      $log.debug('successfully deleted cage');
      for (let i = 0; i < service.cages.length; ++i){
        let current = service.cages[i];
        if (current._id === cageId){
          service.cages.splice(i, 1);
          break;
        }
      }
      return;
    })
    .catch(err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.updateCage = function(line, cage){
    $log.debug('CageService.updateCage()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/line/${cage.lineId}/cage/${cage._id}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.put(url, cage, config);
    })
    .then(res => {
      $log.debug('successfully updated cage');
      let cage = res.data;
      for (let i = 0; i < service.cages.length; ++i){
        let current = service.cages[i];
        if (current._id === cage._id){
          current = res.data;
          break;
        }
      }
      return cage;
    })
    .catch(err => {
      $log.error(err.message);
      $q.reject(err);
    });
  };

  return service;
}
