'use strict';
app.controller('teacherListCtrl', ['$rootScope', '$scope', '$http', '$state','$location','$window',
	function($rootScope, $scope, $http, $state,$location,$window) {
//点击教师人数获取教师名单
        $http.get('getTeacherList').then(function(response){
            console.log(response.data);
            $scope.teachers=response.data.teachers;
            console.log($scope.teachers);
        });
        $
        $scope.backward=function(){
    	console.log("返回首页按钮");
    	$state.go('app.homePage');
		}
		// 查看教师详情
		$scope.chosingTeacherName=function(index){
			//console.log("获取老师课程信息按钮");
			console.log(index);
			$scope.chosingTeacherName = index;
			//console.log($scope.chosingTeacherInfo);
			$scope.storage.setItem("teacherName",$scope.chosingTeacherName);
			//console.log($scope.storage.teacherAuth);
			$state.go('app.teacherDetails');
		}
		// 删除某个老师
		$scope.deleteTeacher = function(index){
			console.log(index);
			$scope.teacherId = index;
			$http.post('/api/deleteTeacher',{
				teacherId:$scope.teacherId
			}).then(function(response){
				console.log(response);
				// 删除成功后刷新页面
				if(response.data == "success"){
					console.log("成功");
					$window.location.reload();
				}else{
					console.log("失败");
				}
			})
		}
		// 添加新老师
		$scope.addTeacherButton=function(){
			$state.go('app.addTeacher');
		}
    }]);