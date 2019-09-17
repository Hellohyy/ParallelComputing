'use strict';
app.controller('updCourseCtrl',['$rootScope','$scope','$http','$state','$window','$parse','fileReader',function($rootScope,$scope,$http,$state,$window,$parse,fileReader){
	console.log("updCourse");
	console.log($scope.storage.updCourseId);
	// 获取当前课程id的课程信息，方便下一步课程信息的修改
	$http({
    	url:'/api/getCourseName',
    	method:'POST',
    	data:{id:$scope.storage.updCourseId}
    }).success(function(response){
    	console.log(response);
    	// $scope.chosingCourse = response.chosingCourse;
    	// head部分显示课程的信息内容
    	$scope.chosingCourseName = response.chosingCourse[0].courseName;
    	$scope.chosingCourseIntro = response.chosingCourse[0].courseIntro;
    	$scope.chosingCoursePicture = response.chosingCourse[0].coursePicture;
    	// 增加当前课程的教师名称与当前教师的名称的比较，可能为公共课程和该教师的课程两种
    	$scope.chosingCourseTeacherName = response.chosingCourse[0].teacherName;
    	if($scope.chosingCourseTeacherName == $scope.storage.id){
    		$scope.flag = 1;
    	}else{
    		$scope.flag = 0;
    	}
    	// 获取图片上传后的图片名称
    	$scope.getFile = function(){
    		fileReader.readAsDataUrl($scope.image,$scope)
    		.then(function(result){
    			// 获取图片地址的url方便预览,base64编码 
    			console.log(result);
    			// 将base64编码直接存在数据库中，减少文件的保存和删除
    			$scope.chosingCoursePicture = result;
    			console.log($scope.image);
    			// console.log($scope.image.originalname);
    			// 图片名称返回，方便之后对数据库进行更新
    			// $scope.newCoursePicture = $scope.image.name;
    			// console.log($scope.newCoursePicture);
    		});
    	};
    	// 点击提交修改之后，将新修改的课程名称、封面图、课程简介传递到后台方便数据库的更新
    	$scope.updCourse = function(){
    		$scope.newCourse = {
    			"currentCouId":$scope.storage.updCourseId,
    			"couName":$scope.chosingCourseName,
    			"couIntro":$scope.chosingCourseIntro,
    			"couPicture":$scope.chosingCoursePicture
    		}
    		console.log($scope.newCourse);
    		// 点击提交修改后的课程内容
    		// console.log($scope.chosingCourseName+$scope.chosingCourseIntro+$scope.newCoursePicture);	
    		$http({
    			url:'api/updCourse',
    			method:'POST',
    			data:{newCourse:$scope.newCourse}
    		}).success(function(response){
    			console.log(response);
                if(response == "success"){
                    // 课程修改成功，跳转至课程页面
                    // 当前为管理员用户时跳转至公共课程，当前为教师用户时跳转至教师课程
                    if($scope.storage.authority == 1){
                        $state.go('app.experimentalDuty');
                    }
                    if($scope.storage.authority == 2){
                        $state.go('app.commonCourse');
                    }
                    
                }else{
                    console.log("课程修改失败");
                    // 修改失败之后，提醒用户
                    $scope.updAlert = document.getElementById("updFailed");
                    // 提示框显示
                    $scope.updAlert.className="modal hide";
                    // 提示框隐藏
                    $scope.closeModal = function(){
                        $scope.updAlert.className = "modal hide";
                    }
                }
    		}).error(function(){
    			console.log("error");
    		});
    	}





    }).error(function(){
    	console.log("error");
    });
}])