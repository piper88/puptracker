'use strict';

module.exports = ['$q', '$log', '$http', 'authService', lineService];

function lineService($q, $log, $http, authService){
  $log.debug('init LineService');
  let service = {};

  service.lines = [];

  service.fetchLines = function(projectId){
    $log.debug('LineService.fetchLines()');

    let url = `${__API_URL__}/api/project/${projectId}/lines`;
    let config = {
      headers: {
        Accept: 'application/json',
      },
    };
    return $http.get(url, config)

    .then(res => {
      $log.debug('successfully fetched lines');
      service.lines = res.data;
      return service.lines;
    })
    .catch(err => {
      $log.error(err.message);
      $q.reject(err);
    });
  };

  service.createLine = function(projectId, line){
    $log.debug('LineService.createLine()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/project/${projectId}/line`;
      let config = {
        headers: {
          //what you're going to get back from  backend
          Accept: 'application/json',
          //what you're going to send to backend
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.post(url, line, config);

    })
    .then(res => {
      $log.debug('Successfully created line');
      let line = res.data;
      service.lines.unshift(line);
      return line;
    })

    .catch(err => {
      $log.error(err.message);
      return $q.reject(err);
    });
  };

  service.deleteLine = function(lineId, projectId){
    $log.debug('LineService.deleteLine');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/project/${projectId}/line/${lineId}`;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.delete(url, config);
    })
    .then(() => {
      $log.debug('Successfully deleted line');
      for (let i = 0; i < service.lines.length; ++i){
        let current = service.lines[i];
        if (current._id === lineId){
          service.lines.splice(i, 1);
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

  service.updateLine = function(project, line){
    $log.debug('LineService.updateLine()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/project/${line.projectId}/line/${line._id}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      return $http.put(url, line, config);
    })
    .then(res => {
      $log.debug('successfully updated line');
      let line = res.data;
      //replace the line in the array
      for (let i = 0; i < service.lines.length; ++i){
        let current = service.lines[i];
        if (current._id === line._id){
          current = res.data;
          break;
        }
      }
  
      return line;

    })
    .catch(err => {
      $log.error(err.message);
      $q.reject(err);
    });
  };

  return service;
}
