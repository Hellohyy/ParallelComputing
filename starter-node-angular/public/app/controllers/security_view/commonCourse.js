'use strict';

app.controller('commonCourseCtrl',['$rootScope', '$scope', '$http', '$state','$window',
	function($rootScope, $scope, $http, $state, $window){
		console.log("commonCourse");
		$scope.commonCourses = [];
		console.log($scope.storage.authority);
		// 当点击课程添加按钮之后，跳转至课程添加页面
	    $scope.addCourseButton = function(){
	        console.log("添加课程按钮");
	        $state.go('app.addCourse');
	    }
	    
// 从数据库中读取公共课程的所有信息
		$http.get('/api/getCommonCourses').then(function(response){
			console.log(response.data);
			$scope.commonCourses = response.data.commonCourses;
			// console.log($scope.commonCourses[0].courseId);
			// 当前公共课程所属的管理员id与当前用户id一致时，表示该管理员可以对公共课程进行修改，否则，不能修改
			for(var i = 0; i < $scope.commonCourses.length; i ++){
				// 设置每个公共课程是否能被当前用户修改的标签
				if($scope.commonCourses[i].teacherName == $scope.storage.id){
					console.log("当前用户与公共课程的教师名称一致");
					$scope.commonCourses[i].flag = 1;
				}else{
					// 否则标签为0
					$scope.commonCourses[i].flag = 0;
				}
			}
			// 点击修改公共课程之后传递当前公共课程id到缓存区
			$scope.updCommonCourse = function(index){
				$scope.updCourseId = index;
				console.log($scope.updCourseId);
				$scope.storage.setItem("updCourseId",$scope.updCourseId);
				// 跳转至课程修改页面
				$state.go('app.updCourse');
			}
			// 隐藏当前课程内容
            $scope.hideCourse = function(index){
                // 当前需要隐藏的课程ID号
                $scope.currentHideId = index;
                // 找出当前被点击的课程的标号
                for(i = 0; i < $scope.commonCourses.length; i ++){
                        if($scope.commonCourses[i].courseId == $scope.currentHideId){
                            // console.log(i); 
                            break;
                        }
                    }
                // 记录当前图标的样式
                $scope.logo = document.getElementById('commonDiv').getElementsByTagName('img')[5*i].src;
                console.log($scope.logo);
                // 对课程表中的hideShow字段进行更新：由显示状态更新为隐藏状态（默认值为1代表显示；进行隐藏，设值为0）
                $http({
                    url:'/api/updateCouHideShow',
                    method:'POST',
                    data:{updateId:$scope.currentHideId}
                }).success(function(response){
                    console.log(response);
                    // 从后台获取到的隐藏还是显示的按钮图片路径
                    $scope.commonCourses[i].hideLogo = response.logo[0].hideLogo;
                    $scope.commonCourses[i].hideShow = response.logo[0].hideShow;
                    console.log($scope.commonCourses[i].hideLogo);
                   
                    if(response == "failed"){
                        console.log("这里更新数据库不成功");
                        $scope.modalId = document.getElementById("commonCourseFailModal");
                        $scope.modalId.className = "modal show";
                        // 设置函数：用户点击之后关闭提示框
						$scope.closeModal = function(){
						    $scope.modalId.className = "modal hide";
						    // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
						    window.location.reload();
						}
                        // alert("更新隐藏显示失败！");
                   
                    }else{
                        console.log("更新成功");
                        // alert("更新成功！");
                        // $("#hideFlag").data("toggle","modal");
                        // $("#hideFlag").data("target","#abc");
                        // $("#hideFlag").data("show",true);
                        // $scope.bbbb = $("#hideFlag").data();
                        $scope.modalId = document.getElementById("commonCourseModal");
                        $scope.modalId.className = "modal show";
                        // 设置函数：用户点击之后关闭提示框
						$scope.closeModal = function(){
						    $scope.modalId.className = "modal hide";
						    // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
						    window.location.reload();
						}
                        // $scope.aaaa = ($("#updateCouHideShowModal").attr("class"));
                        // console.log($scope.modalId.className);
                        // console.log($scope.bbbb);
                        
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
                    window.location.reload();
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
                        $scope.modalId = document.getElementById("commonCourseModal");
                        $scope.modalId.className = "modal show";
                        // 设置函数：用户点击之后关闭提示框
						$scope.closeModal = function(){
						    $scope.modalId.className = "modal hide";
						    // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
						    window.location.reload();
						}
                        // alert("课程删除成功！");
                        // 删除成功后重新加载页面
                        // $window.location.reload();
                    }).error(function(){
                        console.log("失败");
                        // 更新失败：课程删除失败
                        $scope.modalId = document.getElementById("commonCourseFailModal");
                        $scope.modalId.className = "modal show";
                        // 设置函数：用户点击之后关闭提示框
						$scope.closeModal = function(){
						    $scope.modalId.className = "modal hide";
						    // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
						    window.location.reload();
						}
                    });
                }
            }
			// 公共课程每门课程下包含的实验数目查询
            $http({
                url:'/api/getCommonCourseNumber',
                method:'POST',
                data:{teacherInfo:$scope.commonCourses}
            }).success(function(response){
                console.log(response);
                // 当只有一个课程时
                if($scope.commonCourses.length == 1){
                    $scope.commonCourses[0].expNumber = response.commonExperience[0].num;
                }else{
                    // 当有多个课程时
                    // 将返回的每个课程下的所有实验分别存入数组中
	                $scope.expNumber = [];
	                for(var i = 0;i < response.commonExperience.length;i ++){
	                    // $scope.expNumber[i] = response.commonExperience[i].num;
	                    $scope.commonCourses[i].expNumber = response.commonExperience[i][0].num;
	                    console.log( $scope.commonCourses[i].expNumber);
	                }
                }
                
                
            }).error(function(){
                console.log("实验数目失败");
                
            });
		});

		// 导入的课程id
		$scope.loadCourseId = "";
		// 导入点击的课程
		$scope.loadCourse = function(index){
			// 当前需要导入到教师自己课程的公共课程ID
			$scope.loadCourseId = index;
			console.log($scope.loadCourseId);
		}
		// 传入模态框的是课程id
		$scope.loadNewCourse = function(){
			// $scope.loadCourseId = index;
			console.log($scope.loadCourseId);
			// $scope.choice = confirm("确定添加为全新课程？");
			// 提醒用户是否确定执行相关的确定操作的模态框
            $scope.confirmCommonModal = document.getElementById("confirmCommonModal");
            // 提示框显示
            $scope.confirmCommonModal.className = "modal show";
            // $scope.choice = window.confirm('确定删除该课程？');
            // 设置函数：用户点击取消按钮,隐藏模态框
            $scope.closeConfirm = function(){
                $scope.confirmCommonModal.className = "modal hide";
                // $scope.choice = 0;
            }
            // 设置函数：用户点击确定按钮
            $scope.confirmCommon = function(){
                $scope.confirmCommonModal.className = "modal hide";   
				// console.log($scope.choice);
				console.log("新课程添加");
				
				// 在数据库中新增加该老师的新课程
				$http({
					url:'/api/loadNewCourse',
					method:'POST',
					data:{loadCourseId:$scope.loadCourseId,teacherId:$scope.storage.id}
				}).success(function(response){
					if(response == "loadNewExp successful"){
						console.log("更新成功");
						// alert("课程导入成功");
						$scope.modalCommonId = document.getElementById("commonCourseModal");
						// 设置函数：用户点击取消按钮,隐藏模态框
			            $scope.closeModal = function(){
			                // $scope.modalCommonId.className = "modal hide";
			                $scope.modalCommonId.className = "modal hide";
			                window.location.reload();
			            }
	                    $scope.modalCommonId.className = "modal show";
						// $("#loadCourse").modal('hide');
						// 导入课程成功后，公共课程上面的按钮不可见
						// document.getElementById("loadButton").disabled=true;
					}else{
						// alert("该公共课程已经导入过，不可重复导入！");
						
                        $scope.CommonCourseModalId = document.getElementById("commonCourseFail");

                        $scope.CommonCourseModalId.className = "modal show";
                        // 设置函数：用户点击取消按钮,隐藏模态框
			            $scope.closeModal = function(){
			                // $scope.CommonCourseModalId.className = "modal hide";
			                $scope.CommonCourseModalId.className = "modal hide";
			                // $scope.choice = 0;
			            }
						// $("#loadCourse").modal('hide');
					}
					
				}).error(function(){
					console.log("数据库连接失败");
				});
			}
			// if($scope.choice == true){
				

			// }else{
			// 	console.log("取消");
			// }
		}

		// 传入模态框的是课程id
		$scope.loadExistCourse = function(){
			// 获取当前老师的所有现存课程:需要找到当前老师同类型的课程：notebook课程或novnc课程
			$http({
	            url:'/api/loadCourse',
	            method:'POST',
	            data:{loadCommonCourseId:$scope.loadCourseId,teacherId:$scope.storage.id}
	        }).success(function(response){
	            console.log(response);
	            $scope.allCourses = response.teacherCourse[0];
	            var j = 0;
	            $scope.courses = [];
	            // 当前选中的公共课程是否是notebook课程；1代表novnc；0代表notebook；
	            $scope.courseFlag = response.teacherCourse[1][0].vncNotebook;
	            for(var i = 0; i < $scope.allCourses.length; i ++){
	            	if($scope.courseFlag == $scope.allCourses[i].vncNotebook){
	            		console.log("找到与当前公共课程同类型的课程");
	            		$scope.courses[j] = $scope.allCourses[i];
	            		j ++;
	            	};
	            }
	            console.log($scope.courseFlag);
	            $scope.obj = document.getElementById("existCourse");
	           	$scope.ensureLoad = function(){
	           		$scope.obj = document.getElementById("existCourse");
	           		$scope.obj1 = document.getElementsByTagName("input");
	           		for(var i=0;i<$scope.obj1.length;i++){
	           			if($scope.obj1[i].checked){
	           				// 当前选中的老师的已有课程id
	           				$scope.existCourseId = $scope.obj1[i].value;
	           				console.log($scope.existCourseId);
	           			}
	           		}
	           		// 提醒用户是否确定执行相关的确定操作的模态框
		            $scope.confirmCommonModal = document.getElementById("confirmCommonModal");
		            // 提示框显示
		            $scope.confirmCommonModal.className = "modal show";
		            $scope.closeModal = function(){

		            	$scope.obj.className = "modal hide";
		                $scope.confirmCommonModal.className = "modal hide";
		                // $scope.choice = 0;
		                console.log("取消课程添加");
		                $window.location.reload();
		            }
	           		// $scope.choice = confirm("确定添加为已有课程？");
	           		$scope.confirmCommon = function(){
	           			// 提示框隐藏
		            	$scope.confirmCommonModal.className = "modal hide";
	           			console.log("已有课程添加");
						// 在数据库中新增加该老师的已有课程
						$http({
							url:'/api/loadExistCourse',
							method:'POST',
							data:{existCourseId:$scope.existCourseId,loadCourseId:$scope.loadCourseId,flag:$scope.courseFlag}
						}).success(function(response){
							console.log(response);
							// 当所有公共课程下的实验全部复制到教师自己课程下之后，loadExistCourse successful
							if(response == "loadExistCourse successful"){
								// alert("课程导入成功");
								$scope.modalCommonId = document.getElementById("commonCourseModal");
		                    	$scope.modalCommonId.className = "modal show";
		                    	$scope.closeModal = function(){
	                                $scope.modalCommonId.className = "modal hide";
	                                // 数据库更新成功后；如果当前页面中的图标为隐藏图标，需要更换为显示图片；如果为显示图标，则需要更换为隐藏图标
	                                $window.location.reload();
	                            }
							}
							
							// $("#existCourse").modal('hide');
							// $("#loadCourse").modal('hide');
						}).error(function(){
							console.log("数据库连接失败");
						})
	           		}
	           		// 设置函数：用户点击取消按钮,隐藏模态框
		            $scope.closeConfirm = function(){
		                $scope.obj.className = "modal hide";
		                $scope.confirmCommonModal.className = "modal hide";
		                // $window.location.reload();
		                console.log("取消课程添加");
		            }
					// console.log($scope.choice);
					// if($scope.choice == true){
						
					// }else{
					// 	$scope.CommonCourseModalId = document.getElementById("commonCourseFailModal");
     //                    $scope.CommonCourseModalId.className = "modal show";
					// 	$("#existCourse").modal('hide');
					// 	$("#loadCourse").modal('hide');
					// }
	           	}
	        }).error(function(){
	        	console.log("失败");
	        });
			
		}


		// 鼠标点击的课程ID
		$scope.currentCommonId = "";
		// 获取课程ID的函数
		$scope.getCommonId = function(index,index2){
			$scope.currentCommonId = index;
			console.log($scope.currentCommonId);
			$scope.vncOrNotebook = index2;
			$scope.storage.setItem("courseIdInfo",$scope.currentCommonId);
			// 课程所属的实验环境是vnv还是notebook
        	$scope.storage.setItem("vncOrNotebook",$scope.vncOrNotebook);
			// 跳转至详情，查看公共课程内容
			$state.go('app.courseDetails');
		}

	}]);