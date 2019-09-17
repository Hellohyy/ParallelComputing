'use strict';

app.controller('reportStudentCtrl', function($rootScope, $scope, $http,$state,$window) {
    $scope.student=[];
    $scope.expInfo={
    	"courseId":$scope.storage.courseId,
    	"courseName":$scope.storage.courseName,
        "coursePicture":$scope.storage.coursePicture,
    	"expId":$scope.storage.expId,
    	"expName":$scope.storage.expName
    };

    //console.log('reportStudentCtrl');
    //console.log($scope.expInfo);

    //获取实验报告的学生信息
    $http({
        url:'/api/getstudent',
        method:'POST',
        data:{courseId:$scope.expInfo.courseId,expId:$scope.expInfo.expId}
    }).success(function(response){
        for(var i = 0; i < response.student.length;i ++){
            $scope.student[i] = response.student[i];
        }
        //console.log(response.student);
    }).error(function(){
        console.log("获取学生信息失败！");
    });

    $scope.getReport= function (stuid){
        $scope.storage.setItem("stuid",stuid);
        $state.go('app.reportDetails');
    };
    
});