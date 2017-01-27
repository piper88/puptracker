'use strict';

module.exports = ['$q', '$log', '$http', 'authService', ProjectService];

function ProjectService($q, $log, $http, authService){
  $log.debug('init ProjectService');
  let service = {};

  service.projects = [];

//no method for fetch all projects, don't think you'll ever need that ability?

  service.createProject = function(project) {
    $log.debug('ProjectService.createProject()');

    return authService.getToken()
    .then((token) => {
      let url  = `${__API_URL__}/api/project`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.post(url, project, config);
    })
    .then(res => {
      $log.debug('successfully created project');
      let project = res.data;
      service.projects.unshift(project);
      return project;
    })
    .catch(err => {
      $log.error(err.message);
      $q.reject(err);
    });
  };

  service.deleteProject = function(projectId) {
    $log.debug('ProjectService.deleteProject()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/project/${projectId}`;
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.delete(url, config)
      .then(() => {
        $log.debug('successfully deleted project');
        for (let i = 0; i < service.projects.length; ++i) {
          let current = service.projects[i];
          if (current._id === projectId){
            service.projects.splice(i, 1);
            break;
          }
        }
        return;
      })
      .catch(err => {
        $log.error(err.message);
        $q.reject(err);
      });
    });
  };

  service.updateProject = function(project) {
    $log.debug('ProjectService.updateProject()');

    return authService.getToken()
    .then(token => {
      let url = `${__API_URL__}/api/project/${project._id}`;
      let config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      return $http.put(url, project, config)
      .then(res => {
        $log.debug('successfully updated project');
        for (let i = 0; i < service.projects.length; ++i){
          let current = service.projects[i];
          if (current._id === project._id) {
            current = res.data;
            break;
          }
        }
        return project;
      })
      .catch(err => {
        $log.error(err.message);
        $q.reject(err);
      });
    });
  };

  return service;
}
