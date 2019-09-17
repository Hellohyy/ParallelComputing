'use strict';
app.controller('teacherDetailsCtrl', ['$rootScope', '$scope', '$http', '$state','$location','$window',
	function($rootScope, $scope, $http, $state,$location,$window) {
//点击教师人数获取教师名单
        // $http.get('getTeacherDetails').then(function(response){
        //     console.log(response.data);
        //     $scope.teachers=response.data.teachers;
        //     console.log($scope.teachers);
        // });
        $scope.backward=function(){
    	console.log("返回首页按钮");
    	$state.go('app.teacherList');
		}
		$scope.chosingTeacherName=$scope.storage.teacherName;
		console.log($scope.chosingTeacherName);
		//获取择老师的基本信息
		$http({
	            url:'/api/getTeacherInfo',
	            method:'POST',
	            data:{teacherName:$scope.chosingTeacherName}
	        }).success(function(response){
	            //console.log(response.teacherInfo[0]);
	            $scope.teacherInfo = response.teacherInfo[0];
	            console.log($scope.teacherInfo);
	        }).error(function(){
	        	console.log("失败");
	        });
		
			//console.log("获取老师课程信息按钮");
		//获取选中老师的课程
		$http({
	            url:'/api/getTeacherCourse',
	            method:'POST',
	            data:{teacherName:$scope.chosingTeacherName}
	        }).success(function(response){
	            console.log(response);
	            $scope.courseImgs = response.teacherCourse;
	            console.log($scope.courseImgs);
	        }).error(function(){
	        	console.log("失败");
	        });	
	    
	    $scope.getCourseId = function (index,index2){
        $scope.currentId = index;
        console.log($scope.currentId);
        $scope.vncOrNotebook = index2;
        console.log($scope.vncOrNotebook);
        $scope.storage.setItem("courseIdInfo",$scope.currentId);
        // 课程所属的实验环境是vnv还是notebook
        $scope.storage.setItem("vncOrNotebook",$scope.vncOrNotebook);
        // $scope.$broadcast('aacourseDetailsCtrl',$scope.currentId);
        // $scope.$watch('currentId',function(){
        //     console.log('监听',$scope.currentId);
        // },true);
        // 将点击事件获取的课程id信息传递给父控制器，以便之后传递给控制模块的子控制器
        // $scope.$emit("courseIdInfo",$scope.currentId);
        $state.go('app.courseDetails');
    }

    }]);
