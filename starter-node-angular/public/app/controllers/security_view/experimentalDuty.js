'use strict';

app.controller('experimentalDutyCtrl', [
        //'$rootScope',  '$scope','$http', '$state', '$localStorage', '$timeout', '$window',
        //function ($rootScope, $scope, $http, $state, $localStorage, $timeout, $window) {
    '$rootScope',  '$scope','$http', '$state', '$sessionStorage', '$timeout', '$window',
    function ($rootScope, $scope, $http, $state, $SessionStorage, $timeout, $window) {
    console.log("experimentalDuty");
    // $window.location.reload();
    // document.getElementById("aaa").title.style="font-size:20px";
    // console.log(document.getElementById("aaa").title.style);
    // 当点击课程添加按钮之后，跳转至课程添加页面
    $scope.addCourseButton = function(){
        console.log("添加课程按钮");
        $state.go('app.addCourse');
    }
    $scope.courseImgs = [];
    $scope.aaaFlag = '';
    // 设置函数：用户点击之后关闭提示框
    $scope.closeModal = function(){
        $scope.modalId.className = "modal hide";
        // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
        $window.location.reload();
    }
    
    // 如果当前用户为学生，则直接从数据库中读取课程的数据信息，如果是教师则从自己的课程表中读取课程信息
    if($scope.storage.authority == 0){
        // 如果是学生直接从数据库中读取课程信息
        //从数据库中获取关于课程的数据
        $http.get('/api/getCourse').then(function(response){
            if(response.status == 200){
                console.log(response);
                //从后台获取的数据
                $scope.courseImgs = response.data.course;
                $scope.stuCourseImgs = [];
                var m = 0;
                for(var j = 0; j < $scope.courseImgs.length; j ++){
                    // console.log($scope.courseImgs[j]);
                    if($scope.courseImgs[j].hideShow == 1){
                        $scope.stuCourseImgs[m] = $scope.courseImgs[j];
                        m += 1;
                    }
                }
                console.log($scope.stuCourseImgs);
                // 当前学生身份看到的课程数目，以及实验：可见hideShow与hideShowExp为1
                $scope.stuCourseNum = $scope.stuCourseImgs.length;
                // 学生身份每门课程下包含的实验数目查询
                $http({
                    url:'/api/getAllCourseNumber',
                    method:'POST',
                    data:{teacherInfo:$scope.stuCourseImgs}
                }).success(function(response){
                    console.log(response);
                    // 当只有一个课程时
                    if($scope.stuCourseImgs.length == 1){
                        $scope.stuCourseImgs[0].expNumber = response.allExperience.length;
                    }else{
                        // 当有多个课程时
                        // 将返回的每个课程下的所有实验分别存入数组中
                        $scope.expNumber = [];
                        for(var i = 0;i < response.allExperience.length;i ++){
                            // $scope.expNumber[i] = response.allExperience[i];
                            $scope.stuCourseImgs[i].expNumber = response.allExperience[i].length;
                            console.log( $scope.stuCourseImgs[i].expNumber);
                        }
                    }
                    
                    
                }).error(function(){
                    console.log("实验数目失败");
                    
                });
            }
            else{
                console.log(response.status);
            }
        });
    }else if($scope.storage.authority == 1){
        //如果是老师身份从自己对应的课程表中读取课程信息
        $http({
            url:'/api/getTeacherCourse',
            method:'POST',
            data:{teacherName:$scope.storage.id}
        }).success(function(response){
            console.log(response);
            // 返回的所有的课程
            $scope.courseImgs = response.teacherCourse;
            console.log($scope.courseImgs.length);
            // 老师身份每门课程下包含的实验数目查询
            $http({
                url:'/api/getCourseNumber',
                method:'POST',
                data:{teacherInfo:$scope.courseImgs}
            }).success(function(response){
                console.log(response.experience.length);
                // 当只有一个课程时
                if($scope.courseImgs.length == 1){
                    $scope.courseImgs[0].expNumber = response.experience.length;
                }else{
                    // 当有多个课程时
                    // 将返回的每个课程下的所有实验分别存入数组中
                    $scope.expNumber = [];
                    for(var i = 0;i < response.experience.length;i ++){
                        console.log(response.experience[i]);
                        $scope.expNumber[i] = response.experience[i];
                        $scope.courseImgs[i].expNumber = response.experience[i].length;
                        console.log( $scope.courseImgs[i].expNumber);
                    }
                }
                
                
            }).error(function(){
                console.log("实验数目失败");
                
            });
            
            $scope.count = 0;
            var i = 0;
            // 隐藏当前课程内容
            $scope.hideCourse = function(index){
                // 当前需要隐藏的课程ID号
                $scope.currentHideId = index;
                // 找出当前被点击的课程的标号
                for(i = 0; i < $scope.courseImgs.length; i ++){
                        if($scope.courseImgs[i].courseId == $scope.currentHideId){
                            // console.log(i); 
                            break;
                        }
                    }
                // 记录当前图标的样式
                $scope.logo = document.getElementById('courseDiv').getElementsByTagName('img')[5*i].src;
                console.log($scope.logo);
                // 记录当前课程图片是否可见;赋值imgStyle不起作用？？
                // $scope.imgStyle = document.getElementById('courseDiv').getElementsByTagName('img')[5*i+2].style;
                // if($scope.logo.match('hide_128px_1143820_easyicon.net.ico')){
                //     console.log("当前图标为隐藏");
                //     // 当前的图标为隐藏按钮时需要设置为恢复按钮
                //     document.getElementById('courseDiv').getElementsByTagName('img')[5*i].src = "assets/img/avatars/show.ico";
                //     document.getElementById('courseDiv').getElementsByTagName('img')[5*i+2].style = "display:none";
                // }else{
                //     // 当前的图标为恢复按钮时需要设置为隐藏按钮
                //    document.getElementById('courseDiv').getElementsByTagName('img')[5*i].src = "assets/img/avatars/hide.ico";
                //    document.getElementById('courseDiv').getElementsByTagName('img')[5*i+2].style = "display";
                // }
                
                // console.log(index);
                // 对课程表中的hideShow字段进行更新：由显示状态更新为隐藏状态（默认值为1代表显示；进行隐藏，设值为0）
                $http({
                    url:'/api/updateCouHideShow',
                    method:'POST',
                    data:{updateId:$scope.currentHideId}
                }).success(function(response){
                    console.log(response);
                    // 从后台获取到的隐藏还是显示的按钮图片路径
                    $scope.courseImgs[i].hideLogo = response.logo[0].hideLogo;
                    $scope.courseImgs[i].hideShow = response.logo[0].hideShow;
                    console.log($scope.courseImgs[i].hideLogo);
                   
                    if(response == "failed"){
                        console.log("这里更新数据库不成功");
                        $scope.modalId = document.getElementById("updateCouHideShowFail");
                        $scope.modalId.className = "modal show";
                        // alert("更新隐藏显示失败！");
                   
                    }else{
                        console.log("更新成功");
                        // alert("更新成功！");
                        // $("#hideFlag").data("toggle","modal");
                        // $("#hideFlag").data("target","#abc");
                        // $("#hideFlag").data("show",true);
                        // $scope.bbbb = $("#hideFlag").data();
                        $scope.modalId = document.getElementById("updateCouHideShowModal");
                        $scope.modalId.className = "modal show";
                        // $scope.aaaa = ($("#updateCouHideShowModal").attr("class"));
                        // console.log($scope.modalId.className);
                        console.log($scope.bbbb);
                        
                        // console.log($("#hideFlag").attr("target"));
                        
                        // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                    }
                    
                }).error(function(){
                    console.log("失败");
                    alert("连接失败!");
                });

            }
            //删除当前课程内容
            $scope.deleteCourse = function(index){
                // alert("1234");
                $scope.currentId = index;
                // 提醒用户是否确定执行相关的确定操作的模态框
                $scope.confirmModal = document.getElementById("confirmModal");
                // 提示框显示
                $scope.confirmModal.className = "modal show";
                // $scope.choice = window.confirm('确定删除该课程？');
                // 设置函数：用户点击取消按钮,隐藏模态框
                $scope.closeConfirm = function(){
                    $scope.confirmModal.className = "modal hide";
                    // $scope.choice = 0;
                }

                // 设置函数：用户点击确定按钮
                $scope.confirmDel = function(){
                    $scope.confirmModal.className = "modal hide";
                    // 赋值choice变量，以便执行更新操作
                    // 确定执行删除课程操作
                    // 删除课程,courseTable表中的对应课程删除，mouduleTable表中的模块属于该课程的也都被删除
                    $http({
                        url:'/api/deleteCourse',
                        method:'POST',
                        data:{deleteCourseId:$scope.currentId}
                    }).success(function(response){
                        console.log("更新成功");
                        // 更新成功提示框
                        $scope.modalId = document.getElementById("updateCouHideShowModal");
                        $scope.modalId.className = "modal show";
                        // alert("课程删除成功！");
                        // 删除成功后重新加载页面
                        // $window.location.reload();
                    }).error(function(){
                        console.log("失败");
                        // 更新失败：课程删除失败
                        $scope.modalId = document.getElementById("updateCouHideShowFail");
                        $scope.modalId.className = "modal show";
                    });
                }
            }

            // 老师身份修改课程内容:课程名称、课程简介等信息
            $scope.updCourse = function(index){
                // console.log(index);
                $scope.updCourseId = index;
                $scope.storage.setItem("updCourseId",$scope.updCourseId);
                $state.go('app.updCourse');
            }
        }).error(function(){
            console.log("读取教师信息失败");
        });
    }else if($scope.storage.authority == 2){
        //如果是教学管理员身份从所有老师的课程表中读取课程信息
        $http({
            url:'/api/getTeacherCourses',
            method:'POST',
            data:{teacherId:$scope.storage.id}
            }).success(function(response){
                console.log(response);
                // 返回的所有的课程
                $scope.courseImgs = response.teacherCourses;
                console.log($scope.courseImgs.length);
                // 老师身份每门课程下包含的实验数目查询
                $http({
                    url:'/api/getCoursesNumber',
                    method:'POST',
                    data:{teacherInfo:$scope.courseImgs}
                }).success(function(response){
                    console.log(response);
                    // 当只有一个课程时
                    if($scope.courseImgs.length == 1){
                        $scope.courseImgs[0].expNumber = response.experience.length;
                    }else{
                        // 当有多个课程时
                        // 将返回的每个课程下的所有实验分别存入数组中
                        $scope.expNumber = new Array();
                        for(var i = 0;i < response.experience.length;i ++){
                            // $scope.courseImgs[i] = new Array();
                            // $scope.expNumber[i] = response.experience[i];
                            $scope.courseImgs[i].expNumber = response.experience[i].length;
                            console.log(response.experience[i].length);
                            console.log($scope.courseImgs[i].expNumber);
                        }
                    }
                    
                    
                }).error(function(){
                    console.log("实验数目失败");
                    
                });
            
            
                $scope.count = 0;
                var i = 0;
                // 隐藏当前课程内容
                $scope.hideCourse = function(index){
                    // 当前需要隐藏的课程ID号
                    $scope.currentHideId = index;
                    // 找出当前被点击的课程的标号
                    for(i =0; i < $scope.courseImgs.length; i ++){
                            if($scope.courseImgs[i].courseId == $scope.currentHideId){
                                // console.log(i); 
                                break;
                            }
                        }
                    // 记录当前图标的样式
                    $scope.logo = document.getElementById('courseDiv').getElementsByTagName('img')[5*i].src;
                    console.log($scope.logo);
                    // 记录当前课程图片是否可见;赋值imgStyle不起作用？？
                    // $scope.imgStyle = document.getElementById('courseDiv').getElementsByTagName('img')[5*i+2].style;
                    // if($scope.logo.match('hide_128px_1143820_easyicon.net.ico')){
                    //     console.log("当前图标为隐藏");
                    //     // 当前的图标为隐藏按钮时需要设置为恢复按钮
                    //     document.getElementById('courseDiv').getElementsByTagName('img')[5*i].src = "assets/img/avatars/show.ico";
                    //     document.getElementById('courseDiv').getElementsByTagName('img')[5*i+2].style = "display:none";
                    // }else{
                    //     // 当前的图标为恢复按钮时需要设置为隐藏按钮
                    //    document.getElementById('courseDiv').getElementsByTagName('img')[5*i].src = "assets/img/avatars/hide.ico";
                    //    document.getElementById('courseDiv').getElementsByTagName('img')[5*i+2].style = "display";
                    // }
                    
                    // console.log(index);
                    // 对课程表中的hideShow字段进行更新：由显示状态更新为隐藏状态（默认值为1代表显示；进行隐藏，设值为0）
                    $http({
                        url:'/api/updateCouHideShow',
                        method:'POST',
                        data:{updateId:$scope.currentHideId}
                    }).success(function(response){
                        console.log(response);
                        // 从后台获取到的隐藏还是显示的按钮图片路径
                        $scope.courseImgs[i].hideLogo = response.logo[0].hideLogo;
                        $scope.courseImgs[i].hideShow = response.logo[0].hideShow;
                        console.log($scope.courseImgs[i].hideLogo);
                        if(response == "failed"){
                            console.log("这里更新数据库不成功");
                            $scope.modalId = document.getElementById("updateCouHideShowFail");
                            $scope.modalId.className = "modal show";
                            // alert("更新隐藏显示失败！");
                       
                        }else{
                            console.log("更新成功");
                            // 更新成功提示框
                            $scope.modalId = document.getElementById("updateCouHideShowModal");
                            $scope.modalId.className = "modal show";
                            // alert("更新成功！");
                            // $window.location.reload();
                            // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                        }
                        
                    }).error(function(){
                        console.log("失败");
                        alert("连接失败!");
                    });

                }
            
            }).error(function(){
                console.log("读取教师信息失败");
            });
    }

    //鼠标点击的课程ID
    $scope.currentId = "";
    //获取课程ID的函数
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