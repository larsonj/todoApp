angular.module('todoApp', ['ionic'])

.factory('Projects', function() {
    return {
	all: function() {
	    var projectString = window.localStorage['projects'];
	    if (projectString) {
		return angular.fromJson(projectString);
	    }
	    return [];
	},
	save: function (projects) {
	    window.localStorage['projects'] = angular.toJson(projects);
	},
	newProject: function (projectTitle) {
	    // add a new project
	    return {
		title: projectTitle,
		tasks: []
	    };
	},
	getLastActiveIndex: function () {
	    return parseInt(window.localStorage['lastActiveProject']) || 0;
	},
	setLastActiveIndex: function (index) {
	    window.localStorage['lastActiveProject'] = index;

	}
    }
})


.controller('TodoCtrl', function($scope, $timeout, $ionicModal, Projects, $ionicSideMenuDelegate) {
    // a utility function for creating a new project
    // with the given projectTitle
    var createProject = function(projectTitle) {
	var newProject = Projects.newProject(projectTitle);
	$scope.projects.push(newProject);
	Projects.save($scope.projects);
	$scope.selectProject(newProject, $scope.projects.length-1);
    }

    // load or initialize projects
    $scope.projects = Projects.all();

    // grap the last active, or the first project
    $scope.activeProject = $scope.projects[Projects.getLastActiveIndex()];

    // Called to create a new project
    $scope.newProject = function() {
	var projectTitle = prompt('Project name');
	if(projectTitle) {
	    createProject(projectTitle);
	}
    };

    // called to select the given project
    $scope.selectProject = function(project, index) {
	$scope.activeProject = project;
	Projects.setLastActiveIndex(index);
	$ionicSideMenuDelegate.toggleLeft(false);
    };

    // Create our model
    $ionicModal.fromTemplateUrl('new-task.html', function(modal)  {
	$scope.taskModal = modal;
    }, {
	scope: $scope

    });
    
    $scope.createTask = function(task) {
	if(!$scope.activeProject || !task) {
	    return;
	}
	$scope.activeProject.tasks.push({
	    title: task.title
	});
	$scope.taskModal.hide();

	// inefficient but save all the projects
	Projects.save($scope.projects);

	task.title = "";
	
    };

    $scope.newTask = function() {
	$scope.taskModal.show();
    }

    $scope.closeNewTask = function() {
	$scope.taskModal.hide();
    };

    $scope.toggleProjects = function() {
	$ionicSideMenuDelegate.toggleLeft();
    };

    // try to create the first project, make sure to defer 
    // this by using $timeout so everyting is initialized properly

    $timeout(function() {
	if($scope.projects.length == 0) {
	    while(true) {
		var projectTitle = prompt('your first project title:');
		if(projectTitle) {
		    createProject(projectTitle);
		    break;
		}
	    }
	}
    });


});

