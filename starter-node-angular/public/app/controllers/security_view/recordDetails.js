'use strict';

app.controller('recordDetailsCtrl',[
	//'$rootScope', '$scope', '$localStorage', '$state', '$http', function($rootScope, $scope, $localStorage, $state, $http){
	'$rootScope', '$scope', '$sessionStorage', '$state', '$http', function($rootScope, $scope, $sessionStorage, $state, $http) {
        console.log("详情！");
        $scope.transDate = function (daterec) {
            //console.log("测试日期"+date);
            var time = new Array(6);
            var date = new Date(daterec);
            time[0] = date.getFullYear();//年
            time[1] = date.getMonth() + 1;//月
            time[2] = date.getDate();//日
            time[3] = date.getHours();//时
            time[4] = date.getMinutes();//分
            time[5] = date.getSeconds();//秒
            // console.log(time);
            return time[0] + "-" + time[1] + "-" + time[2] + " " + time[3] + ":" + time[4];
        };
        $scope.divideDate = function (numrec) {
            var min = numrec % 3600;
            var sec = numrec % 60;
            return (numrec - min) / 3600 + '小时' + ((min - sec) / 60 + 1) + "分"
        }
        var vm = $scope.vm = {};
        vm.page ={
            size:5,
            index:1
        };
        vm.learningRecords=[];

        // $scope.learningRecords = [
        //   {
        //   	"record_id":"1",
        //   	"time":"5分钟",
        //   	"onTime":"2018-07-25 16:10:00",
        //   	"offTime":"2018-07-25 16:15:00",
        //   	"ip":"1.119.46.38",
        //   	"UserId":"1",
        //   	"moduleId":"1"
        //   },
        //   {
        //   	"record_id":"2",
        //   	"time":"1分钟",
        //   	"onTime":"2018-07-25 16:10:00",
        //   	"offTime":"2018-07-25 16:11:00",
        //   	"ip":"1.119.46.39",
        //   	"UserId":"1",
        //   	"moduleId":"2"
        //   }
        //   ];
        $scope.learningRecords = [];
        //用户传递过来的学习记录
        // $scope.chosingRecord = $rootScope.chosingRecordId;
        // $scope.chosingRecord = $scope.storage.recordId;
        $scope.chosingRecordExpId = $scope.storage.recordExpId;
        // console.log($scope.chosingRecord);
        console.log($scope.chosingRecordExpId);
        $scope.moduleNameInfo = '';
        $scope.moduleName1 = '';
        $scope.searchName = '';
        //从学习实验数据库中获取课程名
        $http({
            url: '/api/findCourseName',
            method: 'POST',
            data: {expId: $scope.chosingRecordExpId}//传递参数实验id，方便找到课程名称
        }).success(function (response) {
            // console.log(response);
            $scope.searchCourseName = response.courseName;
            $scope.searchExpName = response.experienceName;
            // console.log($scope.searchCourseName);
        }).error(function () {
            console.log("error");
        });
        //从学习记录中获取详细信息值
        if ($scope.storage.authority == 1) {
            $http({
                url: '/api/getLearningRecordDetails',
                method: 'POST',
                data: {expId: $scope.chosingRecordExpId}//传递参数：所有学习该试验id的记录
            }).success(function (response) {
                // console.log(response);
                vm.learningRecords = response.recordDetails;
                console.log(vm.learningRecords);
            }).error(function () {
                console.log("error");
            });
        }
        else {
            $http({
                url: '/api/getUserLearningRecordDetails',
                method: 'POST',
                data: {expId: $scope.chosingRecordExpId}//传递参数学习记录的id
            }).success(function (response) {
                // console.log(response);
                vm.learningRecords = response.recordDetails;
                console.log(vm.learningRecords);
                //从数据库中找到experienceId对应的实验名称
                // $http({
                //     url:'/api/getModuleInfo',
                //     method:'POST',
                //     data:{id:$scope.learningRecords[0].experienceId}
                // }).success(function(response){

                //     console.log(response);
                //     //从数据库中获取当前的实验名
                //     $scope.moduleNameInfo = response.moduleInfo;

                //     $scope.experienceName1 = $scope.moduleNameInfo[0].experienceName;
                //     console.log($scope.experienceName1);

                // }).error(function(){
                //     console.log("error");
                // });

            }).error(function () {
                console.log("error");
            });


        }
    }
]);