'use strict';

app.controller('updExpCtrl', function($rootScope, $scope, $http, $stateParams, $state,$window) {
    console.log("url:"+window.UEDITOR_HOME_URL);
    if(window.UEDITOR_HOME_URL!="/ueditor/"){
        console.log("刷新");
        $window.location.reload();
    }
    // 获取缓存中的需要修改的实验id
    $scope.modifyId = $scope.storage.modifyId;
    console.log($scope.modifyId);
    // console.log("获取从state.go传递过来的参数$stateParams.modifyId");
    console.log($scope.storage.courseNotebookFlag+"notebookFlag");
    // console.log($stateParams.modifyId);
    $scope.courses = [];
    $scope.exps = [];
    $scope.expName = '';
    $scope.expEnvironment = '';
    $scope.expObjective = '';
    $scope.expInfo = {
        "courseId": "",
        "expId": ""
    };
        // document.getElementById('expname').disabled = true;
    // $http({
    //     url: '/api/getupdCourse',
    //     method: 'POST',
    //     data: {teacherName: $scope.storage.name}
    // }).success(function (response) {
       
    //     $scope.courses = response.courseInfos
    // }).error(function () {
    //     console.log("获取当前老师的课程失败！");
    // });

    $scope.course_sel = function () {
        //console.log($scope.expReport.courseId);
        $http({
            url: '/api/getexpinfo',
            method: 'POST',
            data: {cid: $scope.expInfo.courseId}
        }).success(function (response) {
            $scope.exps = response.expInfos;
            //console.log("获取实验id成功");
           /* if (response.expInfos.length == 0) {
                $scope.exps = [];
            }
            for (var i = 0; i < response.expInfos.length; i++) {
                $scope.exps[i] = response.expInfos[i];
                //console.log($scope.exps[i]);
            }*/
        }).error(function () {
            console.log("获取实验id失败！");
        });
        document.getElementById('expname').disabled = false;
    };
    // $scope.experience_sel = function () {
        //console.log($scope.expReport.courseId);
        $http({
            url: '/api/getExpContent',
            method: 'POST',
            data: {expId: $scope.modifyId}
        }).success(function (response) {
            //console.log("获取实验id成功");
            console.log(response.expcontent);
            // 当前需要修改的实验是notebook还是novnc类型标记：默认为1，代表是novnc
            $scope.notebookFlag = 1;

            // 当前实验属于notebook还是novnc标记：为1的时候代表为novnc，为0的时候代表为notebook
            console.log(response.vncNotebookFlag);
            $scope.notebookFlag = response.vncNotebookFlag;
            console.log($scope.notebookFlag);
            $scope.expName = response.expcontent.experienceName;
            $scope.expEnvironment = response.expcontent.experienceEnvironment;
            $scope.expObjective = response.expcontent.experienceObjective;
            console.log(response.expcontent.experienceProcedures);
            if($scope.storage.courseNotebookFlag==1){
                // 由于在编辑器中执行setContent操作的时候，编辑器会出现还未加载完成的情况，因此，这里设置延迟，使得编辑器能够成功加载，然后再执行内容设置操作
                setTimeout(function(){
                    UE.getEditor('editor2').setContent(response.expcontent.experiencePrinciple);
                    UE.getEditor('editor4').setContent(response.expcontent.experienceProcedures);
                },500);
            }
            
        

        }).error(function () {
            console.log("获取实验信息失败！");
        });
        // document.getElementById('expname').disabled = false;
    // };

    $scope.submitContent = function () {
        // 设置关闭提示框函数
        $scope.closeModal = function(){
            $scope.expModifyAlert.className = "modal hide";
        }
        // 提示框
        $scope.expModifyAlert = document.getElementById("expModifyModal");
        var content1 = $scope.expObjective;//实验目的
        // var content2=$scope.expPrinciple;//实验原理
        
        var content5 = $scope.expName;//实验名称
        // console.log($scope.expObjective);
        // 当需要修改的实验为非notebook时，所有的实验步骤、实验目的都需要修改
        if ($scope.storage.courseNotebookFlag==1) {
            var content3 = $scope.expEnvironment;//实验环境
            var content2 = UE.getEditor('editor2').getContent();//实验原理;获取纯文本信息
            var content4 = UE.getEditor('editor4').getContent();//实验步骤；获取纯文本
            console.log(UE.getEditor('editor2').getContent());
            console.log("实验原理内容获取如上");
            // if ($scope.expInfo.courseId == "") {
            //     alert("课程名称未选择！请重新设置");
            // } else if ($scope.expInfo.expId == "") {
            //     alert("实验名称未选择！请重新设置");
            // } else 
            if($scope.expName == ""){
                // 实验名称为空
                // 提示框显示
                $scope.expModifyAlert.className = "modal show";
            }else if ($scope.expObjective == "") {
                // alert("实验目的未填写！请重新设置");
                // 提示框显示
                $scope.expModifyAlert.className = "modal show";
            } else if (content2 == "") {
                // alert("实验原理未填写！请重新设置");
                // 提示框显示
                $scope.expModifyAlert.className = "modal show";
            } else if ($scope.expEnvironment == "") {
                // alert("实验环境未填写！请重新设置");
                // 提示框显示
                $scope.expModifyAlert.className = "modal show";
            } else if (content4 == "") {
                // alert("实验步骤未填写！请重新设置");
                // 提示框显示
                $scope.expModifyAlert.className = "modal show";
            } else {
                // 老师确定添加课程与否
                // $scope.expChoice = confirm("确定更新该实验？");
                $scope.confirmModifyExpModal = document.getElementById("confirmModifyExp");
                // 确认提示框显示
                $scope.confirmModifyExpModal.className = "modal show";
                // 用户点击取消按钮，隐藏模态框
                $scope.closeConfirm = function(){
                    $scope.confirmModifyExpModal.className = "modal hide";
                    console.log("取消实验修改");
                }
                // 用户点击确定按钮
                $scope.confirmModifyExp = function(){
                    $scope.confirmModifyExpModal.className = "modal hide";
                    $http.post('/api/updateContent',
                    {
                        expObj: content1,
                        expPrin: content2,
                        expEnv: content3,
                        expPro: content4,
                        expName: content5,
                        // expLabel:$scope.expInfo.expLabel,
                        expId: $scope.modifyId
                    })
                    .then(function (response) {
                        // 目前存在问题：一旦添加的实验所属的课程名不存在，则报错！
                        console.log(response);
                        if (response.data == "success") {
                            // alert("实验更新成功");
                            $scope.modifySuccessModal = document.getElementById("modifyExpSuccess");
                            $scope.modifySuccessModal.className = "modal show";
                            $scope.closeModal = function(){
                                $scope.modifySuccessModal.className = "modal hide";
                                $window.location.reload();
                            }
                            
                        } else if (response.data == "Failed") {
                            alert("实验更新失败");
                        }
                        if (response.data == "noExperience") {
                            alert("该实验还未建立，重新检查实验名是否正确");
                        }
                    });
                }
            }  
        }else{
            // 当实验为notebook类型时，只需要修改实验名称和实验目的
            if($scope.expName == ""){
                // 实验名称为空
                // 提示框显示
                $scope.expModifyAlert.className = "modal show";
            }else if($scope.expObjective == ""){
                // 实验目的为空时，提醒
                $scope.expModifyAlert.className = "modal show";
            }else{
                $scope.confirmModifyExpModal = document.getElementById("confirmModifyExp");
                // 确认提示框显示
                $scope.confirmModifyExpModal.className = "modal show";
                // 用户点击取消按钮，隐藏模态框
                $scope.closeConfirm = function(){
                    $scope.confirmModifyExpModal.className = "modal hide";
                    console.log("取消实验修改");
                }
                // 用户点击确定按钮
                $scope.confirmModifyExp = function(){
                    $scope.confirmModifyExpModal.className = "modal hide";
                    $http.post('/api/updateNBContent',{
                        expObj: content1,
                        expName: content5,
                        expId: $scope.modifyId
                    }).then(function(response){
                        console.log(response);
                        if (response.data == "success") {
                            // alert("实验更新成功");
                            $scope.modifySuccessModal = document.getElementById("modifyExpSuccess");
                            $scope.modifySuccessModal.className = "modal show";
                            $scope.closeModal = function(){
                                $scope.modifySuccessModal.className = "modal hide";
                                $window.location.reload();
                            }
                            
                        } else if (response.data == "Failed") {
                            alert("实验更新失败");
                        }
                        if (response.data == "noExperience") {
                            alert("该实验还未建立，重新检查实验名是否正确");
                        }
                    });
                }
            }
        }
        
    };

    
});