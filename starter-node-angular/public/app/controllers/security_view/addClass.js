'use strict';

app
    .controller('addClassCtrl', [
        '$rootScope', '$scope', '$http', '$window', '$state', '$location',function($rootScope, $scope, $http, $window, $state,$location) {
    //console.log("myCourse");
    //$scope.courseEnv = 1;
    $scope.reader = new FileReader();   //创建一个FileReader接口
    $scope.form = {     //用于绑定提交内容，图片或其他数据
        excel:{},
    };
    // $scope.courseName = '';
    // console.log($scope.courseName);
    
    $scope.thumb = {};      //用于存放图片的base64
    $scope.thumb_default = {    //用于循环默认的‘加号’添加图片的框
        1111:{}
    };

    $scope.excel_upload = function(files) {       //单次提交图片的函数
        // 设置input的disabled属性，只能上传一张课程图片
        console.log(files[0]);
        console.log(files[0].name);
        $scope.filename = files[0].name;
        // 将上传的图片名称广播至主控制器beyond.js中，方便之后获取传递给数据库
        $scope.$emit("newClassExcel",files[0].name);
        $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
        $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
        $scope.reader.onload = function(ev) {
            $scope.$apply(function(){
                console.log($scope.thumb);
                console.log($scope.guid);
                $scope.thumb[$scope.guid] = {
                    excelSrc : ev.target.result,  //接收base64
                }
            });
        };
        console.log("000000");
        var data = new FormData();      //以下为向后台提交图片数据
        data.append('excel', files[0]);
        data.append('guid',$scope.guid);
        // 课程添加驿一张图片后添加文件按钮消失
        document.getElementById('excelFile').style="display:none";
        console.log("000000");
    };

    // $scope.excel_del = function(key) {    //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
    //     var guidArr = [];
    //     for(var p in $scope.thumb){
    //         guidArr.push(p);
    //     }
    //     delete $scope.thumb[guidArr[key]];
    //     delete $scope.form.excel[guidArr[key]];
    // };
    var flag = 0;
    //console.log("excel名称:"+ $scope.sendClassExcelName);
    $scope.submit_form = function(){    //图片选择完毕后的提交，这个提交并没有提交前面的图片数据，只是提交用户操作完毕后       
        // 设置函数：用户点击之后关闭提示框
        $scope.closeModal = function(){
            $scope.classInputAlert.className = "modal hide";
                // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                // $window.location.reload();
        }
        $scope.newClass = {
            "className":$scope.className,
            "overall":$scope.overall
        }
        // 提醒用户是否确定执行相关的确定操作的模态框
        $scope.classInputAlert = document.getElementById("classInputModal");
        //console.log("000000");
        //console.log(typeof($scope.newClassExcel));
        // 一旦有一项班级数据不完全，提示管理员重新填写班级信息
        // console.log(typeof($scope.newCourse.courseNum));
        if($scope.newClass.className == null){
            // alert("班级名称未填写！请重新设置");
            // 提示框显示
            $scope.classInputAlert.className = "modal show";
        }else if($scope.newClass.overall == null){
            // alert("班级人数限制未填写！请重新设置");
            // 提示框显示
            $scope.classInputAlert.className = "modal show";
        }else if($scope.newClassExcel == ""){
            // alert("班级名单未选择！请重新设置");
            // 提示框显示
            $scope.classInputAlert.className = "modal show";
        }else{
            $scope.choice = confirm('确定添加该班级？');
            flag = 1;
            
            
        }
        console.log($scope.choice);
         if($scope.choice == true && flag == 1){
             // 将课程名广播至主控制器，方便课程图片上传时匹配到对应的课程
            $scope.$emit("newClassName",$scope.className);
            console.log("111111");
            console.log($scope.className);
            console.log($scope.newClass);
            //console.log(typeof($scope.newClass));
            $http({
                method:'post',
                url:'/api/sddClass',
                data:{'val':$scope.newClass}
            }).success(function(data){
                console.log('right');
                $window.location.reload();
            });
               
        }else{
            // $window.location.reload();
            console.log("取消班级添加");
        }

    
   
    };

        }]);