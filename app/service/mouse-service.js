'use strict';

module.exports = ['$q', '$log', '$http', 'authService', mouseService];

function mouseService($q, $log, $http, authService){
  $log.debug('init MouseService');
  let service = {};

  service.mice = [];

  service.fetchMice = function(cageId){
    $log.debug('MouseService.fetchMice()');

    let url = `${__API_URL__}/api/cage/${cageId}/mice`;
    let config = {
      headers: {
        Accept: 'application/json',
      },
    };
    return $http.get(url, config)

    .then(res => {
      $log.debug('successfully fetched mice');
      service.mice = res.data;
      return service.mice;
    })
    .catch(err => {
      $log.error(err.message);
      $q.reject(err);
    });
  };

  service.createMouse = function(cageId, mouse){
    $log.debug('MouseService.createMouse()');

    return authService.getToken()
    .then(token => {
      let url =
      `${__API_URL__}/api/cage/${cageId}/mouse`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.post(url, mouse, config);
    })
    .then(res => {
      $log.debug('successfully created mouse');
      let mouse = res.data;
      service.mice.unshift(mouse);
      return mouse;
    })
    .catch(err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.deleteMouse = function(mouseId, cageId){
    $log.debug('ouseService.deleteMouse()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/cage/${cageId}/mouse/${mouseId}`;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.delete(url, config);
    })
    .then(() => {
      $log.debug('successfully deleted cage');
      for (let i = 0; i < service.mice.length; ++i){
        let current = service.mice[i];
        if (current._id === mouseId){
          service.mice.splice(i, 1);
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

  service.updateMouse = function(mouse){
    $log.debug('MouseService.updateMouse()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/cage/${mouse.cageId}/mouse/${mouse._id}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.put(url, mouse, config);
    })
    .then(res => {
      $log.debug('successfully updated mouse');
      let mouse = res.data;
      for (let i = 0; i < service.mice.length; ++i){
        let current = service.mice[i];
        if (current._id === mouse._id){
          current = res.data;
          break;
        }
      }
      return mouse;
    })
    .catch(err => {
      $log.error(err.message);
      $q.reject(err);
    });
  };

  return service;
}
