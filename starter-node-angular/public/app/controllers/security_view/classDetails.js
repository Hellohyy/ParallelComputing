'use strict';

app.controller('classDetailsCtrl',['$rootScope', '$scope', '$http', '$state','$location','$window',
    function($rootScope, $scope, $http, $state,$location,$window){
    $scope.closeModal = function(){
    $scope.modalExpId.className = "modal hide";
    // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
    $window.location.reload();
    }
//查询数据库选中班级的学生名单
    $scope.chosingId = $scope.storage.classIdInfo;
    console.log("班级ID"+$scope.chosingId);
    //$scope.chosingId = $scope.storage.classIdInfo;
    console.log($scope.chosingId);
        //$scope.chosingId = index;
            // 从数据库中提取选中班级的学生名单
            $http({
                url:'/api/getClassStd',
                method:'POST',
                data:{ClassId:$scope.chosingId}
            }).success(function(response){
                console.log(response);
                $scope.classstd = response.classstd;
                $scope.classname = response.classstd[0].classname;
                $scope.storage.setItem("classname",response.classstd[0].classname);
                console.log($scope.classname);
                //console.log("calssDetails"+$scope.classStd);
            }).error(function(){
                console.log("失败");
            });

//删除学生
    $scope.deleteStd = function(index){
        //console.log(index);
        $scope.currentId = index;
        console.log($scope.currentId);
        // 提醒用户是否确定执行相关的确定操作的模态框
        $scope.confirmExpModal = document.getElementById("confirmExpModal");
        $scope.choice = confirm('确定删除该学生？');   
        if($scope.choice == true){

            //console.log("确定删除");
            // 删除班级,classtable表中的对应课程删除，class_std表中含有该课程名的记录也被删除
            $http({
                url:'deleteStd',
                method:'POST',
                data:{StdId:$scope.currentId}
            }).success(function(response){
                //console.log("更新成功");
                alert("学生删除成功！");
                // 删除成功后重新加载页面
                $window.location.reload();
            }).error(function(){
                console.log("失败");
            });
        }else{
            console.log("取消");
        }

}

    //返回班级管理页面
    $scope.backward=function(){
        console.log("返回班级管理页面按钮");
        $state.go('app.classManage');

    }
    $scope.addStudentButton=function(){
        //console.log($scope.classname);
        //$scope.stdClass=index;
        //console.log($scope.stdClass);
        $state.go('app.addStudent');
    }


    }]);
        