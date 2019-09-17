'use strict';

app.controller('experimentalContentPY', [
	'$rootScope', '$scope', '$http','$sce','$state','$compile',
	function($rootScope, $scope,$http,$sce,$state,$compile) {
		console.log("PY");
		$scope.visible = 0;
		$http.post('/api/launchNB',{
			userName : $scope.storage.id,
            expId    : $scope.storage.moduleIdInfo
		}).then(function(response){
			console.log(response);
			if(response.status==200){
				$scope.notebook_url = response.data.NBurl;
				$scope.expName = response.data.expName;
				$scope.visible = 1;
				console.log($scope.notebook_url);
			}else{
				console.log(response.status);
				window.alert("notebook页面跳转失败");
			}
		});

		//$scope.notebook_url = "https://192.168.1.22:8893/login?token=010f41b84c59b6e9fedad91a422bf53574824e8841e9092a";		
		$scope.trustSrc = function(src) {
			return $sce.trustAsResourceUrl(src);
		};	

		//退出函数
		$scope.quitCur = function(){
			$http.post('/api/shutdownNB', { 
				userName : $scope.storage.id,
				expId : $scope.storage.moduleIdInfo
			});
			$state.go('app.courseDetails');
		};
		$scope.gotoHome = function(){
		    var url=$scope.trustSrc($scope.notebook_url);
 		    $('#vncMachine').attr('src',url );
		};
	}]);
