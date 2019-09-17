'use strict';

app.controller('userSettingCtrl', [
        //'$rootScope',  '$scope','$http', '$state', '$localStorage', '$timeout', '$window',
        //function ($rootScope, $scope, $http, $state, $localStorage, $timeout, $window) {
    '$rootScope',  '$scope','$http', '$state', '$sessionStorage', '$timeout', '$window',
    function ($rootScope, $scope, $http, $state, $SessionStorage, $timeout, $window) {
    console.log("用户设置");
    console.log($scope.storage.id);
    $scope.newPassword = "";
    $scope.conPassword = "";
    // 关闭弹出框
    $scope.closeAlert = function(){
        $scope.alert.className = "modal hide";
        // $scope.choice = 0;
        console.log("取消密码修改");
    }
    // 关闭修改后的成功提示框
    $scope.closeSuccess = function(){
    	$scope.modifyAlert.className = "modal hide";
    	// 成功后刷新页面
    	$window.location.reload();
    }
    // 关闭修改后的失败提示框
    $scope.closeFailed = function(){
    	$scope.modifyAlert.className = "modal hide";
    	// 不进行刷新
    }
    // 获取当前用户的所有的用户信息
    $http.post('/getUserInfo',{
    	userId:$scope.storage.id
    }).then(function(response){
    	console.log(response);
    	console.log(response.data.userInfo[0]);
    	$scope.userInfo = response.data.userInfo[0];
    	console.log($scope.userInfo);
    });
    $scope.modifyPassword = function(){
    	console.log("修改密码");
    	console.log($scope.newPassword);
    	console.log($scope.conPassword);
        // 对新设置的密码进行格式判断：必须包含数字、字母、特殊字符三种类型
        // 正则表达式
        var reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/;
        var re =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
        var regex = new RegExp('^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,20}$');
        var regFlag = 0;
        if(!regex.test($scope.newPassword)){
            // msgError("输入错误：密码不符合规则，请重新输入。");
            console.log("密码不符合规则");
            // 密码设置不符合规则，正则标签值设为0
            regFlag = 0;
        }else{
            // 密码设置符合规则，正则标签值设为1
            regFlag = 1;
        }
    	// 新密码长度不符合要求
    	if($scope.newPassword.length < 8 || $scope.newPassword.length > 20 || $scope.conPassword.length < 8 || $scope.conPassword.length > 20 || regFlag == 0){
    		$scope.newPassword = "";
    		$scope.conPassword = "";
    		// 弹出密码不符合要求提示框
    		$scope.alert = document.getElementById("notSame");
    		$scope.alert.className = "modal show";
    	}else{
    		// 新密码与确认密码不一致
    		if($scope.newPassword != $scope.conPassword){
	    		$scope.newPassword = "";
	    		$scope.conPassword = "";
	    		// 弹出密码不一致提示框
	    		$scope.alert = document.getElementById("notSame");
	    		$scope.alert.className = "modal show";
	    	}else{
	    		console.log("密码一致");
	    		// console.log($scope.newPassword);
	    		// console.log($scope.userInfo.password);
	    		if($scope.newPassword == $scope.userInfo.password){
	    			console.log("新旧密码一样");
	    			$scope.newPassword = "";
		    		$scope.conPassword = "";
		    		// 弹出密码不一致提示框
		    		$scope.alert = document.getElementById("notSame");
		    		$scope.alert.className = "modal show";
	    		}else{
	    			// 进行密码的存储
		    		$http.post('/modifyPassword',{
		    			userId:$scope.storage.id,
		    			newPassword:hex_md5(hex_md5($scope.newPassword))
		    		}).then(function(response){
		    			console.log(response.data);
		    			if(response.data == "success"){
		    				console.log("成功");
		    				// 修改密码成功后弹出成功提示框
		    				$scope.modifyAlert = document.getElementById("modifySuccess");
		    				$scope.modifyAlert.className = "modal show";
		    			}else{
		    				// 修改密码成功后弹出成功提示框
		    				$scope.modifyAlert = document.getElementById("modifyFailed");
		    				$scope.modifyAlert.className = "modal show";
		    				console.log("失败");
		    			}
		    		});
	    		}
	    		
	    	}
    	}
    	
    }
}]);