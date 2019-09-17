'use strict';

app.controller('studentListCtrl', [
    '$rootScope',  '$scope','$http', '$state', '$sessionStorage', '$timeout', '$window',
    function ($rootScope, $scope, $http, $state, $SessionStorage, $timeout, $window) {
    console.log("学生名单");
    // 当前老师的所有课程id号
    $scope.currentCourseIds = [];
    // 传递到后台的参数：当前选中的课程id
    $scope.paramCourseId = 0;
    // 标记当前显示的课程id的下标
    $scope.idFlag = 0;
    // 获取到的班级、学生信息
    $scope.classStudents = [];
    $scope.studentNames = [];
    $scope.classNames = [];
    var flag = 0;
    $scope.SameClassName = [];
    // 存储班级名称
    $scope.classes = [];
    // 需要删除的班级id
    $scope.className = [];
    // 需要删除的学生id
    $scope.studentName = [];
    // 即将被删除的学生所属的班级id
    $scope.belongClass = []
    // 保存该教师的课程名称
    $scope.courseNames = [];
    // 保存所有班级信息
    $scope.classesInformation = [];
    // 选中的新增的班级
    $scope.newSelectedClass = [];
    // 新增班级的下标
    $scope.classFlag = 0;
    // 选中的学生
    $scope.newSelectedStudent = [];
    // 课程名称
    $scope.currentName = '';
    // 课程简介
    $scope.currentIntro = '';
    $scope.w = $("#www").data();
    console.log($scope.w);
     // 设置函数：该课程下没有班级和学生信息，用户点击关闭提示框
    $scope.closeModal = function(){
        $scope.modalCouCla.className = "modal hide";
        // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
        // $window.location.reload();
    }
    // 获取当前教师下的所有课程
    $http({
        url:'/api/getCourseList',
        method:'POST',
        data:{teacherName:$scope.storage.id}
    }).success(function(response){
        console.log(response);
        $scope.courseNames = response.courses;
        // 保存课程信息
        console.log($scope.courseNames);
        // 默认显示的是第一个课程的名称
        $scope.currentName = $scope.courseNames[0].courseName;
        $scope.currentIntro = $scope.courseNames[0].courseIntro;
        // 将各个课程id号存储在currentCourseId的数组中
        for(var i =0; i < $scope.courseNames.length; i ++){
            $scope.currentCourseIds[i] = $scope.courseNames[i].courseId;
        }
        console.log($scope.currentCourseIds);

        // 设置从数据库读取班级信息学生信息的函数
        $scope.getCouClaStu = function(index){
            console.log(index);
            // 必须在函数内定义，定义为局部变量，不然上一次课程生成的临时变量一直存在
            // id号的临时存储
            $scope.classIdTemp = [];
            $scope.studentTemp = [];
            $scope.courseTemp = [];
            $scope.stuFlag = 0;
            // 每个课程下班级个数的统计
            $scope.classCount = [];
            // 获取某课程下的全部班级学生信息
            $scope.couClaStu = [];
            // 所有信息统计
            $scope.informationStudents = new Array();
            // 全部信息的标记
            var infoFlag = 0;
            var infoFlag2 = 0;
            
            // 学生名称存储
            $scope.stuNames = [];
            $scope.claNames = [];
            // 获取课程对应的班级和学生信息
            // 默认从数据库中读取当前的课程中的班级信息
            $http({
                url:'/api/getCouClaStu',
                method:'POST',
                data:{paramId:index}
            }).success(function(response){
                console.log(response.couClaStu);
                console.log(response.couClaStu);
                $scope.classCount = response.couClaStu[0];
                $scope.couClaStu = response.couClaStu[1];
                console.log($scope.classCount);
                console.log($scope.couClaStu);
                for(var i = 0; i < $scope.couClaStu.length; i ++){
                    // 学生id临时存放
                    $scope.studentTemp[i] = $scope.couClaStu[i].studentId;
                }
                for(var i = 0; i < $scope.classCount.length; i ++){
                    // 将班级id临时存储到数组中
                    $scope.classIdTemp[i] = $scope.classCount[i].classId;
                }
                console.log($scope.classIdTemp);
                console.log($scope.studentTemp);
                // 当课程下对应的有班级或者学生的时候，查数据库找到对应的名称信息
                if($scope.studentTemp.length != 0 || $scope.classIdTemp.length != 0){

                    // 根据id号找到对应的名称信息：班级名、学生名
                    $http({
                        url:'/api/getCouClaStuName',
                        method:'POST',
                        data:{stuId:$scope.studentTemp,claId:$scope.classIdTemp}
                    }).success(function(response){
                        console.log("返回名称信息");
                        console.log(response);
                        // response.couClaStuName的长度为1，代表只有学生名称信息的返回，如果长度为2，代表班级名称也存在
                        if(response.couClaStuName.length == 1){
                            $scope.stuNames = response.couClaStuName[0];
                        }else{
                            $scope.stuNames = response.couClaStuName[0];
                            $scope.claNames = response.couClaStuName[1];
                        }
                        for(var i = 0; i < $scope.classCount.length; i ++){ 
                            // 二维数组定义
                            $scope.informationStudents[i] = new Array();
                           
                            // 统计每个班级下的学生，没有班级的同学统计到一起
                            for(var j = 0; j < $scope.couClaStu.length; j ++){
                                // 声明班级名称、学生名称
                                $scope.couClaStu[j].studentNames = '';
                                $scope.couClaStu[j].classname = '';
                                // 为每个学生id匹配查询到的名称信息
                                for(var m = 0; m < $scope.stuNames.length; m ++){
                                    if($scope.stuNames[m].userId == $scope.couClaStu[j].studentId){
                                        $scope.couClaStu[j].studentNames = $scope.stuNames[m].userName;
                                    }
                                }
                                // 在存放班级名称的数组中找到与当前班级id一样的，将班级id和班级名称存储到一起
                                for(var k = 0; k < $scope.claNames.length; k ++){
                                    if($scope.claNames[k].classID == $scope.couClaStu[j].classId){
                                        // 增加班级名称
                                        $scope.couClaStu[j].classname = $scope.claNames[k].classname;
                                    }
                                }
                                if($scope.couClaStu[j].classname == '' && $scope.couClaStu[j].classId == null){
                                    // 当前班级没有对应的班级名称时，班级id为null，说明是一类选修的学生组成的集合，没有固定的班级
                                    $scope.couClaStu[j].classname = '公选';
                                }
                                // 将couClaStu中的某些个相同班级的统计到一起
                                if($scope.couClaStu[j].classId == $scope.classCount[i].classId){
                                    $scope.informationStudents[i][infoFlag2] = $scope.couClaStu[j];
                                    infoFlag2 += 1;

                                }else{
                                    console.log("不相等跳过");
                                }
                            }
                            
                            console.log($scope.informationStudents[i]);     
                            // 将下标移动到新的起点
                            infoFlag2 = 0;          
                        }

                        // 保存所有班级和课程以及学生之间对应的id关系
                        console.log("输出所有班级的学生");
                        console.log($scope.informationStudents);
                        if($scope.informationStudents){
                            $('#classStuInfo').show();
                         // 从后台传递过来的数据有：关于每个班级id下对应的学生个数；关于班级和学生的详细id记录
                        }else{
                            $('#classStuInfo').hide();
                        }
                        // $scope.studentNames = $scope.informationStudents;
                    }).error(function(){
                        console.log(response);
                    })
                }else{
                    // 该课程下没有班级或者学生
                    // alert("该课程下没有班级和学生");
                    $('#classStuInfo').hide();
                    // alert("该课程暂未有班级信息！");
                    $scope.modalCouCla = document.getElementById("courseClassAlertModal");
                    $scope.modalCouCla.className = "modal show";
                }
                // 删除学生按钮功能，老师选取一个或多个学生，然后点击删除按钮，进行删除操作
                $scope.deleteStudent = function(){
                    console.log("删除函数");
                    // 复选框
                    // 需要增加class属性，不然获取不到值
                    // $scope.obj1 = document.getElementById("className").getElementsByTagName("input");
                    // $scope.obj2 = document.getElementById("studentName").getElementsByTagName("input");
                    $scope.obj = document.getElementsByTagName("input");
                    console.log($scope.obj);
                    
                    // 依次找到被选中的班级，并将这些班级存储在className中
                    for(var i = 0; i < $scope.obj.length; i ++){
                        if($scope.obj[i].checked){
                            if($scope.obj[i].getAttribute("class") == "class"){
                                if($scope.obj[i].value == ''){
                                    console.log("公选课没有班级");
                                    // alert("公选课的学生不能进行统一删除操作,请针对特定学生进行删除！");
                                    $scope.modalCouCla = document.getElementById("courseClassDelModal");
                                    $scope.modalCouCla.className = "modal show";
                                }else{
                                    console.log("班级名");
                                    //即将被删除的班级id
                                    console.log($scope.obj[i].value);
                                    $scope.className.push($scope.obj[i].value);
                                }
                                
                            }
                            if($scope.obj[i].getAttribute("class") == "student"){
                                console.log("学生名");
                                // 获取input节点的父节点label的value值，该值为学生所属的班级id
                                console.log($scope.obj[i].parentNode.getAttribute("value"));
                                // 将学生所属的班级id与学生对应的存到数组中，一一对应
                                $scope.belongClass.push($scope.obj[i].parentNode.getAttribute("value"))
                                // 即将被删除的学生id
                                $scope.studentName.push($scope.obj[i].value);

                            }
                        }
                    }

                    // 将需要删除的数据全部存到delete中
                    $scope.delete = {
                        classId: $scope.className,
                        studentId: $scope.studentName,
                        belongClassId: $scope.belongClass,
                        paramCourseId: $scope.paramCourseId
                    };
                    console.log($scope.delete);
                    // 当未选择任何班级或学生的时候，提醒用户重新选择
                    if($scope.className.length ==0 && $scope.studentName.length == 0 && $scope.belongClass.length == 0){
                        // alert("未选择需要删除的班级或学生，请选择！");
                        $scope.modalCouCla = document.getElementById("courseClassNoneDelModal");
                        $scope.modalCouCla.className = "modal show";
                    }else{
                        // $scope.choice = confirm("确定删除这些班级或学生？删除后无法恢复！");
                        // 提醒用户是否确定执行相关的确定操作的模态框
                        $scope.confirmCouClaModal = document.getElementById("confirmCouClaModal");
                        // 提示框显示
                        $scope.confirmCouClaModal.className = "modal show";
                        // $scope.choice = window.confirm('确定删除该课程？');
                        // 设置函数：用户点击取消按钮,隐藏模态框
                        $scope.closeConfirm = function(){
                            $scope.confirmCouClaModal.className = "modal hide";
                            // $scope.choice = 0;
                        }
                        // 设置函数：用户点击确定按钮
                        $scope.confirmCouClaDel = function(){
                            $scope.confirmCouClaModal.className = "modal hide";
                             // 进行数据库的删除操作
                            $http({
                                url:'/api/deleteClassStudent',
                                method:'POST',
                                data:{delete:$scope.delete}
                            }).success(function(response){
                                console.log(response);
                                if(response == "success"){
                                    // 返回成功
                                    console.log("删除成功");
                                    // 课程删除成功后刷新页面
                                    $window.location.reload();
                                }else{
                                    console.log("删除失败");
                                }
                                
                            }).error(function(){
                                console.log("删除失败");
                            });
                        }
                        // if($scope.choice == true){
                        //     console.log("确定删除");
                           

                        // }else{
                        //     console.log("取消删除");
                        // }

                    }
                
                }

            }).error(function(){
               console.log(response);
            })
        }
        // 获取所有的班级信息，加载该页面时就已经获取所有班级的信息
        $http({
            url:'/api/getAllClass',
            method:'GET'
        }).success(function(response){
            // 获取所有班级
            console.log("所有班级信息");
            console.log(response.allClass);
            // 将班级信息存储在classesInformation中
            $scope.classesInformation = response.allClass;
            // 新增班级按钮功能的实现：将选中的班级添加到当前的课程下
            $scope.addNewClass = function(){
                
                // 当前的课程id
                console.log($scope.paramCourseId);
                $scope.selectedClass = document.getElementsByTagName("input");
                console.log($scope.selectedClass);

                for(var i = 0; i < $scope.selectedClass.length; i ++){
                    if($scope.selectedClass[i].checked){
                       if($scope.selectedClass[i].getAttribute("class") == "classID"){
                            console.log($scope.selectedClass[i].parentNode.getAttribute("value"));
                            // 找到class属性值为classID的值，即为需要添加到课程的班级id
                            $scope.newSelectedClass[$scope.classFlag] = $scope.selectedClass[i].parentNode.getAttribute("value");
                            $scope.classFlag += 1; 
                        } 
                    }
                    
                }
                // 设置函数：用户点击取消按钮,隐藏模态框
                $scope.closeConfirm = function(){
                    $scope.modalCouCla.className = "modal hide";
                    // $scope.choice = 0;
                }
                // 当前所有选中的班级id号
                console.log($scope.newSelectedClass);
                // 未选择任何班级点击确定按钮时，弹出提醒框
                if($scope.newSelectedClass.length == 0){
                    // alert("未选择班级！请重新选择班级");
                    $scope.modalCouCla = document.getElementById("courseClassNoneDelModal");
                    $scope.modalCouCla.className = "modal show";
                     // 设置函数：该课程下没有班级和学生信息，用户点击关闭提示框
                    $scope.closeModal = function(){
                        $scope.modalCouCla.className = "modal hide";
                        // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                        // $window.location.reload();
                    }
                }else{
                    // 选择班级后进行数据库的更新
                    // 将课程id和所有选中的班级id分别作为参数传递到后台
                    $http({
                        url:'/api/addNewClass',
                        method:'POST',
                        data:{courseId:$scope.paramCourseId,classIds:$scope.newSelectedClass}
                    }).success(function(response){
                        console.log(response);
                        if(response == "success"){
                            // 课程班级表插入更新成功
                            // alert("新班级添加成功！");
                            // 更新成功提示框
                            // $scope.modalId = document.getElementById("addClaStuModal");
                            // $scope.modalId.className = "modal show";
                            // 刷新页面
                            $window.location.reload();
                        }else{
                            // alert("新班级添加失败！");
                            // 更新失败提示框
                            $scope.modalId = document.getElementById("addClaStuFail");
                            $scope.modalId.className = "modal show";
                            // 设置函数：该课程下没有班级和学生信息，用户点击关闭提示框
                            $scope.closeModal = function(){
                                $scope.modalId.className = "modal hide";
                                // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
                                // $window.location.reload();
                            }
                        }
                    }).error(function(){
                        console.log("失败");
                    })
                }
                
            }

        }).error(function(){
            console.log("失败");
        })
        // 获取所有的学生信息
        $http({
            url:'/api/getAllStudent',
            method:'GET'
        }).success(function(response){
            console.log("所有学生信息");
            // 存储所有的学生名称和id信息
            $scope.allStudents = response.allStudent;
            console.log($scope.allStudents);
            console.log(response.allStudentClass);
            // 将传递到前台的allStudent和allStudentClass建立关联，找到每个学生的对应班级名称
            for(var i = 0; i < $scope.allStudents.length; i ++){
                // 定义班级名称
                $scope.allStudents[i].classname = '';
                for(var j = 0; j < response.allStudentClass.length; j ++){
                    if($scope.allStudents[i].classId == response.allStudentClass[j].classId){
                        // 如果班级id为空，则班级名称也为空，如果班级名称存在，赋值给aStudents下的calssname
                        if(response.allStudentClass[j].length == 0){
                            console.log("没有对应的班级名称");
                        }else{
                            $scope.allStudents[i].classname = response.allStudentClass[j][0].classname;
                        }
                        
                    }
                }
            }
            console.log($scope.allStudents);
            // 新增学生按钮功能的实现：将选中的学生加入到课程下
            $scope.addNewStudent = function(){
                // 当前的课程id
                console.log($scope.paramCourseId);
                // 获取当前被选中的学生
                $scope.selectedStudent = document.getElementsByTagName("input");
                console.log($scope.selectedStudent);
                for(var i= 0; i < $scope.selectedStudent.length; i++){
                    if($scope.selectedStudent[i].checked){
                        if($scope.selectedStudent[i].getAttribute("class") == "selectedStudent"){
                            console.log($scope.selectedStudent[i].parentNode.getAttribute("value"));
                            // 找到class属性为selectedStudent的值，将选中的学生id值添加到课程下
                            $scope.newSelectedStudent[$scope.stuFlag] = $scope.selectedStudent[i].parentNode.getAttribute("value");
                            $scope.stuFlag += 1;
                        }
                    }
                }
                // 设置函数：用户点击取消按钮,隐藏模态框
                $scope.closeConfirm = function(){
                    $scope.modalCouCla.className = "modal hide";
                    // $scope.choice = 0;
                }
                // 选择的学生的id
                console.log($scope.newSelectedStudent);
                if($scope.newSelectedStudent.length == 0){
                    // alert("未选择学生！请重新选择学生");
                    $scope.modalCouCla = document.getElementById("noStudentAlert");
                    $scope.modalCouCla.className = "modal show";
                }else{
                    // 将课程id和选中的学生id传递到后台进行数据库的更新
                    $http({
                        url:'/api/addNewStudent',
                        method:'POST',
                        data:{courseId:$scope.paramCourseId,studentIds:$scope.newSelectedStudent}
                    }).success(function(response){
                        console.log("添加学生成功");
                        // alert("学生添加成功！");
                        // 更新成功提示框
                        // $scope.modalId = document.getElementById("addClaStuModal");
                        // $scope.modalId.className = "modal show";
                        // 添加成功后刷新页面
                        $window.location.reload();
                    }).error(function(){
                        console.log("失败");
                        // 更新失败提示框
                        $scope.modalId = document.getElementById("addClaStuFail");
                        $scope.modalId.className = "modal show";
                    })
                }
            }

        }).error(function(){
            console.log("连接失败");
        })
        $scope.paramCourseId = $scope.currentCourseIds[$scope.idFlag];
        // 执行函数：传递当前的课程id号以获取对应下的班级和学生信息
        $scope.getCouClaStu($scope.paramCourseId);
        // 对课程的左右切换功能
        $scope.DY_scroll = function(prev,next,img){

            // 获取与prev元素紧邻的前一个同胞元素，通过选择器进行筛选
            var prev = $(prev);
            // 获取与next元素紧邻的后一个同胞元素，通过选择器筛选
            var next = $(next);
            // $scope.aaaaa = $(img);
            // console.log("html:"+$scope.aaaaa.html());
            // 获得当前元素集合的每个元素的后代，找到ul元素
            var img = $(img).find('ul');
            var w = img.find('li').outerWidth(true);
            // 默认情况下将第一个课程的id号传入到后台，获取该课程下的班级和学生信息
            $scope.paramCourseId = $scope.currentCourseIds[$scope.idFlag];
            // console.log(img.find('li').val());
            next.click(function(){
                // $scope.currentName = '';
                // 对下标的循环设置
                $scope.idFlag = ($scope.idFlag + 1 + $scope.courseNames.length) % $scope.courseNames.length;
                $scope.paramCourseId = $scope.currentCourseIds[$scope.idFlag];
                console.log($scope.paramCourseId);
                
                // 调用函数获取当前课程下的班级和学生信息
                $scope.getCouClaStu($scope.paramCourseId);
            
                // 动画设置：左移动
                img.animate({'margin-left':-w},function(){
                    // 返回带有被选元素的指定索引号的元素，在其后添加img
                    img.find('li').eq(0).appendTo(img);
                    // css样式设置
                    img.css({'margin-left':0});
                });
                for(var i = 0; i < $scope.courseNames.length; i ++){
                    if($scope.paramCourseId == $scope.courseNames[i].courseId){
                        $scope.currentName = $scope.courseNames[i].courseName;
                        $scope.currentIntro = $scope.courseNames[i].courseIntro;
                    }
                }
            });
            prev.click(function(){
                // $scope.currentName = '';
                $scope.idFlag = ($scope.idFlag + $scope.courseNames.length - 1) % $scope.courseNames.length;
                $scope.paramCourseId = $scope.currentCourseIds[$scope.idFlag];
                console.log($scope.paramCourseId);
                
                // 右移动
                img.animate({'margin-left':0},function(){
                    img.find('li:last').prependTo(img);
                    img.css({'margin-left':-w});
                }); 
                console.log($scope.paramCourseId);
                $scope.getCouClaStu($scope.paramCourseId);
                for(var i = 0; i < $scope.courseNames.length; i ++){
                    if($scope.paramCourseId == $scope.courseNames[i].courseId){
                        $scope.currentName = $scope.courseNames[i].courseName;
                        $scope.currentIntro = $scope.courseNames[i].courseIntro;
                    }
                }
            });
        }
        // 执行课程切换函数
        $scope.DY_scroll('.prev','.next','.img-list');

    }).error(function(){
        console.log("失败");
    });
        
}]);


