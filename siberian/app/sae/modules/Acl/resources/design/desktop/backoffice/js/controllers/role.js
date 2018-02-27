/*global
    swal
 */
App.config(function ($routeProvider) {
    $routeProvider.when(BASE_URL + '/acl/backoffice_role_list', {
        controller: 'RoleListController',
        templateUrl: BASE_URL + '/acl/backoffice_role_list/template'
    }).when(BASE_URL + '/acl/backoffice_role_edit/role_id/:role_id', {
        controller: 'RoleEditController',
        templateUrl: BASE_URL + '/acl/backoffice_role_edit/template',
        code: 'role-edit'
    }).when(BASE_URL + '/acl/backoffice_role_edit', {
        controller: 'RoleEditController',
        templateUrl: BASE_URL + '/acl/backoffice_role_edit/template',
        code: 'role-edit'
    });
}).controller('RoleListController', function ($scope, $location, Header, SectionButton, Role) {
    $scope.header = new Header();
    $scope.header.button.left.is_visible = false;
    $scope.content_loader_is_visible = true;

    $scope.button = new SectionButton(function () {
        $location.path('acl/backoffice_role_edit');
    });

    Role.loadListData().success(function (data) {
        $scope.header.title = data.title;
        $scope.header.icon = data.icon;
        $scope.words = data.words;
    });

    Role.findAll().success(function (data) {
        $scope.roles = data;
    }).finally(function () {
        $scope.content_loader_is_visible = false;
    });

    $scope.deleteRole = function (roleId) {
        swal({
            html: true,
            title: $scope.words.deleteTitle,
            text: $scope.words.deleteText,
            showCancelButton: true,
            confirmButtonColor: '#ff3a2e',
            confirmButtonText: $scope.words.confirmDelete,
            cancelButtonText: $scope.words.cancelDelete,
            buttons: true
        }, function () {
            $scope.content_loader_is_visible = true;
            Role.delete(roleId)
                .success(function (data) {
                    $scope.message.setText(data.message)
                        .isError(false)
                        .show();

                    Role.findAll().success(function (findData) {
                        $scope.roles = findData;
                    }).finally(function () {
                        $scope.content_loader_is_visible = false;
                    });
                });
        });
    };

}).controller('RoleEditController', function ($scope, $location, $routeParams, $window, Header, Role, Url) {
    if ($routeParams.role_id === 1) {
        $location.path(Url.get('acl/backoffice_role_list'));
    } else {
        $scope.header = new Header();
        $scope.header.button.left.is_visible = false;
        $scope.content_loader_is_visible = true;

        $scope.denied_resources = {};

        Role.loadListData().success(function (data) {
            $scope.header.title = data.title;
            $scope.header.icon = data.icon;
        });

        Role.find($routeParams.role_id).success(function (data) {
            $scope.section_title = data.title;
            $scope.role = data.role;
            $scope.parentRoles = data.parentRoles;
            $scope.resources = data.resources;

            $scope.parent_resources = [];
            angular.forEach($scope.resources, function (resource) {
                $scope.parent_resources[resource.code] = false;
            });

            $scope.__prepareParents();
        }).finally(function () {
            $scope.content_loader_is_visible = false;
        });

        $scope.save = function () {
            if (!$scope.role.parent_id) {
                swal('Error', 'A parent is required!');
                return false;
            }
            $scope.__prepareParents(null, true);

            var role = {
                'role': $scope.role,
                'resources': $scope.resources
            };

            Role.save(role).success(function (data) {
                $scope.message.setText(data.message)
                    .isError(false)
                    .show()
                ;
                $location.path(Url.get('acl/backoffice_role_list'));
            }).error(function (data) {
                $scope.message.setText(data.message)
                    .isError(true)
                    .show()
                ;

                $scope.__prepareParents();
            });
        };

        $scope.toggleIsAllowed = function (resource, is_allowed) {
            if (!angular.isDefined(is_allowed)) {
                is_allowed = resource.is_allowed;
            }

            if (is_allowed) {
                $scope._toggleParentsIsAllowed(resource);
            }

            $scope._toggleChildrenIsAllowed(resource, is_allowed);
        };

        $scope._toggleParentsIsAllowed = function (resource) {
            for (var i = 0; i < 10; i ++) {
                if (resource) {
                    resource.is_allowed = true;
                    var resource = resource.parent;
                }
            }
        };

        $scope._toggleChildrenIsAllowed = function (resource, is_allowed) {
            resource.is_allowed = is_allowed;

            if (resource.children) {
                resource.children_are_visible = true;
                angular.forEach(resource.children, function (child) {
                    $scope.toggleIsAllowed(child, is_allowed);
                });
            }
        };

        $scope.__prepareParents = function (parent, remove_parent) {
            var resources = parent ? parent.children : $scope.resources;

            angular.forEach(resources, function (child) {
                child.parent = remove_parent ? null : parent;
                if (child.children) {
                    $scope.__prepareParents(child, remove_parent);
                }
            });
        };
    }
});

App.directive('filterList', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            var li = element[0].querySelectorAll('li');
            function filterBy(value) {
                li.forEach(function (el) {
                    console.log(el.querySelector('span.role-label').textContent.toLowerCase().trim());
                    el.className = el.querySelector('span.role-label').textContent.toLowerCase().indexOf(value.toLowerCase()) !== -1 ? '' : 'ng-hide';
                });
            }
            scope.$watch(attrs.filterList, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    filterBy(newVal);
                }
            });
        }
    };
});
