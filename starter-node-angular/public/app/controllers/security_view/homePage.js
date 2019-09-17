'use strict';

app.controller('homePageCtrl', ['$rootScope', '$scope', '$http', '$state','$location','$window', function($rootScope, $scope, $http, $state,$location,$window) {
    // console.log("homePage");
    // $window.location.reload();
    $scope.studentExpNum = 0;
    $scope.studentCourseNum = 0;
    $scope.studentExpNum = 0;
    $scope.studentLearnedExpNum = 0;
    $scope.reportNum = 0;
    $scope.sumLearningTime = 0;
    if($scope.storage.authority == 0){
        // 当前用户为学生时，首页内容显示
        // 从数据库中获取当前学生的课程
        $http({
            url:'/api/getStudentCourseNum',
            method:'POST',
            data:{studentId:$scope.storage.id}
        }).success(function(response){
            console.log(response);
            $scope.studentCourseNum = response.studentCourseNum;
            if(response.studentCourseNum!=""){
                $scope.studentExp = response.studentExp;
                // console.log($scope.studentExp);
                $scope.studentExpNum = $scope.studentExp.length;
                var j = 0;
                // $scope.studentLearnedExp = [];
                $scope.studentLearnedExpNum = 0;
                for(var i=0;i < $scope.studentExp.length;i ++){
                    if($scope.studentExp[i].tag.indexOf($scope.storage.id)>-1){
                        console.log($scope.studentExp[i].tag.indexOf($scope.storage.id))
                        $scope.studentLearnedExpNum += 1;
                        
                    }
                }
            };
            
            
            
            $scope.toStudentCoursePage = function(){
                console.log("点击前往学生课程页面");
                $state.go('app.experimentalDuty');
            }
            $scope.toReportPage = function () {
                $state.go('app.reportRecord');
            }
            $scope.toRecordPage = function(){
                $state.go('app.learningRecord');
            }
        });
        $http({
            url:'/api/getReportTimeNum',
            method:'POST',
            data:{studentId:$scope.storage.id}
        }).success(function(response){
            console.log(response);
            $scope.reportNum = response.reportNum;
            $scope.sumLearningTime = response.sumLearningTime;

            $scope.divideDate= function(numrec){
                // console.log(numrec);
                if(numrec != null){
                    var min = numrec%3600;
                    var sec = numrec%60;
                    return (numrec-min)/3600+'小时'+((min-sec)/60+1)+"分"
                }else{
                    return 0+'小时'+ 0 +'分'
                  
            }
                }
        });
    }else if($scope.storage.authority == 1){
        // 当前为教师身份时
        // 读取公共课程，以及老师自己的课程数目
        $http.get('/api/getTeacherOwnCourse').then(function(response){
            console.log(response);
            $scope.commonCourseNum = response.data.comCouNum;
            $scope.teacherCourseNum = response.data.teaCouNum;
            $scope.commonExpNumber = response.data.comExpNum;
            $scope.teacherExpNumber = response.data.teaExpNum;
            $scope.learnExpNumber = response.data.learnedExpNum;
            $scope.classNumber = response.data.claNum;
            $scope.studentnum = response.data.stuNum;
           
            $scope.toClassListPage=function(){
                console.log("点击跳转班级管理页面")
                $state.go('app.classManage');
            }
            $scope.toCommonCoursePage=function(){
                console.log("点击跳转公共课程页面")
                $state.go('app.commonCourse');
            }
            $scope.toTeacherCoursePage=function(){
                console.log("点击跳转班级管理页面")
                $state.go('app.experimentalDuty');
            }
        })
    }else{
        // 当前用户为老师或管理员时，首页内容显示
        //从数据库中获取老师课程数
            $http.get('/api/getTeacherCourseNum').then(function(response){
                console.log(response.data);
                $scope.allNumbers = response.data.allNum;
                // 公共实验数目
                $scope.commonExpNumber = $scope.allNumbers[0][0].commonExpNum;
                console.log($scope.commonExpNumber);
                $scope.teacherExpNumber = $scope.allNumbers[1][0].teacherExpNum;
                console.log($scope.teacherExpNumber);
                $scope.unLearnExpNumber = $scope.allNumbers[2][0].unLearnExpNum;
                console.log($scope.unLearnExpNumber);
                $scope.learnExpNumber = $scope.allNumbers[3][0].learnExpNum;
                console.log($scope.learnExpNumber);
                $scope.classNumber = $scope.allNumbers[4][0].classNum;
                console.log($scope.classNumber);
                
            });
            
            //从数据库中获取公共课程数;获取老师课程
            $http.get('/api/getCommonCourseNum').then(function(response){
                console.log(response.data);
                //console.log("classnum");
                // $scope.storage.setItem("commonCourseNum",response.data.commoncoursenum[0].num);
                //$scope.classNum = response.data.classnum[0].num
                //$scope.classNum.Num = $scope.classNum;
                //$scope.Class.Num = response.data.class.num;
                //console.log($scope.storage.commonCourseNum);
                $scope.commonCourseNum = response.data.commoncoursenum[0][0].num;
                console.log($scope.commonCourseNum);
                $scope.teacherCourseNum = response.data.commoncoursenum[1][0].num;
                console.log($scope.teacherCourseNum);
                // echarts图表
                // var mychart = echarts.init(document.getElementById("echartGra2"));
                // var option = {
                //     series:[{
                //         name:"课程",
                //         type:"pie",
                //         radius:"80%",
                //         data:[
                //         {value:$scope.commonCourseNum,name:"公共课程"},
                //         {value:$scope.teacherCourseNum,name:"教师课程"}]
                //     }]
                // };
                // mychart.setOption(option);
            });
            //点击教师人数获取教师名单;获取学生人数
            $http.get('/api/getTeacherNum').then(function(response){
                console.log(response);
                console.log(response.data.teacherStudentnum[0][0].num);
                $scope.teachernum=response.data.teacherStudentnum[0][0].num;
                $scope.studentnum=response.data.teacherStudentnum[1][0].num;
                console.log($scope.studentnum);
            });

             // 管理员页面
            $scope.toTeacherListPage=function(){
            console.log("点击前往老师名单页面");
            $state.go('app.teacherList');
            }
            $scope.toClassListPage=function(){
                console.log("点击跳转班级管理页面")
                $state.go('app.classManage');
            }
            $scope.toCommonCoursePage=function(){
                console.log("点击跳转公共课程页面")
                $state.go('app.commonCourse');
            }
            $scope.toTeacherCoursePage=function(){
                console.log("点击跳转班级管理页面")
                $state.go('app.experimentalDuty');
            }
    }
        
   
   
}]);