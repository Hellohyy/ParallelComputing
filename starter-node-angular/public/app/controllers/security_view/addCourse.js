'use strict';

app
    .controller('myCourseCtrl', [
        '$rootScope', '$scope', '$http', '$window', '$state','$parse','fileReader', function($rootScope, $scope, $http, $window, $state,$parse,fileReader) {

            console.log("myCourse");
    $scope.courseEnv = 1;
    $scope.reader = new FileReader();   //创建一个FileReader接口
    $scope.form = {     //用于绑定提交内容，图片或其他数据
        image:{},
    };
    // $scope.courseName = '';
    // console.log($scope.courseName);
    
    $scope.thumb = {};      //用于存放图片的base64
    $scope.thumb_default = {    //用于循环默认的‘加号’添加图片的框
        1111:{}
    };

    $scope.img_upload = function(files) {       //单次提交图片的函数
        // 设置input的disabled属性，只能上传一张课程图片
        console.log(files[0]);
        console.log(files[0].name);
        // 将上传的图片名称广播至主控制器beyond.js中，方便之后获取传递给数据库
        $scope.$emit("newCoursePicture",files[0].name);
        $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
        $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
        $scope.reader.onload = function(ev) {
            $scope.$apply(function(){
                console.log($scope.thumb);
                console.log($scope.guid);
                $scope.thumb[$scope.guid] = {
                    imgSrc : ev.target.result,  //接收base64
                }
            });
        };
        
        var data = new FormData();      //以下为像后台提交图片数据
        data.append('image', files[0]);
        data.append('guid',$scope.guid);
        // 课程添加驿一张图片后添加文件按钮消失
        document.getElementById('imageFile').style="display:none";
    };
    // 获取图片上传后的图片名称
    $scope.getFile = function(){
        fileReader.readAsDataUrl($scope.image,$scope)
        .then(function(result){
            // 获取图片地址的url方便预览,base64编码 
            console.log(result);
            // 将base64编码直接存在数据库中，减少文件的保存和删除
            $scope.imgSrc = result;
            console.log($scope.image);
            // 当前上传的图片base64编码
            $scope.coursePicture = $scope.imgSrc;
            console.log($scope.coursePicture);
            // 图片名称返回，方便之后对数据库进行更新
            // $scope.newCoursePicture = $scope.image.name;
            // console.log($scope.newCoursePicture);
        });
    };

    $scope.img_del = function(key) {    //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
        var guidArr = [];
        for(var p in $scope.thumb){
            guidArr.push(p);
        }
        delete $scope.thumb[guidArr[key]];
        delete $scope.form.image[guidArr[key]];
    };
    var flag = 0;
    console.log("这里是查看上传课程的图片名称:"+ $scope.sendCourseImgName);
    $scope.submit_form = function(){    //图片选择完毕后的提交，这个提交并没有提交前面的图片数据，只是提交用户操作完毕后
    // 设置函数：用户点击之后关闭提示框
    $scope.closeModal = function(){
        $scope.courseInputAlert.className = "modal hide";
            // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
            // $window.location.reload();
    }
        $scope.newCourse = {
        	"courseName":$scope.courseName,
        	"courseIntro":$scope.courseIntro,
        	"courseEnv":$scope.courseEnv,
        	"courseTeacher":$scope.storage.id,
            "coursePicture":$scope.coursePicture
        }
        console.log($scope.newCourse.coursePicture);
        // 当当前的用户为管理员时，需设置一个isGonggong的字段，方便数据库中isGonggong字段的写入
        if($scope.storage.authority == 1){
            // 当前用户为教师时,标签设为0
            $scope.newCourse.gongGongFlag = 0;
        }
        if($scope.storage.authority == 2){
            // 当前用户为管理员身份，课程为公共课程，标签设置为1
            $scope.newCourse.gongGongFlag = 1;
        }
        // 提醒用户是否确定执行相关的确定操作的模态框
        $scope.courseInputAlert = document.getElementById("courseInputModal");
        console.log(typeof($scope.newCoursePicture));
        // 一旦有一项课程数据不完全，提示教师重新填写课程信息
        // console.log(typeof($scope.newCourse.courseNum));
        if($scope.newCourse.courseName == null){
        	// alert("课程名称未填写！请重新设置");
            // 提示框显示
            $scope.courseInputAlert.className = "modal show";
        }else if($scope.newCourse.courseIntro == null){
        	// alert("课程简介未填写！请重新设置");
            // 提示框显示
            $scope.courseInputAlert.className = "modal show";
        }else if($scope.newCourse.coursePicture == null){
            // alert("课程图片未选择！请重新设置");
            // 提示框显示
            $scope.courseInputAlert.className = "modal show";
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
                console.log("取消课程添加");
            }

            // 设置函数：用户点击确定按钮
            $scope.confirmAddCourse = function(){
                $scope.confirmAddModal.className = "modal hide";
                // 赋值choice变量，以便执行更新操作
                // $scope.choice = true;
                // flag = 1;
                // 确定执行删除课程操作
                // console.log($scope.choice);
                // console.log(flag);
                // 将课程名广播至主控制器，方便课程图片上传时匹配到对应的课程
                $scope.$emit("newCourseName",$scope.courseName);
                console.log($scope.courseName);
                console.log($scope.newCourse);
                console.log(typeof($scope.newCourse));     
                    $http({
                        method: 'post',
                        url: '/api/submitAddCourse',
                        data:{newCourse:$scope.newCourse,newCourseName:$scope.newCourseName}
                    }).success(function(data) {
                        // 当返回data为success时代表，新课程添加成功
                        if(data == "success"){
                            console.log("课程添加成功");
                            $scope.addSuccessModal = document.getElementById("addSuccess");
                            $scope.addSuccessModal.className = "modal show";
                            $scope.closeModal = function(){
                                $scope.addSuccessModal.className = "modal hide";
                                // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                                $window.location.reload();
                            }
                            // 课程添加成功后刷新当前页面
                            // alert("新课程添加成功!");
                            // $window.location.reload();
                            
                            // 课程内容添加完成后，跳转至课程封面图片添加页面
                            // $state.go('app.experimentalDuty');

                        }else if(data =="sameCourse"){
                            // 根据返回的结果可知该课程名已经存在，避免冲突，提醒老师重新设置课程名
                            alert("该课程名已经存在。请设置其他课程名");

                        }
                        // console.log(data); 
                    })
            }
        }
         
        // if($scope.choice == true && flag == 1){
            
               
        // }else{
        //     // $window.location.reload();
        //     console.log("取消课程添加");
        // }

    
   
    };

        }
    ]);