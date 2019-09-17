'use strict';

	//加载css文件
	function loadjscssfile(filename, filetype){
		if (filetype=="js"){
			var fileref=document.createElement('script')
			fileref.setAttribute("type","text/javascript")
			fileref.setAttribute("src", filename)
		}
		else if (filetype=="css"){
			var fileref=document.createElement("link")
			fileref.setAttribute("rel", "stylesheet")
			fileref.setAttribute("type", "text/css")
			fileref.setAttribute("href", filename)
		}
		if (typeof fileref!="undefined")
			document.getElementsByTagName("head")[0].appendChild(fileref)
	}

   	// 获取当前dom元素      
   	function getCrossBrowserElement(mouseEvent){        
   		var result = {          
   			x: 0,          
   			y: 0,          
   			relativeX: 0,          
   			relativeY: 0,          
   			currentDomId: ""       
   		};         
   		if (!mouseEvent){          
   			mouseEvent = window.event;        
   		}         
   		if (mouseEvent.pageX || mouseEvent.pageY){          
   			result.x = mouseEvent.pageX;          
   			result.y = mouseEvent.pageY;        
   		}else if (mouseEvent.clientX || mouseEvent.clientY){          
   			result.x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;  
   			result.y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;   
   		}         
   		result.relativeX = result.x;     
   		result.relativeY = result.y;    
   		if (mouseEvent.target){        
   			var offEl = mouseEvent.target;      
   			var offX = 0;        
   			var offY = 0;       
   			if (typeof(offEl.offsetParent) != "undefined"){   
   				while (offEl){           
   					offX += offEl.offsetLeft;      
   					offY += offEl.offsetTop;   
   					offEl = offEl.offsetParent;    
   				}         
   			}else{      
   				offX = offEl.x;   
   				offY = offEl.y; 
   			}       
   			result.relativeX -= offX;     
   			result.relativeY -= offY;       
   		}       
   		result.currentDomId = mouseEvent.target.id;       
   		return result;
   	}

   	app.controller('experimentalContent', [
   		'$rootScope', '$scope', '$http','$sce','$state','$compile',function($rootScope, $scope,$http,$sce,$state,$compile) {
		//alert($scope.storage.getItem("name"))
   		if($scope.storage.getItem("id")== null || $scope.storage.getItem("authority")== null) {
            //if(window.localStorage.getItem("name")=='' || window.localStorage.getItem("authority")=='' || window.localStorage.getItem("name")== null || window.localStorage.getItem("authority")== null){
            console.log('无效登录');
            $state.go("login");
            return;
        }
   		//加载css文件,发送开始时间
   		loadjscssfile("assets/css/content.css", "css");

		//实验目的、实验原理获取
		//实验目的的处理
		function handleCourseContenetSteps(steps) {
			var stepsArray1 = steps.split("\n");
			var stepsArray2 = new Array();
			for(var j in stepsArray1){
				if(j.indexOf("<img src=") != -1){//获得图片
					if(stepsArray2 == false){
						stepsArray2 = j;
					}else{
						stepsArray2 += j;
					}
				}else{
					if(stepsArray2 == false){//该变量未初始化
						stepsArray2 = "<li>" + stepsArray1[j] + "</li>";
					}else{//数组附加
						stepsArray2 += "<li>" + stepsArray1[j] + "</li>";
					}
				}
			}
			//获得实验目的
			$scope.courseContentSteps = stepsArray2;
		}
		//实验环境的处理
		function handleCourseContentEnvironments(enviro) {
			var stepsArray1 = enviro.split("\n");
			// console.log(stepsArray1);
			var stepsArray2 = new Array();
			for(var j in stepsArray1) {
				if(j.indexOf("<img src=") != -1) {
					if(stepsArray2 == false) {
						stepsArray2 = j;
					}else{
						stepsArray2 += j;
					}
				}else{
					if(stepsArray2 == false) {
						stepsArray2 = "<p>" + stepsArray1[j] + "</p>";
					}else {
						stepsArray2 += "<p>" + stepsArray1[j] + "</p>";
					}
				}
			}
			//获得实验环境
			$scope.courseContentEnvironments = stepsArray2;
		}
		//实验原理的处理
		function handleCourseContentPrinciples(prin) {
			$scope.courseContentPrinciples = prin;
		}
		//实验步骤的处理
		function handleCourseContentProcedures(proce) {
			$scope.courseContentProcedures = proce;
			//变量名说明
			//courseContentProcedures1：对服务器发送的整段实验步骤按换行符切分。
			//courseContentProceduresTitles ：实验步骤名数组
			//courseContentProcedures2 ：实验步骤名与实验步骤对应的字典数组
			//实验步骤处理
			//按标题切分实验步骤
			var i=0;//步骤名下标
			var courseContentProcedures1=proce.split("</p>");
			$scope.courseContentProceduresTitles=new Array();
			$scope.courseContentProcedures2=new Array();
			for(var j in courseContentProcedures1){
				if((courseContentProcedures1[j].indexOf('<strong>'))!=-1){//获得第i步标题
					$scope.courseContentProceduresTitles[i]=courseContentProcedures1[j].split('<strong>')[1].split('</strong>')[0];
					i++;
				}else{//属于第i-2步实验步骤
					if(courseContentProcedures1[j]!==''){//不接受空字符串
						if($scope.courseContentProcedures2[$scope.courseContentProceduresTitles[i-1]]==undefined){
							$scope.courseContentProcedures2[$scope.courseContentProceduresTitles[i-1]] = courseContentProcedures1[j] + '</p>';
						}else{
							$scope.courseContentProcedures2[$scope.courseContentProceduresTitles[i-1]] += courseContentProcedures1[j] + '</p>';
						}
					}
				}
			}				
			//实验步骤栏数据变量初始化
			$scope.myVar = $scope.courseContentProceduresTitles[0];
			$scope.procedure = $scope.courseContentProcedures2[$scope.myVar];
			console.log($scope.courseContentProceduresTitles);
			console.log($scope.courseContentProcedures2);
		}

		$http.get('/api/getSteps').then(function(response){
			if(response.status==200){		
				$scope.sectionName = response.data.courseContentName;
				console.log(response.data);
				// 将实验名称放在缓存区方便悬浮框
				$scope.storage.setItem("expName",$scope.sectionName);
				handleCourseContenetSteps(response.data.courseContentSteps);//实验目的
				handleCourseContentEnvironments(response.data.courseContentEnvironments);//实验环境
				handleCourseContentPrinciples(response.data.courseContentPrinciples);//实验原理	
				handleCourseContentProcedures(response.data.courseContentProcedures);//实验步骤				
			}
			else{
				console.log(response.status);
			}
		});

		// 左侧侧边栏展示
		$scope.rightSidebar = {
			"width" : "calc(65vw - 11px)",
		};
		$scope.leftSidebar = {
			"width" : "calc(35vw - 11px)",
		};
		$scope.cursorResize={
			"cursor" : "col-resize",
			"visibility" : "visible",
		};
		//左侧标签栏缩放事件
		$scope.displayLeft=function(){
			if($scope.sidebarState=="show"){
				$scope.sidebarState="none";
				$scope.rightSidebar.width="100vw";
				$scope.leftSidebar.width="0px";
				$scope.cursorResize.cursor="auto";
				$scope.cursorResize.visibility="hidden";
			}else{
				$scope.sidebarState="show";
				$scope.rightSidebar.width="calc(65vw - 11px)";
				$scope.leftSidebar.width="calc(35vw - 11px)";
				$scope.cursorResize.cursor="col-resize";
				$scope.cursorResize.visibility="visible";
			}
		};

		//左侧标签栏切换事件	
		$scope.showWho=function(divId){
			if(divId==1){
				$scope.show1="dataSee";
				$scope.tabShow1="activeTab";
				$scope.tab_sec="tab_sec_ac";
				$scope.show2="dataInvi";
				$scope.tabShow2="stunTab";
				$scope.tab_fir="tab_fir_st";
				$scope.show3="dataInvi";
				$scope.tabShow3="stunTab";
				$scope.tab_third="tab_third_st";
			}else if(divId==2){
				$scope.show1="dataInvi";
				$scope.tabShow1="stunTab";
				$scope.tab_sec="tab_sec_st";
				$scope.show2="dataSee";
				$scope.tabShow2="activeTab";
				$scope.tab_fir="tab_fir_ac";
				$scope.show3="dataInvi";
				$scope.tabShow3="stunTab";
				$scope.tab_third="tab_third_st";
			}else if(divId==3){
				$scope.show1="dataInvi";
				$scope.tabShow1="stunTab";
				$scope.tab_sec="tab_sec_st";
				$scope.show2="dataInvi";
				$scope.tabShow2="stunTab";
				$scope.tab_fir="tab_fir_st";
				$scope.show3="dataSee";
				$scope.tabShow3="activeTab";
				$scope.tab_third="tab_third_ac";
			}
		}

		//提示栏单击事件
		$scope.focus=0;
		$scope.displayProcedure=function(title,$index){
			$scope.myVar = title;
			// console.log($scope.listshow[$index]);
			$scope.focus = $index;
			// console.log($scope.myVar);
		};
		
		//实验步骤初始化
		$scope.isCurProcedure=function(myVar){		
			$scope.title=myVar;
			if(myVar!=null){
				$scope.procedure=$sce.trustAsHtml($scope.courseContentProcedures2[myVar]);
			}
			return true;
		};

		//中间栏拖动事件
		$scope.onCanvasClicked = function(event){
			document.onmousemove = function(event){
				var position = getCrossBrowserElement(event);
				$scope.$apply(function(){
					if((position.x)>360){
						$scope.leftSidebar.width=position.x;
					}					
					$scope.rightSidebar.width=window.innerWidth - $scope.leftSidebar.width - 22;
				});
				return false;
			};
			document.onmouseup = function() { 
				document.onmousemove = null; 
				document.onmouseup = null;
			};				
		};

		//vnc页面大小调整事件
		function changeIframeSize(height,width) {
			document.getElementById("masterMachine").height = height;
			document.getElementById("masterMachine").width = width;
		}

		//安全跨域函数
		$scope.trustSrc = function(src) {
			$scope.scr = src;
			console.log($scope.src);
			return $sce.trustAsResourceUrl(src);
		};	
		//vnc启动事件
		$scope.vncState='未启动';
		$scope.vncLoading = false;
		$scope.vncStateColor={
			"background" : "#979eb2"
		};

		console.log($scope.storage.moduleIdInfo);
		if($scope.storage.moduleIdInfo == 48){
			$scope.hadoopFlag = 1;
		}else{
			$scope.hadoopFlag = 0;
		}
		$scope.launch_vnc = function(){
			console.log('launch_vnc');
			
			// 将是否开启虚拟机标签传递给父控制器
			// $scope.storage.setItem("currentExp",$scope.windowFlag);
			// $scope.$emit("curExp",$rootScope.windowFlag);
			$scope.vncState='启动中';
			$scope.vncStateColor.background="#3fa9f5";
			$scope.vncLoading = true;
			if($scope.storage.moduleIdInfo == 48){
				console.log("hadoop集群实验");
				$http.post('/api/launchHadoop',{
					userName:$scope.storage.id
				}).then(function(response){
					console.log(response);
				});
			}else{
				console.log("其他实验");
				$http.post('/api/launchVNC',{
					userName : $scope.storage.id
				}).then(function(response){
					if(response.status==200){					
						console.log(response.data);
						$scope.vncLoading = false;
						$scope.master_vnc_url=response.data.masterVncUrl;
						console.log($scope.master_vnc_url);
						$scope.slave1_vnc_url=response.data.slave1VncUrl;
						$scope.slave2_vnc_url=response.data.slave2VncUrl;
						$scope.slave3_vnc_url=response.data.slave3VncUrl;
						$scope.vncState='已启动';
						$scope.vncStateColor.background="#7ac943";
						$scope.clock.judge=true;
						// window.open($scope.master_vnc_url);
						// 设置悬浮窗显示
						$scope.windowFlag = 1;
						// 需要把悬浮窗标签存储到缓存区，即使刷新页面，正在运行虚拟机时仍然能够显示
						$scope.storage.setItem("windowFlag",$scope.windowFlag);
						// $("#vncMachine").contentWindow.focus();
							
						// var obj = document.getElementById("masterMachine");
						// if(!obj){//如果iframe不存在，创建新标签页
						// 	var vncHtml = '<iframe ng-src="{{trustSrc(master_vnc_url)}}" style="width: 100%;height: 100%" id="masterMachine" ng-model="iframeURL" ng-change="iframeURL()></iframe>';
						// 	var template = angular.element(vncHtml);
						// 	var mobileDialogElement = $compile(template)($scope);
						// 	angular.element("#vncMachinePa").append(mobileDialogElement);
						// }

						// 点击第一个操作机
						$scope.masterMachine = function(){
							console.log("master");
							window.open($scope.master_vnc_url,"master");
							// var parentTarget = document.getElementById('vncMachinePa');
							// var target = document.getElementById('masterMachine');
							// var target1 = document.getElementById('slave1Machine');
							// var target2 = document.getElementById('slave2Machine');
							// var target3 = document.getElementById('slave3Machine');
							// target.style = "display:block;width: 100%;height: 100%";
							// target1.style = "display:none;";
							// target2.style = "display:none;";
							// target3.style = "display:none;";
							// parentTarget.removeChild(target2);
							// console.log(parentTarget);
						}
						// 点击第二个操作机
						$scope.slave1Machine = function(){
							console.log("slave1");
							window.open($scope.slave1_vnc_url,"slave1");
							// var vncHtml = '<iframe ng-src="{{trustSrc(slave1_vnc_url)}}" style="width: 100%;height: 100%" id="slave1Machine"></iframe>';
							// var template = angular.element(vncHtml);
							// var mobileDialogElement = $compile(template)($scope);
							// angular.element("#vncMachinePa").append(mobileDialogElement);
							// var parentTarget = document.getElementById('vncMachinePa');
							// var target = document.getElementById('masterMachine');
							// var target1 = document.getElementById('slave1Machine');
							// var target2 = document.getElementById('slave2Machine');
							// var target3 = document.getElementById('slave3Machine');
							// target.style = "display:none;";
							// target1.style = "display:block;width: 100%;height: 100%";
							// target2.style = "display:none;";
							// target3.style = "display:none;";
							// // parentTarget.removeChild(target2);
							// console.log(parentTarget);
						}
						$scope.slave2Machine = function(){
							console.log("slave2");
							window.open($scope.slave2_vnc_url,"slave2");
							// var vncHtml = '<iframe ng-src="{{trustSrc(slave2_vnc_url)}}" style="width: 100%;height: 100%" id="slave2Machine"></iframe>';
							// var template = angular.element(vncHtml);
							// var mobileDialogElement = $compile(template)($scope);
							// angular.element("#vncMachinePa").append(mobileDialogElement);
							// var parentTarget = document.getElementById('vncMachinePa');
							// var target = document.getElementById('masterMachine');
							// var target1 = document.getElementById('slave1Machine');
							// var target2 = document.getElementById('slave2Machine');
							// var target3 = document.getElementById('slave3Machine');
							// target.style = "display:none;";
							// target1.style = "display:none;";
							// target2.style = "display:block;width: 100%;height: 100%";
							// target3.style = "display:none;";
						}
						$scope.slave3Machine = function(){
							console.log("slave3");
							window.open($scope.slave3_vnc_url,"slave3");
							// var vncHtml = '<iframe ng-src="{{trustSrc(slave3_vnc_url)}}" style="width: 100%;height: 100%" id="slave3Machine"></iframe>';
							// var template = angular.element(vncHtml);
							// var mobileDialogElement = $compile(template)($scope);
							// angular.element("#vncMachinePa").append(mobileDialogElement);
							// var parentTarget = document.getElementById('vncMachinePa');
							// var target = document.getElementById('masterMachine');
							// var target1 = document.getElementById('slave1Machine');
							// var target2 = document.getElementById('slave2Machine');
							// var target3 = document.getElementById('slave3Machine');
							// target.style = "display:none;";
							// target1.style = "display:none;";
							// target2.style = "display:none;";
							// target3.style = "display:block;width: 100%;height: 100%";
							// // parentTarget.removeChild(target2);
							// console.log(parentTarget);
						}
					}
					else{
						console.log(response.status);
						$scope.vncLoading = false;
						$scope.vncState='未启动';
						$scope.vncStateColor.background="#979eb2";
						window.alert("虚拟机启动失败");
					}
				});
			}
			
		};
		
		setInterval(function(){
			var masterMachine = document.getElementById("masterMachine");
			if(masterMachine){
				masterMachine.contentWindow.focus();
			}
		},1000);

		//vnc关闭事件
		$scope.shutdown_vnc = function(){
			console.log('shutdown_vnc');
			$scope.windowFlag = 0;
			// 关闭实验后实验标签设置为0
			$scope.storage.setItem("windowFlag",$scope.windowFlag);
			// console.log($scope.storage.name);
			$http.post('/api/shutdownVNC',{
				userName : $scope.storage.id
			});
			//虚拟机页面标签移除，页面动画改变
			// var target = document.getElementById('vncMachinePa');
			// target.removeChild(target);
			$scope.vncState='未启动';
			$scope.vncStateColor.background="#979EB2";
			$scope.clock.judge=false;
		}
		
		//虚拟机开启计时函数
		$scope.clock={
			'judge':false,
			'hour':0,
			'minute':0,
			'second':0
		};
		// 当用户在悬浮窗口点击关闭虚拟机快捷键时，flag标签为1，可以触发VNC关闭事件
		// if($rootScope.closeVNCFlag == 1){
		// 	// 调用关闭事件函数
		// 	$scope.shutdown_vnc();
		// };
		var updateClock = function(){
			$scope.clock.second++;
			if($scope.clock.second==60){
				$scope.clock.second=0;
				$scope.clock.minute++;
				if($scope.clock.minute==60){
					$scope.clock.hour++;
					$scope.clock.minute=0;
				}
			}
		};

		setInterval(function(){
			if($scope.clock.judge){
				$scope.$apply(updateClock);
			}
		},1000);
		
		//css移除事件
		function removeJsCssFile(filename, filetype){
			var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"
			var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"
			var allsuspects=document.getElementsByTagName(targetelement)
			for (var i=allsuspects.length; i>=0; i--){
				if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
					allsuspects[i].parentNode.removeChild(allsuspects[i])
			}
		}

		//退出函数
		var quir = 0;
		$scope.quitCur = function(){
			console.log("退出实验函数");
			console.log($scope.storage.expName);
			$http.post('/api/sendEndTime', { 
				userName    : $scope.storage.id,
				ipAdd       : returnCitySN["cip"], 
				course      : $scope.sectionName,
				vncTimeHour : $scope.clock.hour,
				vncTimeMin  : $scope.clock.minute,
				vncTimeSec  : $scope.clock.second,
				expName     : $scope.storage.expName
			}).success(function(response){
				console.log("准备退出"+response.end);
				quir = response.end;				
				if(quir==1){
					removeJsCssFile("content.css","css");
					$state.go('app.courseDetails');
				}
			});
		};
	}]);