'use strict';


app.controller('courseDetailsCtrl', [

	//'$rootScope', '$scope', '$localStorage', '$state', '$timeout','$location','$http', '$window',
	//function($rootScope, $scope, $localStorage, $state, $timeout, $location, $http, $window) {
    '$rootScope', '$scope', '$sessionStorage', '$state', '$timeout','$location','$http', '$window',
	function($rootScope, $scope, $sessionStorage, $state, $timeout, $location, $http, $window) {
    
    // 点击添加实验按钮之后跳转至添加实验页面
    $scope.addExpButton = function(){
    	console.log("添加实验页面");
    	$state.go('app.contentManage');
    }
    //页面初始化，用户选中课程后，查看该课程的模块/章节信息
    $scope.moduleImgs = [];
    $scope.willLearnModules = [];
    $scope.learnedModules = [];
    $scope.chosingCourseName = '';
    // $scope.chosingCourseNotebookFlag = true;
    // $scope.chosingId = $rootScope.chosingCourseId;
    $scope.chosingId = $scope.storage.courseIdInfo;
    console.log($scope.chosingId);
    // 当前课程为公共课程时，该教师无权看到删除和隐藏按钮，设flag为0；若当前课程为公共课程，该用户为管理员，则flag为1
    $scope.flag = 0;
    // 课程信息获取
    // 课程名: chosingCourseName
    // 课程简介： chosingCourseIntro
    // 课程封面： chosingCoursePicture

    // 设置函数：用户点击之后关闭提示框
    $scope.closeModal = function(){
        $scope.modalExpId.className = "modal hide";
        // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
        $window.location.reload();
    }
    $http({
    	url:'/api/getCourseName',
    	method:'POST',
    	data:{id:$scope.chosingId}
    }).success(function(response){
    	console.log(response);
    	// $scope.chosingCourse = response.chosingCourse;
    	// head部分显示课程的信息内容
    	$scope.chosingCourseName = response.chosingCourse[0].courseName;
    	$scope.chosingCourseIntro = response.chosingCourse[0].courseIntro;
    	$scope.chosingCoursePicture = response.chosingCourse[0].coursePicture;
    	// 当该课程为notebook时，不能对实验内容进行修改，只有在Jupyter中进行修改
    	$scope.chosingCourseNotebookFlag = response.chosingCourse[0].vncNotebook;
    	// 将标签存入缓存区，进入页面修改之后，区分notebook类型的实验和novnc实验的修改两种情况
    	$scope.storage.setItem("courseNotebookFlag",$scope.chosingCourseNotebookFlag);
    	console.log($scope.chosingCourseNotebookFlag+"notebook和novnc标签");
    	// 增加当前课程的教师名称与当前教师的名称的比较，可能为公共课程和该教师的课程两种
    	$scope.chosingCourseTeacherName = response.chosingCourse[0].teacherName;
    	if($scope.chosingCourseTeacherName == $scope.storage.id){
    		$scope.flag = 1;
    	}else{
    		$scope.flag = 0;
    	}
    }).error(function(){
    	console.log("error");
    });
    //获取该课程下的所有实验名称
    //页面跳转判断： pyJudge
    //实验内容：chosingModule
    $http({
    	url:'/api/getModule',
    	method:'POST',
    	data:{id:$scope.chosingId}//将选中课程的ID号传递到后台数据库
    }).success(function(response){
    	console.log(response);
    	//获取选中的课程下的所有模块/章节信息
    	$scope.judge = response.pyJudge;
    	$scope.moduleImgs = response.chosingModule;

    	console.log($scope.moduleImgs);
    	// 所有实验的个数
    	$scope.moduleNum = $scope.moduleImgs.length;
    	console.log($scope.moduleNum);
    	// 将当前的课程下所有的实验数目存入缓存区，方便添加新实验时，order字段接着已存在的数字增加
    	$scope.storage.setItem("existExpNum",$scope.moduleNum);
    	if($scope.storage.authority == 1 || $scope.storage.authority == 2){
    		$scope.stuNum = response.stuNum
			console.log($scope.stuNum);
			for (var j in $scope.moduleImgs) {
				$scope.moduleImgs[j].numCount = 0;
                for (var k in $scope.stuNum)
                    if ($scope.moduleImgs[j].experienceName == $scope.stuNum[k].courseName) {
                        $scope.moduleImgs[j].numCount = $scope.stuNum[k].userCount;
                        break;
                    }
                //console.log(j + "："+$scope.moduleImgs[j].numCount);
            }

		}

    	/*
    	// console.log($scope.moduleImgs[0].tag);
    	// 对每个实验的学习人数进行统计
    	for(var j = 0; j < $scope.moduleImgs.length; j ++){
    		// 分别对每个实验中的tag标签中存储的学过的学生名称的字符串进行统计
    		$scope.moduleImgs[j].numCount = $scope.moduleImgs[j].tag.split(",").length - 1;
    		// console.log($scope.moduleImgs[j].numCount);
    	}*/
    	$scope.stuModuleImgs = [];
    	var m = 0;
    	// 记录学生可见的实验，并在学生端显示
    	for(var k =0; k < $scope.moduleImgs.length; k ++){
    		// console.log($scope.moduleImgs[k]);
    		// 学生可见的课程记录在$scope.stuModuleImgs中
    		if($scope.moduleImgs[k].hideShowExp == 1){
    			$scope.stuModuleImgs[m] = $scope.moduleImgs[k];
    			m += 1;
    		}
    		
    	}


    	var ii = 0;
		$scope.count = 0;//老师点击隐藏按钮的次数统计
		// 老师身份点击某个实验隐藏该实验内容
		$scope.hideExp = function(index){
			// 获取当前实验的id
			console.log(index);
			// 存储当前实验的id
			$scope.hideExpId = index;
			$scope.count += 1;
			for(ii =0;ii < $scope.moduleNum; ii ++){
				if($scope.moduleImgs[ii].experienceId == $scope.hideExpId){
					break;
				}
			}
			// 对实验表中的hideShow字段进行更新：设置为1代表学生可见；设置为0代表学生不可见
			$http({
				url:'/api/updateExpHideShow',
				method:'POST',
				data:{updateId:$scope.hideExpId}
			}).success(function(response){
				console.log(response);
				$scope.moduleImgs[ii].hideLogoExp = response.logoExp[0].hideLogoExp;
				$scope.moduleImgs[ii].hideShowExp = response.logoExp[0].hideShowExp;
				console.log($scope.moduleImgs[ii].hideLogoExp);
				if(response == "failed"){
					console.log("更新数据不成功");
					// alert("更新隐藏显示失败!");
					$scope.modalExpId = document.getElementById("updateExpuHideShowFail");
                    $scope.modalExpId.className = "modal show";
				}else{
					console.log("更新成功！");
					// alert("更新成功！");
					$scope.modalExpId = document.getElementById("updateExpHideShowModal");
                    $scope.modalExpId.className = "modal show";
					// 由于更新数据库之后的实验hideShowExp字段信息发生更新，所以重新加载页面
					// $window.location.reload();
				}
			}).error(function(){
				console.log("失败");
			});

		}
    	var j = 0;
    	var k = 0;

    	// 定义用户名
    	$scope.name = '';
    	$scope.name = $scope.storage.id;
    	// $scope.name = $scope.storage.name;
    	// console.log($scope.name);
    	for(var i = 0; i < $scope.stuModuleImgs.length; i ++){
    		// 查看当前用户名是否在学习标签tag中
    		// console.log(typeof($scope.moduleImgs[i].tag)+i);
    		var num = $scope.stuModuleImgs[i].tag.indexOf($scope.name);
    		// console.log(num);
    		if(num < 0){
    			// 如果该用户名不存在tag中说明：未学习
    			$scope.willLearnModules[j] = $scope.stuModuleImgs[i];
    			j ++;
    		}else{
    			// 否则：已学习
    			$scope.learnedModules[k] = $scope.stuModuleImgs[i];
    			k ++;
    		}
    	}   	
    }).error(function(){
    	console.log("error");
    });
    // 学生身份时实验页面选项卡内容
	    var tabBox = document.getElementById('tabBox');
	    var oList = document.getElementById('option').getElementsByTagName("li");
	    var oDivList = tabBox.getElementsByClassName('module');
	//创建一个函数实现选项卡切换的功能
	$scope.change = function(index){
	    //让所有的LI和DIV移除SELECT样式类
	    for(var i=0;i<oList.length;i++){
	    	oList[i].className = '';
	    	oDivList[i].className = 'module';
	    }
	    oList[index].className = "select";
	    oDivList[index].className = "module select";
	}
	for(var i=0;i<oList.length;i++){
		oList[i].myIndex = i;
	    oList[i].onclick = function (){//获取当前的点击的索引值
	    	console.log(this.myIndex);
	    	$scope.change(this.myIndex);
	    }
	}

	// 老师身份时实验页面选项卡内容
		var tabBox1 = document.getElementById('tabBox1');
	    var oList1 = document.getElementById('option1').getElementsByTagName("li");
	    var oDivList1 = tabBox1.getElementsByClassName('module');
	//创建一个函数实现选项卡切换的功能
	$scope.change2 = function(index){
	    //让所有的LI和DIV移除SELECT样式类
	    for(var i=0;i<oList1.length;i++){
	    	oList1[i].className = '';
	    	oDivList1[i].className = 'module';
	    }
	    oList1[index].className = "select";
	    oDivList1[index].className = "module select";
	}
	// 
	for(var i=0;i<oList1.length;i++){
		oList1[i].myIndex = i;
		// 点击事件之后触发change2函数：切换选项卡
	    oList1[i].onclick = function (){//获取当前的点击的索引值
	    	console.log(this.myIndex);
	    	$scope.change2(this.myIndex);
	    }
	}



	// 老师身份可以点击某个实验删除该实验内容
	$scope.deleteExperience = function(index){
	    // 传递的参数是当前的实验id
	    console.log(index);
	    $scope.deleteExperience = index;
	    console.log($scope.deleteExperience);
	    // $scope.choice = confirm('确定删除该实验？');
	    // 提醒用户是否确定执行相关的确定操作的模态框
        $scope.confirmExpModal = document.getElementById("confirmExpModal");
        // 提示框显示
        $scope.confirmExpModal.className = "modal show";
        // 设置函数：用户点击取消按钮,隐藏模态框
        $scope.closeConfirm = function(){
            $scope.confirmExpModal.className = "modal hide";
            // $scope.choice = 0;
        }
        // 设置函数：用户点击确定按钮
        $scope.confirmExp = function(){
	        $scope.confirmExpModal.className = "modal hide";
	        // 删除数据库中该实验id号的实验信息
	    	$http({
	    		url:'/api/deleteExperience',
	    		method:'POST',
	    		data:{expId:$scope.deleteExperience}
	    	}).success(function(response){
	    		// alert("实验删除成功");
		    	// 删除实验成功后刷新页面
		    	// $window.location.reload();
		    	$scope.modalExpId = document.getElementById("updateExpHideShowModal");
	            $scope.modalExpId.className = "modal show";
		    }).error(function(){
		    	// alert("实验删除失败");
		    	$scope.modalExpId = document.getElementById("updateExpuHideShowFail");
	            $scope.modalExpId.className = "modal show";
		    });
		    if($scope.choice ==true){
		    	
			}else{
				console.log("取消删除该实验");
				$window.location.reload();
			}
		}
	}

	// 老师身份可以点击某个实验修改实验内容
	$scope.modifyExperience = function(index){
		// 传递的参数是当前实验的id
		console.log(index);
		$scope.modifyId = index;
		// 将当前需要修改的实验id存至缓存中,当刷新页面之后，保证当前实验id不为null
		$scope.storage.setItem("modifyId",$scope.modifyId);
		$state.go('app.updExp');
	}
	

	// 点击模块后跳转至实验页面函数
	$scope.currentModuleId = "";
	$scope.getModuleId = function (index){
		console.log(index);
		$scope.currentModuleId = index;
		console.log($scope.currentModuleId);
	    //对moduleTable数据库中对应模块的tag标签进行更新为1
	    //如果选中的模块还未学习，则将其tag标签修改；如果选中的模块已经学习，不做修改

	    console.log("123");
	    $http({
	    	url:'/api/updateTag',
	    	method:'POST',
	    	data:{tagId:$scope.currentModuleId}
	    }).success(function(response){
	    	console.log("更新成功");
	    	// 从moduleTable表读取实验名称
		    // $http.post('/api/sendModuleId',{ moduleId:$scope.currentModuleId});
		    $http({
		    	url:'/api/sendModuleId',
		    	method:'POST',
		    	data:{experienceId:$scope.currentModuleId}
		    }).success(function(response){
		    	console.log(response);
		    	$scope.experienceName = response.experienceName;
		    	$http.post('/api/sendTitle', { experimentalContent:$scope.experienceName,experienceId:$scope.currentModuleId});
		     	// 将选中的模块id号存储到本地中，这样即使刷新页面依然能获取到当前的模块id号
		     	$scope.storage.setItem("moduleIdInfo",$scope.currentModuleId);
		    	// console.log("进入实验之前");
		    	// $state.reload('app.courseDetails');
		    	if($scope.judge == 1){
		    		$state.go('experimentalContent');
		    	}else{
		    		$state.go('experimentalContentPY');
		    	}	
			}).error(function(){
				console.log("error");
			});     
	    }).error(function(){
	    	console.log("更新失败");
	    });

	    	
	}
}
]);
