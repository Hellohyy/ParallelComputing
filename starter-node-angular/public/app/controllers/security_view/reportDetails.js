'use strict';

app.controller('reportDetailsCtrl', function($rootScope, $scope, $http,$state,$window) {
    $scope.expInfo={
        "couName":$scope.storage.couName,
        "couPic":$scope.storage.couPic,
        "expName":$scope.storage.expName,
        "stuName":$scope.storage.userName,
        "status":$scope.storage.status,
        "reportText":$scope.storage.reportText
    };

    console.log($scope.expInfo);
});