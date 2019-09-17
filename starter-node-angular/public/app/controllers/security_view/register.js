'use strict';

app.controller('registerCtrl', [
    '$rootScope', '$scope', '$http', '$state',function($rootScope, $scope,$http,$state) {

        console.log("register");

        // 初始化注册信息
        $scope.registerData = {
            "name": "",
            "password": "",
            "passwordagain": "",
        }

        //回车登录事件
	$scope.inputKeyUp = function (event) {
        var keycode = window.event?event.keyCode:event.which;
        if(keycode==13){

		if ($scope.registerData.name != "" && $scope.registerData.password != "")
        		$scope.userRegister();
        }
	}

        // 注册事件
        $scope.userRegister = function () {
            console.log($scope.registerData);
            // 注册新用户
            if ($scope.registerData.name != "" && $scope.registerData.password != "") {
                $http.post('addUser', {
                    USER_NAME: $scope.registerData.name,
                    USER_PASSWORD: $scope.registerData.password
                }).then(function (response) {
                    if (response.status == 403) {
                        consol.log(response.info);
                        alert('错误原因：' + response.info)
                    }
                    else if (response.status == 200) {
                        var info = response.data.info
                        console.log(info);
                        alert(info)
                        // window.location.href = "http://localhost:3000/#/login";
                        if(info == "成功" )
                        $state.go('login');

                    }
                    else {
                        console.log(response.status);
                        alert('错误原因：' + response.data)
                        // alert("用户不存在！");
                    }
                });

            }
        }
    }
]);
