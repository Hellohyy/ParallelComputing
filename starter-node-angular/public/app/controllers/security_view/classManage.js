'use strict';

app.controller('classManageCtrl',['$rootScope', '$scope', '$http', '$state','$location','$window',
    function($rootScope, $scope, $http, $state,$location,$window){


        // 点击添加实验按钮之后跳转至添加实验页面
    $scope.addClassButton = function(){
        console.log("添加班级页面");
        $state.go('app.addClass');
    }
    // 设置函数：用户点击之后关闭提示框
    $scope.closeModal = function(){
        $scope.modalId.className = "modal hide";
        // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
        $window.location.reload();
    }
        //console.log("classManage");
        $scope.Class = [];
        //从数据库中读取班级个数
        //$scope.classNum = [];
        //$scope.Num =[];
        $http.get('/api/getClassNum').then(function(response){
            console.log(response.data.classnum[0].num);
            //console.log("classnum");
            $scope.classNum = response.data.classnum[0].num
            //$scope.classNum.Num = $scope.classNum;
            //$scope.Class.Num = response.data.class.num;
            console.log($scope.classNum);
        });


        // 获取每个班级当前学生人数
        $http.get('/api/getClassStdNum').then(function(response){
            $scope.classstdNum= response.data.classstdnum;
          //$scope.classstdNum = response.data.classstdnum;
            console.log($scope.classstdNum);
        });

        //从数据库中读取已注册学生人数
        //$scope.StdNum = [];
        $http.get('/api/getStdNum').then(function(response){
            console.log(response.data.stdnum[0].num);
            $scope.stdNum = response.data.stdnum[0].num;
            console.log($scope.stdNum);
        });

       
        // 从数据库中读取所有班级的信息
        //$scope.classname = [];
        //$scope.overall = [];
        //$scope.time =[];
        $http.get('/api/getClasses').success(function(response){
            console.log(response);
            $scope.classes = response.classes;

        //删除当前班级
        $scope.deleteClass = function(index){
            $scope.currentId = index;
            // $scope.choice = confirm('确定删除该班级？');
            // 提醒用户是否确定执行相关的确定操作的模态框
            $scope.confirmModal = document.getElementById("confirmModal");
            // 提示框显示
            $scope.confirmModal.className = "modal show"; 
            // 设置函数：用户点击取消按钮,隐藏模态框
            $scope.closeConfirm = function(){
                $scope.confirmModal.className = "modal hide";
                // $scope.choice = 0;
            }
            // 设置函数：用户点击确定按钮
            $scope.confirmDel = function(){
                $scope.confirmModal.className = "modal hide";   
                //console.log("确定删除");
                // 删除班级,classtable表中的对应课程删除，class_std表中含有该课程名的记录也被删除
                $http({
                    url:'/api/deleteClass',
                    method:'POST',
                    data:{ClassId:$scope.currentId}
                }).success(function(response){
                    console.log("班级删除成功");
                    // alert("班级删除成功！");
                    // 删除成功后重新加载页面
                    $window.location.reload();
                }).error(function(){
                    console.log("失败");
                });
            }
        }
    }).error(function(){
            console.log("失败");
            alert("连接失败!"); 
        });       




// 鼠标点击的班级ID
        $scope.currentClassId = "";
        // 获取课程ID的函数
        $scope.getClassId = function(index){
            //console.log("测试1");
            console.log("前台输入："+index);
            $scope.currentClassId = index;
            console.log("classManage班级ID输出:"+$scope.currentClassId);
            $scope.storage.setItem("classIdInfo",$scope.currentClassId);
            //console.log(classIdInfo);
            // 跳转至详情，查看公共课程内容
            $state.go('app.classDetails');
        } 
    }]);