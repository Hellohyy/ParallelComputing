'use strict';

app.controller('loginCtrl', function ($rootScope, $scope,$http, $state) {

    console.log("login");

	// 初始化用户信息
	$scope.userData = {
        "Id":"",
		"name":"",
		"password":"",
		"authority":"",
        "headPortrait":"",
        "identity":"-1"
	};



	//回车登录事件
	$scope.inputKeyUp = function (event) {
        var keycode = window.event?event.keyCode:event.which;
        if(keycode==13){

		if ($scope.userData.Id != "" && $scope.userData.password != "" && $scope.userData.identity != -1)
        		$scope.userLogin();
        }
	}

	// 登录事件
	$scope.userLogin = function(){
		// 判断用户名&密码是否为空
		console.log('登录验证');
		if ($scope.userData.Id!=""&&$scope.userData.password!="" && $scope.userData.identity != -1) {
			console.log($scope.userData);
            var str1 = hex_md5(hex_md5("cuczlg001***"));
            var str2 = hex_md5(hex_md5("zlg123456***"));
            var str3 = hex_md5(hex_md5("12345678"));
            console.log(str1);
            console.log(str2);
            console.log(str3);
			// 判断数据库是否有该用户:用户身份也需要传到后端
			$http.post('/getUser',
				{
					USER_ID:$scope.userData.Id, 
					USER_PASSWORD:hex_md5(hex_md5($scope.userData.password)),
                    USER_IDENTITY:$scope.userData.identity
				}).then(function(response){
		        // 查询成功
		        if(response.status==200){
		            console.log(response);
		            $scope.info = response.data.info;
		            // 用户名不存在
		            if ($scope.info == "success"){
		            	$scope.userData.authority = response.data.authority;
                        $scope.userData.userName = response.data.name;
                        $scope.userData.headPortrait = response.data.headPortrait;
		            	console.log(response);
		            	// alert("正确！")

		            	// 用户登录状态置为true
    					$scope.$emit("logoutFromChildCtrl", true);

    					$scope.$emit("userNameCtrl", $scope.userData);
    					$scope.storage.setItem("headPortrait",$scope.userData.headPortrait);
                        $scope.storage.setItem("userName",$scope.userData.userName);
    					$scope.storage.setItem("id",$scope.userData.Id);
    					$scope.storage.setItem("authority",$scope.userData.authority);
    					//console.log(window.localStorage);
						console.log(window.sessionStorage)

		            	// window.location.href = "http://localhost:3000/#/app/actual";
		            	// $state.go('app.functionMenu');
		            	// 页面跳转之前停止图片的轮播
		            	stopPlay();
		            	$state.go('app.homePage');

		            } 
		            // 用户密码不正确
		            else {
		            	// debugger;
		            	alert($scope.info);
		            	// console.log("用户名或密码不正确");
		            	$scope.userData.Id = ""
		            	$scope.userData.password = "";
		            }
		            
		        }
		        // 查询错误
		        else{
		            console.log(response.status);
		        }
		    });

		} 
		else {
			alert("用户名或密码、身份不能为空！")
		}
	}

	// 右侧系统图片与特点信息展示
	// 获取当前的图片列表
    var list = document.getElementById("homeImgList");
    // 前一张图片按钮
    // var prev = document.getElementById("prevImg");
    // 后一张图片按钮
    // var next = document.getElementById("nextImg");
    var buttons = document.getElementById("buttonsContainer").getElementsByTagName("span");
    var index = 1;
    // 获取样式属性的left值
    console.log(getComputedStyle(document.getElementById('homeImgList'),null).getPropertyValue('left'));
    // var listStyleLeft = getComputedStyle(document.getElementById('homeImgList'),null).getPropertyValue('left');
    // list.style.left获取不到值
    console.log(list.style);
    // console.log(listStyleLeft);
    console.log(buttons[0].className);
    for(var i = 0; i < buttons.length; i ++){
    	buttons[i].onclick = function(){
    		var clickIndex = parseInt(this.getAttribute("index"));
    		var offset = 600 * (index - clickIndex);
    		changeImg(offset);
    		index = clickIndex;
    		showButton();
    	}
    }
    // 图片位置更新
    function changeImg(offset){
    	var listStyleLeft = getComputedStyle(document.getElementById('homeImgList'),null).getPropertyValue('left');
    	var newLeft = parseInt(listStyleLeft) + offset;
    	// list.style.cssText = newLeft + "px";
    	list.style.left = newLeft + "px";
    	console.log(list.style.left);
    	// list.style.transition = "500ms ease";
    	if(newLeft < -2400){
    		list.style.left = 0 + "px";
    		console.log(list.style.left);
    	}
    	if(newLeft > 0){
    		list.style.left = -2400 + "px";
    		console.log(list.style.left);
    	}
    }
    // 点击查看前一张图片
    $scope.prevFun = function(){
    	// console.log("前一张图片");
    	index -= 1;
    	if(index < 1){
    		index = 5;
    	}
    	showButton();
    	changeImg(600);
    }
    // 点击查看后一张图片
    $scope.nextFun = function(){
    	index += 1;
    	if(index > 5){
    		index = 1;
    	}
    	showButton();
    	changeImg(-600);
    }
    
    // 图片下方的按钮显示切换
    function showButton(){
    	// 清除之前的样式
    	for(var i = 0; i < buttons.length; i ++){
    		if(buttons[i].className == "on"){
    			buttons[i].className = "";
    		}
    	}
    	buttons[index-1].className = "on";
    }
    // 当鼠标移除图片范围，图片自动切换，当鼠标移入图片范围，图片停止自动切换
    var timer;//设置定时器
    function autoPlay(){
    	timer = setInterval(function(){
    		$scope.nextFun();
    	},2000);
    }
    autoPlay();
    // 当鼠标移入图片范围内，自动切换取消
    var container = document.getElementById("homeContainer");
    function stopPlay(){
    	clearInterval(timer);
    }
    // stopPlay和autoPlay不能加()
    container.onmouseover = stopPlay;
    container.onmouseout = autoPlay;
});

    

