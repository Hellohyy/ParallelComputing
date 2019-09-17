'use strict';

app
    .controller('addPictureCtrl', [
        '$rootScope', '$scope', '$http', '$window', function($rootScope, $scope, $http, $window) {

            console.log("addPicture");
    $scope.reader = new FileReader();   //创建一个FileReader接口
    $scope.form = {     //用于绑定提交内容，图片或其他数据
        image:{},
    };
    $scope.thumb = {};      //用于存放图片的base64
    $scope.thumb_default = {    //用于循环默认的‘加号’添加图片的框
        1111:{}
    };

    $scope.img_upload = function(files) {       //单次提交图片的函数
        console.log(files[0]);
        console.log(files[0].name);
        // 将上传的图片名称广播至主控制器beyond.js中，方便之后获取传递给数据库
        $scope.$emit("newCoursePicture",files[0].name);
        $scope.guid = (new Date()).valueOf();   //通过时间戳创建一个随机数，作为键名使用
        $scope.reader.readAsDataURL(files[0]);  //FileReader的方法，把图片转成base64
        $scope.reader.onload = function(ev) {
            $scope.$apply(function(){
                $scope.thumb[$scope.guid] = {
                    imgSrc : ev.target.result,  //接收base64
                }
            });
        };
        
        var data = new FormData();      //以下为像后台提交图片数据
        data.append('image', files[0]);
        data.append('guid',$scope.guid);
        // console.log(data);
        // $http({
        //     method: 'post',
        //     url: '/comm/test-upload.php?action=success',
        //     data:data,
        //     headers: {'Content-Type': undefined},
        //     transformRequest: angular.identity
        // }).success(function(data) {
        //     if (data.result_code == 'SUCCESS') {
        //         $scope.form.image[data.guid] = data.result_value;
        //         $scope.thumb[data.guid].status = 'SUCCESS';
        //         console.log($scope.form)
        //     }
        //     if(data.result_code == 'FAIL'){
        //         console.log(data)
        //     }
        // })
    };

    $scope.img_del = function(key) {    //删除，删除的时候thumb和form里面的图片数据都要删除，避免提交不必要的
        var guidArr = [];
        for(var p in $scope.thumb){
            guidArr.push(p);
        }
        delete $scope.thumb[guidArr[key]];
        delete $scope.form.image[guidArr[key]];
    };
    $scope.submit_form2 = function(){    
        // 本次操作是将上传的课程图片名传递到数据库，进行数据库的更新
        // 通过事件监听获取上传的图片的名称
        console.log($scope.newCoursePicture);
        console.log($scope.newCourseName);
        $http({
            method: 'post',
            url: '/api/submitAddPicture',
            data:{newCoursePicture:$scope.newCoursePicture,newCourseName:$scope.newCourseName}
        }).success(function(response){
            console.log("更新成功");
        }).error(function(){
            console.log("更新失败");
        });
             
    };




        }
    ]);