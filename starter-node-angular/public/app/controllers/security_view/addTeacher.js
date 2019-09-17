'use strict';
app.controller('addTeacherCtrl', ['$rootScope', '$scope', '$http', '$state','$location','$window','fileReader',
	function($rootScope, $scope, $http, $state,$location,$window,fileReader) {
    //按个人添加学生
    // var flag = 0;
    // $scope.reader = new FileReader();   //创建一个FileReader接口
    // $scope.form = {     //用于绑定提交内容，图片或其他数据
    //     image:{},
    // };
    // // $scope.courseName = '';
    // // console.log($scope.courseName);
    // $scope.thumb = {};      //用于存放图片的base64
    // $scope.thumb_default = {    //用于循环默认的‘加号’添加图片的框
    //     1111:{}
    // };
    // $scope.img_upload = function(files) {       //单次提交图片的函数
    //     // 设置input的disabled属性，只能上传一张课程图片
    //     console.log(files[0]);
    //     console.log(files[0].name);
    //     // 将上传的图片名称广播至主控制器beyond.js中，方便之后获取传递给数据库
    //     $scope.$emit("newTeacherPicture",files[0].name);
    //     $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
    //     $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
    //     $scope.reader.onload = function(ev) {
    //         $scope.$apply(function(){
    //             console.log($scope.thumb);
    //             console.log($scope.guid);
    //             $scope.thumb[$scope.guid] = {
    //                 imgSrc : ev.target.result,  //接收base64
    //             }
    //         });
    //     };
    //     var data = new FormData();      //以下为像后台提交图片数据
    //     data.append('image', files[0]);
    //     data.append('guid',$scope.guid);
    //     // 课程添加驿一张图片后添加文件按钮消失
    //     document.getElementById('imageFile').style="display:none";
    // };
    // $scope.img_del = function(key) {    //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
    //     var guidArr = [];
    //     for(var p in $scope.thumb){
    //         guidArr.push(p);
    //     }
    //     delete $scope.thumb[guidArr[key]];
    //     delete $scope.form.image[guidArr[key]];
    // };
    // var flag = 0;
    //console.log("这里是查看上传课程的图片名称:"+ $scope.sendCourseImgName);
    // 默认设置老师的性别为1即为男
    $scope.teacherGenFlag = "1";
    console.log($scope.teacherGenFlag);
    // $scope.teacherPicture = "";
    // 获取图片上传后的图片名称
    $scope.getFile = function(){
        fileReader.readAsDataUrl($scope.image,$scope)
        .then(function(result){
            // 获取图片地址的url方便预览,base64编码 
            // console.log(result);
            // 将base64编码直接存在数据库中，减少文件的保存和删除
            // 当前上传的图片base64编码
            $scope.teacherPicture = result;
            console.log($scope.teacherPicture);
        });
    };
    $scope.submit_form = function(){
        
        if($scope.teacherGenFlag == 1){
            $scope.teacherGen = "男";
        }else{
            $scope.teacherGen = "女";
        }
        console.log($scope.teacherGen);
        $scope.closeModal = function(){
            $scope.teacherInputAlert.className = "modal hide";
                // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                // $window.location.reload();
        }
  		$scope.newTeacher = {
  			"teacherId":$scope.teacherId,
            "teacherName":$scope.teacherName,
            "teacherTitle":$scope.teacherTitle,
            "teacherGen":$scope.teacherGen,
          	"teacherMajor":$scope.teacherMajor,
          	"teacherApartment":$scope.teacherApartment,
            "teacherPre":$scope.teacherPre,
            "teacherPicture":$scope.teacherPicture
        }
        $scope.teacherInputAlert = document.getElementById("teacherInputModal");
        //console.log(typeof($scope.newTeacherPicture));
        // 一旦有一项课程数据不完全，提示教师重新填写课程信息
        // console.log(typeof($scope.newCourse.courseNum));
        if($scope.newTeacher.teacherId == null){
          $scope.teacherInputAlert.className = "modal show";
        }else if($scope.newTeacher.teacherName == null){
          // alert("课程名称未填写！请重新设置");
            // 提示框显示
            $scope.teacherInputAlert.className = "modal show";
        }else if($scope.newTeacher.teacherPicture == null){
          // alert("课程简介未填写！请重新设置");
            // 提示框显示
            $scope.teacherInputAlert.className = "modal show";
        }//else if($scope.newCoursePicture == null){
            // alert("课程图片未选择！请重新设置");
            // 提示框显示
            //$scope.teacherInputAlert.className = "modal show";}
          else if($scope.newTeacher.teacherMajor == null) {
          $scope.teacherInputAlert.className = "modal show";
        }else if($scope.newTeacher.teacherApartment == null){
          $scope.teacherInputAlert.className = "modal show";
        }else if($scope.newTeacher.teacherPre == null) {
          $scope.teacherInputAlert.className = "modal show";
        }else if($scope.newTeacher.newTeacherPicture == ""){
          $scope.teacherInputAlert.newTeacherPicture = "modal show";
        }else{
            // console.log("000000");
            // 提醒用户是否确定执行相关的确定操作的模态框
            $scope.confirmAddModal = document.getElementById("confirmAdd");
            // 提示框显示
            $scope.confirmAddModal.className = "modal show";
            // $scope.choice = window.confirm('确定删除该课程？');
            // 设置函数：用户点击取消按钮,隐藏模态框
            $scope.closeConfirm = function(){
                $scope.confirmAddModal.className = "modal hide";
                // $scope.choice = 0;
                console.log("取消老师添加");
            }
          $scope.confirmAddTeacher = function(){
            $scope.confirmAddModal.className = "modal hide";
            $http({
                method:'post',
                url:'/api/addTeacher',
                //data:{newTeacher:$scope.newTeacher,newTeacherPicture:$scope.newTeacherPicture}
                data:{newTeacher:$scope.newTeacher}
            }).success(function(data) {
                        // 当返回data为success时代表，新课程添加成功
                        if(data == "success"){
                            console.log("老师添加成功");
                            $scope.addSuccessModal = document.getElementById("addSuccess");
                            $scope.addSuccessModal.className = "modal show";
                            $scope.closeModal = function(){
                                $scope.addSuccessModal.className = "modal hide";
                                // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                                // $window.location.reload();
                                $state.go('app.teacherList');
                            }
                            // 课程添加成功后刷新当前页面
                            // alert("新课程添加成功!");
                            // $window.location.reload();
                            
                            // 课程内容添加完成后，跳转至课程封面图片添加页面
                            // $state.go('app.experimentalDuty');

                        }else if(data =="sameTeacher"){
                            // 根据返回的结果可知该课程名已经存在，避免冲突，提醒老师重新设置课程名
                            alert("该教师已存在");

                        }
                        // console.log(data); 
                    })
    };
		}
  };
		 }]);