'use strict';
app.controller('addStudentCtrl', ['$rootScope', '$scope', '$http', '$state','$location','$window',
	function($rootScope, $scope, $http, $state,$location,$window) {
		// $scope.addMode = 0;
		// console.log($scope.addMode);
		// $scope.userIdentity=0;
		// $scope.addMode= 0;

		// //选择添加老师或者是学生
		// $scope.choiceUser = function(userIdentity) {
  //   		$scope.userIdentity = userIdentity;
  // 		}
  // 		//选择学生添加方式是按班级添加还是单人添加
		// $scope.choicemode = function(addMode) {
  //   		$scope.addMode = addMode;
  //   		// console.log($scope.addMode);
  // 		}
    //按个人添加学生
    var flag = 0;
    $scope.addStudents = function(){
  		$scope.newStudent = {
  			"studentId":$scope.studentId,
        "studentName":$scope.studentName,
        "className":$scope.storage.classname,
      	"studentGen":$scope.studentGen,
      	"studentMajor":$scope.studentMajor,
      	"studentApartment":$scope.studentApartment
        }
        if($scope.newStudent.studentId== null){
            alert("学生学号未填写！请重新设置");
        }else if($scope.newStudent.studentName == null){
            alert("学生姓名未填写！请重新设置");
        }else if($scope.newStudent.studentGen == null){
            alert("学生性别未填写！请重新设置");
        }else if ($scope.newStudent.studentMajor == null) {
            alert("学生专业未填写！请重新设置");
        }else if ($scope.newStudent.studentApartment == null){
            alert("学生学院未填写！请重新设置");班级
        }else{
            $scope.choice = confirm('确定添加该学生到'+$scope.newStudent.className+'班级吗？');
            flag = 1;
        }
        if($scope.choice == true && flag == 1){
             // 将课程名广播至主控制器，方便课程图片上传时匹配到对应的课程
            //$scope.$emit("newClassName",$scope.className);
            // console.log("111111");
            // console.log($scope.className);
            // console.log($scope.newClass);
            //console.log(typeof($scope.newClass));
            $http({
                method:'post',
                url:'/api/addStudent',
                data:{'student':$scope.newStudent}
            }).success(function(data){
                console.log('right');
            });
        //console.log($scope.newstudent.className);
        $state.go('app.classDetails');
        }else{
            // $window.location.reload();
            console.log("取消学生添加");
        }
    };
		// $scope.newUser = {
		// 	"userIdentity":$scope.userIdentity
  //       }
  //       $scope.storage.setItem("userIdentity",$scope.userIdentity);
  //       // $scope.newUser.addMode = $scope.addMode;
  //       $scope.newUser1 = {
  //       	"addmode":$scope.addMode
  //       }
  //       $scope.storage.setItem("addmode",$scope.addMode);
  //       console.log($scope.storage.addmode);
		 }]);