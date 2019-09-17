'use strict';

app.controller('contentManageCtrl', function($rootScope, $scope, $http,$state,$window) {
    console.log("url:"+window.UEDITOR_HOME_URL);
    if(window.UEDITOR_HOME_URL!="/ueditor/"){
        $window.location.reload();
        // console.log("不相等");
    }
    // 当前添加的实验所属的课程id
    $scope.chosingId = $scope.storage.courseIdInfo;
    console.log($scope.chosingId);
    // 选中课程的实验环境记录
    $scope.chosingEnv = $scope.storage.vncOrNotebook;
    console.log($scope.chosingEnv);
    console.log("已有的实验数目："+$scope.storage.existExpNum);
	$scope.expInfo = {
		"expName":"",
		// "expLabel":"",
        // "expCourseId":""//添加的实验属于哪个课程名称下面，这里设定实验的课程名与数据库中已经存在的课程名完全一样才能匹配
	};

    $scope.couInfo = {
        "couName":"",
        "couIntro":"",
        "couPic":""
    }
    // $scope.courseEnv = true;
    $scope.addMethod = 0;
    // 从数据库中获取当前教师的所有课程，让教师选择需要添加实验的课程
    $http({
        url:'/api/currentCourseNames',
        method:'POST',
        data:{teacherName:$scope.storage.name}
    }).success(function(response){
        console.log(response);
        console.log("获取当前老师的课程成功");
        // $scope.courseNames = response.courseNames;
        // console.log($scope.courseNames.length);
        // 将获取的课程名存到courseNames中
        $scope.courses = [];
        for(var i = 0; i < response.courseNames.length;i ++){
            $scope.courses[i] = response.courseNames[i];
            // $scope.courses[i].courseId = resposne.courseNames[i].courseId;
            console.log($scope.courses[i]);
        }
    }).error(function(){
        console.log("获取当前老师的课程失败！");
    });

    $scope.course_sel = function(){
        var ind = document.getElementById("expcoursename").selectedIndex;
        $scope.courseEnv = ($scope.courses[ind].vncNotebook == 1);
        //console.log($scope.courseEnv);
    };
    // 设置函数：用户点击之后关闭提示框，取消实验提交
    $scope.closeModal = function(){
        $scope.expInputAlert.className = "modal hide";
            // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
            // $window.location.reload();
    }
    $scope.submitContent=function(){
        // var content1=UE.getEditor('editor1').getPlainTxt();//实验目的
        
        // 提醒用户是否确定执行相关的确定操作的模态框，获取提示模态框id
        $scope.expInputAlert = document.getElementById("expInputModal");
        // var content3=UE.getEditor('editor3').getPlainTxt();//实验环境
        var content1=$scope.expObjective;//实验目的
        // var content2=$scope.expPrinciple;//实验原理
        var content3=$scope.expEnvironment;//实验环境
        // console.log($scope.expObjective);
        var content2=UE.getEditor('editor2').getContent();//实验原理;获取纯文本信息
        var content4=UE.getEditor('editor4').getContent();//实验步骤；获取纯文本
        //console.log($scope.expInfo.expName);
        console.log($scope.expInfo);
        console.log(content2);
        console.log("已有的实验数目："+$scope.storage.existExpNum);
        if($scope.expInfo.expName == ""){
            // alert("实验名称未填写！请重新设置");
            // 提示框显示
            $scope.expInputAlert.className = "modal show";
        }else if($scope.expObjective == ""){
            // alert("实验目的未填写！请重新设置");
            // 提示框显示
            $scope.expInputAlert.className = "modal show";
        }else if(content2 == ""){
            // alert("实验原理未填写！请重新设置");
            // 提示框显示
            $scope.expInputAlert.className = "modal show";
        }else if($scope.expEnvironment == ""){
            // alert("实验环境未填写！请重新设置");
            // 提示框显示
            $scope.expInputAlert.className = "modal show";
        }else if(content4 == ""){
            // alert("实验步骤未填写！请重新设置");
            // 提示框显示
            $scope.expInputAlert.className = "modal show";
        }else{
            console.log("确定添加该实验??");
            // 老师确定添加课程与否
            // $scope.expChoice = confirm("确定添加该实验？");
            // 提醒用户是否确定执行相关的确定操作的模态框
            $scope.confirmAddExpModal = document.getElementById("confirmAddExp");
            // 提示框显示
            $scope.confirmAddExpModal.className = "modal show";
            // $scope.choice = window.confirm('确定删除该课程？');
            // 设置函数：用户点击取消按钮,隐藏模态框
            $scope.closeConfirm = function(){
                $scope.confirmAddExpModal.className = "modal hide";
                // $scope.choice = 0;
                console.log("取消实验添加");
            }
             // 设置函数：用户点击确定按钮
            $scope.confirmAddExp = function(){
                console.log($scope.storage.courseIdInfo);
                $scope.confirmAddExpModal.className = "modal hide";
                $http.post('/api/createContent',
                {
                    expObj:content1,
                    expPrin:content2,
                    expEnv:content3,
                    expPro:content4,
                    expName:$scope.expInfo.expName,
                    // expLabel:$scope.expInfo.expLabel,
                    expCourseId:$scope.chosingId,
                    existExpNum:$scope.storage.existExpNum
                }).then(function(response){
                    // 目前存在问题：一旦添加的实验所属的课程名不存在，则报错！
                    console.log(response);
                    if(response.data =="success"){
                        // alert("实验上传成功");
                        $scope.addExpSuccessModal = document.getElementById("addExpSuccess");
                        $scope.addExpSuccessModal.className = "modal show";
                        $scope.closeModal = function(){
                            $scope.addExpSuccessModal.className = "modal hide";
                            // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                            $window.location.reload();
                        }
                        // $window.location.reload();
                    }else if(response.data =="Failed"){
                        alert("实验上传失败");
                    }
                    if(response.data =="noCourse"){
                        alert("该课程还未建立，重新检查课程名是否正确");
                    }
                });
            }
        }
        // if ($scope.expChoice == true){
                    
        // }else{
        //     // alert("内容不能为空");
        //     console.log("取消课程添加");
        // }
    };
    $scope.submitNBContent=function(){
        console.log("111111");
        console.log($scope.expIntro);
        console.log($scope.addMethod);
        console.log($scope.expInfo.expName);
        // 提醒用户是否确定执行相关的确定操作的模态框，获取提示模态框id
        $scope.expInputAlert = document.getElementById("expInputModal");
        var intro=$scope.expIntro;
        // if($scope.expInfo.expCourseId == ""){
        //     alert("课程名称未选择！请重新设置");
        // }else 
        if($scope.expInfo.expName == ""){
            // alert("实验名称未填写！请重新设置");
            // 提示框显示
            $scope.expInputAlert.className = "modal show";
        }else if(intro == ""){
            // alert("实验介绍未填写！请重新设置");
            // 提示框显示
            $scope.expInputAlert.className = "modal show";
        }else{
            // 老师确定添加课程与否
            // 提醒用户是否确定执行相关的确定操作的模态框
            $scope.confirmAddExpModal = document.getElementById("confirmAddExp");
            // 提示框显示
            $scope.confirmAddExpModal.className = "modal show";
            // $scope.expChoice = confirm("确定添加该实验？");
            // 设置函数：用户点击确定按钮
            $scope.confirmAddExp = function(){
                console.log($scope.storage.courseIdInfo);
                $scope.confirmAddExpModal.className = "modal hide";
                $http.post('/api/createNBContent',
                {
                    expIntro:intro,
                    addMethod:$scope.addMethod,
                    expName:$scope.expInfo.expName,
                    expCourseId:$scope.storage.courseIdInfo,
                    existExpNum:$scope.storage.existExpNum
                    // expCourseId:$scope.expInfo.expCourseId
                }).then(function (response) {
                    // 目前存在问题：一旦添加的实验所属的课程名不存在，则报错！
                    console.log(response);
                    if(response.data == "Failed")
                    {
                        alert("实验数据库添加失败");
                    }else if (response.data.writeResult == "" ) {
                        if($scope.addMethod == 1) {
                           $scope.expId = response.data.insertResult;
                           $('#FileUploadModal').modal();
                        }else if($scope.addMethod == 2){
                            $state.go('experimentalContentPY');
                        }else{
                            // alert("实验添加成功");
                            // $window.location.reload();
                            $scope.addExpSuccessModal = document.getElementById("addExpSuccess");
                            $scope.addExpSuccessModal.className = "modal show";
                            $scope.closeModal = function(){
                                $scope.addExpSuccessModal.className = "modal hide";
                                $window.location.reload();
                            }
                        }
                    }else{
                        alert(response.data.writeResult);
                    }
                });
            }
        }
    };
    // 实验指导书上传
    $scope.uploadExp=function(){

        $('#uploadForm').submit();
        $('#FileUploadModal').modal('hide');
        // alert('实验添加成功');
        console.log("实验指导书上传成功！");
       
    }
});
