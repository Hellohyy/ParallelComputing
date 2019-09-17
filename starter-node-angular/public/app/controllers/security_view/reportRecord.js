'use strict';

app.controller('reportRecordCtrl', function($rootScope, $scope, $http,$state,$window) {

    $scope.reportInfos=[];

    $http({
        url:'/api/getSelfReport',
        method:'POST',
        data:{stuName:$scope.storage.id}
    }).success(function(response){
        console.log("获取所有实验报告成功");
        console.log(response.report);
        for(var i = 0; i < response.report.length;i ++){
            $scope.reportInfos[i] = response.report[i];
        }
    }).error(function(){
        console.log("获取失败！");
    });

    $scope.report_det = function(report){
        $scope.storage.setItem("couName",report.courseName);
        $scope.storage.setItem("couPic",report.coursePicture);
        $scope.storage.setItem("expName",report.experienceName);
        $scope.storage.setItem("stuName",report.stuName);
        $scope.storage.setItem("status",report.status);
        $scope.storage.setItem("reportText",report.reportText);
        $state.go('app.reportDetails');
    };

});