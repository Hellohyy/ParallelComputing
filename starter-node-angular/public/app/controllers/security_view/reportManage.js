'use strict';

app.controller('reportManageCtrl', function($rootScope, $scope, $http,$state,$window) {

    $scope.reportInfos=[];

    $http({
        url:'/api/getAllReport',
        method:'POST',
        data:{teacherName:$scope.storage.id}
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
    /*
    $scope.courses =[];
    $scope.exps=[];
    $scope.course={};
    $scope.exp={};
    $scope.courseInfo={
        "courseId":"",
        "courseName":"",
        "coursePicture":""
    };
    $scope.expInfo={
        "experienceId":"",
        "experienceName":""
    };
    
    document.getElementById('expname').disabled=true;
    document.getElementById('btns').disabled=true;
    //获取所有课程名
    $http({
        url:'/api/getcourseinfo',
        method:'POST',
        data:{teacherName:$scope.storage.name}
    }).success(function(response){
        //console.log("获取当前老师的课程成功");
        for(var i = 0; i < response.courseInfos.length;i ++){
            $scope.courses[i] = response.courseInfos[i];
            //console.log($scope.courses[i]);
        }
    }).error(function(){
        console.log("获取当前老师的课程失败！");
    });
    //获取实验名
    $scope.course_sel = function(){
        $scope.courseInfo=JSON.parse($scope.course)
        $http({
            url:'/api/getexpinfo',
            method:'POST',
            data:{cid:$scope.courseInfo.courseId}
        }).success(function(response){
            //console.log("获取实验id成功");
            if(response.expInfos.length==0){
                $scope.exps=[];
            }
            for(var i = 0; i < response.expInfos.length;i ++){
                $scope.exps[i] = response.expInfos[i];
                //console.log($scope.exps[i]);
            }
        }).error(function(){
            console.log("获取实验id失败！");
        });
        document.getElementById('expname').disabled=false;
    };
    $scope.exp_sel = function (){
        $scope.expInfo=JSON.parse($scope.exp)
        //console.log($scope.courseInfo);
        document.getElementById('btns').disabled=false;
    };
    */
});