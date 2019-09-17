'use strict';

app.controller('learningRecordCtrl', [
    '$rootScope', '$scope', '$http', '$state', '$location', function($rootScope, $scope, $http, $state, $location) {
    	//未测试到数据
       //配置
    $scope.count = 0;
    $scope.p_pernum = 10;
    //变量
    $scope.p_current = 1;
    $scope.p_all_page =0;
    $scope.pages = [];
        // console.log($scope.user_login_name);s
    if($scope.storage.authority == 1) {
        $http.get('/api/getRecord').then(function (response) {
            if (response.status == 200) {
                console.log(response.data.record.length);
                $scope.learningRecords = response.data.record;
                console.log($scope.learningRecords);
                // $scope.dividePage();
            }
            else {
                console.log(response.status);
            }
        });
    }
    else{
    	 $http({
            url:'/api/getUserRecord',
            method:'POST',
            data:{username:$scope.storage.id}
        }).success(function(response){
                console.log(response);
                $scope.learningRecords = response.record;
                console.log($scope.learningRecords);
                // $scope.dividePage();
            }).error(function(){

                console.log(response.status);

        });
	  }
  	$scope.moduleIdDetails = "";
    $scope.recordId = 0;
    $scope.recordExpId = 0;
  	//鼠标点击后获取：学习记录详情
  	$scope.getRecordDetails = function (expId){
  		//获取当前函数的参数：学习记录id
  		// $scope.recordId = recordId;
      $scope.recordExpId = expId;
  		console.log($scope.recordExpId);
      //将用户点击的学习记录详情id传递到主控制器
  		// $scope.$emit("recordIdInfo",$scope.recordId);

      // 将学习记录的id号存储到本地中，这样即使刷新页面依然能够获取当前id的学习记录
      // $scope.storage.setItem("recordId",$scope.recordId);
      $scope.storage.setItem("recordExpId",$scope.recordExpId);
  		//跳转至详情页面
  		$state.go('app.recordDetails');

  	}
  	$scope.transDate= function(daterec){
    	 //console.log("测试日期"+date);
    	var time = new Array(6);
    	var date = new Date(daterec);
    	time[0] = date.getFullYear();//年
    	time[1] = date.getMonth()+1;//月
    	time[2] = date.getDate();//日
    	time[3] = date.getHours();//时
    	time[4] = date.getMinutes();//分
    	time[5] = date.getSeconds();//秒
    	// console.log(time);
    	return time[0]+ "-"+ time[1]+"-"+time[2]+" "+time[3]+":"+time[4];
    }
    $scope.divideDate= function(numrec){
  		  var min = numrec%3600;
  		  var sec = numrec%60;
  		  return (numrec-min)/3600+'小时'+((min-sec)/60+1)+"分"
    }
      //单选按钮选中
  $scope.select= function(id){
    alert(id);
  }
  // 设置分页函数
   $scope.dividePage = function(){
        //初始化页码
        var reloadPno = function(){
          $scope.pages=calculateIndexes($scope.p_current,$scope.p_all_page,8);
        };
            //分页算法
        var calculateIndexes = function (current, length, displayLength) {
           var indexes = [];
           var start = Math.round(current - displayLength / 2);
           var end = Math.round(current + displayLength / 2);
            if (start <= 1) {
                start = 1;
                end = start + displayLength - 1;
               if (end >= length - 1) {
                   end = length - 1;
                }
            }
            if (end >= length - 1) {
               end = length;
                start = end - displayLength + 1;
               if (start <= 1) {
                   start = 1;
                }
            }
            for (var i = start; i <= end; i++) {
                indexes.push(i);
            }
            return indexes;
        };
        //获取数据
        var _get = function(page,size,callback){
            
              $scope.count=$scope.learningRecords.length;
              // $scope.list=res.list;
              $scope.p_current = page;
              console.log($scope.p_current);

              $scope.p_all_page =Math.ceil($scope.count/$scope.p_pernum);
              // console.log($scope.p_all_page);
              reloadPno();
              callback();
        }
        //初始化第一页
        _get($scope.p_current,$scope.p_pernum,function(){
          // alert("我是第一次加载");
          console.log("这是第一次加载");
        });
        //首页
        $scope.p_index = function(){
          $scope.load_page(1);
        }
        //尾页
        $scope.p_last = function(){
          $scope.load_page($scope.p_all_page);
        }
        //加载某一页
        $scope.load_page = function(page){
          _get(page,$scope.p_pernum,function(){ });
        };
   }
    
   


}]);