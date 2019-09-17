'use strict';

app.controller('addExpReportCtrl', function($rootScope, $scope, $http,$state,$window) {
    $scope.courses =[];
    $scope.exps=[];
    $scope.expReport={
        "courseId":"",
        "expId":"",
        "stuID":"",
        "status":""  //根据status值给定’保存‘与’提交‘按钮状态 -1:无记录 0有记录未提交 1有记录已提交
    };
    document.getElementById('expname').disabled=true;
    document.getElementById('btns1').disabled=true;
    document.getElementById('btns2').disabled=true;
    //获取所有课程名
    $http({
        url:'/api/getcourseinfo',
        method:'POST',
        data:{teacherName:$scope.storage.id}
    }).success(function(response){
        //console.log("获取当前老师的课程成功");
        for(var i = 0; i < response.courseInfos.length;i ++){
            $scope.courses[i] = response.courseInfos[i];
            //console.log($scope.courses[i]);
        }
    }).error(function(){
        console.log("获取当前老师的课程失败！");
    });
    //获取学生用户ID
    $scope.expReport.stuID = $scope.storage.id;
    // $http({
    //     url:'/api/getstuid',
    //     method:'POST',
    //     data:{stuName:$scope.storage.id}
    // }).success(function(response){
    //     //console.log(response.stuID[0].userId);
    //     $scope.expReport.stuID=response.stuID[0].userId;
        
    // }).error(function(){
    //     console.log("获取用户ID失败！");
    // });
    
    //选择课程查询实验列表
    $scope.course_sel = function(){
        console.log($scope.expReport.courseId);
        $http({
            url:'/api/getexpinfo',
            method:'POST',
            data:{cid:$scope.expReport.courseId}
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

    $scope.experience_sel = function () {
        $http({
            url: '/api/getreport',
            method: 'POST',
            data: {expId: $scope.expReport.expId,stuId:$scope.storage.id}
        }).success(function (response) {
            //console.log("sssss");
            console.log("res",response.report);
            if(response.report!=undefined){
                UE.getEditor('editor1').setContent(response.report.reportText);
                $scope.expReport.status=response.report.status;
            }else{
                UE.getEditor('editor1').setContent("");
                $scope.expReport.status="-1";
            }
            console.log("status"+$scope.expReport.status);

            //根据status值给定’保存‘与’提交‘按钮状态 -1:无记录 0有记录未提交 1有记录已提交
            var x = document.getElementById("btns1");
            var y = document.getElementById("btns2");
            if(($scope.expReport.status=="1")){
                x.innerHTML = "已提交";
                y.innerHTML = "已提交";
                x.disabled=true;
                y.disabled=true;
            }else{
                x.innerHTML = "保  存";
                y.innerHTML = "提  交";
                x.disabled=false;
                y.disabled=false;
            }

        }).error(function () {
            console.log("获取失败！");
        });
        //document.getElementById('expname').disabled = false;
    };

    $scope.updReport=function(){
        var report1=UE.getEditor('editor1').getContent();
        //console.log("report:"+report1);
        console.log("status:"+$scope.expReport.status);
        if($scope.expReport.status=="-1"){
            //插入新记录 add
            if($scope.expReport.reportText!=""){
                $http.post('/api/addreport',{
                    expId:$scope.expReport.expId,
                    couId:$scope.expReport.courseId,
                    stuId:$scope.expReport.stuID,
                    stuName:$scope.storage.id,
                    reportText:report1,
                    status:"0"
                }).then(function(response){
                    console.log(response);
                    if(response.data=="success"){
                        $scope.expReport.status="0";
                        alert("保存成功");
                        //$window.location.reload();
                    }else{
                        alert("保存失败");
                    }
                });

            }else{
                alert("内容不能为空");
            }

        }else if($scope.expReport.status=="0"){
            //更新记录  upd
            if($scope.expReport.reportText!=""){
                $http.post('/api/updreport',{
                    expId:$scope.expReport.expId,
                    stuId:$scope.expReport.stuID,
                    reportText:report1,
                    status:"0"
                }).then(function(response){
                    console.log(response);
                    if(response.data=="success"){
                        $scope.expReport.status="0";
                        alert("保存成功");
                        //$window.location.reload();
                    }else{
                        alert("保存失败");
                    }
                });

            }else{
                alert("内容不能为空");
            }
        }
    };


    $scope.submitReport=function(){
        var report1=UE.getEditor('editor1').getContent();
        console.log("report:"+report1);

        if($scope.expReport.status=="-1"){
            //提交新记录 add
            if($scope.expReport.reportText!=""){
                $http.post('/api/addreport',{
                    expId:$scope.expReport.expId,
                    couId:$scope.expReport.courseId,
                    stuId:$scope.expReport.stuID,
                    stuName:$scope.storage.id,
                    reportText:report1,
                    status:"1"
                }).then(function(response){
                    console.log(response);
                    if(response.data=="success"){
                        alert("保存成功");
                        $window.location.reload();
                    }else{
                        alert("保存失败");
                    }
                });

            }else{
                alert("内容不能为空");
            }

        }else if($scope.expReport.status=="0"){
            //提交为最终记录记录 upd
            if($scope.expReport.reportText!=""){
                $http.post('/api/updreport',{
                    expId:$scope.expReport.expId,
                    stuId:$scope.expReport.stuID,
                    reportText:report1,
                    status:"1"
                }).then(function(response){
                    console.log(response);
                    if(response.data=="success"){
                        alert("保存成功");
                        $window.location.reload();
                    }else{
                        alert("保存失败");
                    }
                });

            }else{
                alert("内容不能为空");
            }
        }

    };
    
});