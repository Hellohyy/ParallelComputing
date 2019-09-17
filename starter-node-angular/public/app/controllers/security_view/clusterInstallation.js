'use strict';
	

app.controller('clusterInstallationCtrl',[
	'$rootScope','$scope','$http','$sce','$state','$compile',function($rootScope, $scope, $http,$sce,$state,$compile) {

  console.log("clusterInstallation");
  //加载css文件
	// function loadjscssfile(filename, filetype){
	// 	if (filetype=="js"){
	// 		var fileref=document.createElement('script')
	// 		fileref.setAttribute("type","text/javascript")
	// 		fileref.setAttribute("src", filename)
	// 	}
	// 	else if (filetype=="css"){
	// 		var fileref=document.createElement("link")
	// 		fileref.setAttribute("rel", "stylesheet")
	// 		fileref.setAttribute("type", "text/css")
	// 		fileref.setAttribute("href", filename)
	// 	}
	// 	if (typeof fileref!="undefined")
	// 		document.getElementsByTagName("head")[0].appendChild(fileref)
	// }
 //  //加载css文件,发送开始时间
 //  loadjscssfile("assets/css/content.css", "css");
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
  // 从数据库中读取hadoop集群安装实验的实验内容
  $http.get('/api/getHadoop').then(function(response){
  	console.log(response.data.hadoopContent);
  	handleCourseContenetSteps(response.data.hadoopContent.experienceObjective);//实验目的
	handleCourseContentEnvironments(response.data.hadoopContent.experienceEnvironment);//实验环境
	handleCourseContentPrinciples(response.data.hadoopContent.experiencePrinciple);//实验原理	
	handleCourseContentProcedures(response.data.hadoopContent.experienceProcedures);//实验步骤		
  })

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

	//vnc启动事件
	$scope.vncState='未启动';
	$scope.vncLoading = false;
	$scope.vncStateColor={
		"background" : "#979eb2"
	};

	// 启动hadoop集群安装虚拟机
	$scope.launch_hadoop = function(){
		console.log('launch_hadoop_vnc');
		$scope.vncState='启动中';
		$scope.vncStateColor.background="#3fa9f5";
		$scope.vncLoading = true;
		$http.post('/api/launchHadoopVNC',{
			userName : $scope.storage.id
		}).then(function(response){
			console.log(response);
			console.log(response.data);
			console.log(response.data.ubuntuURL[0].port);
			if(response.status == 200){
				if(response.data.ubuntuURL.length == 4){
					$scope.vncState='已启动';
					$scope.vncStateColor.background="#7ac943";
					$scope.ubuntu1 = "http://1.119.44.205:" +response.data.ubuntuURL[0].port+ "/vnc_lite.html?path=?token="+response.data.ubuntuURL[0].token;
					$scope.ubuntu2 = "http://1.119.44.205:" +response.data.ubuntuURL[1].port+ "/vnc_lite.html?path=?token="+response.data.ubuntuURL[1].token;
					$scope.ubuntu3 = "http://1.119.44.205:" +response.data.ubuntuURL[2].port+ "/vnc_lite.html?path=?token="+response.data.ubuntuURL[2].token;
					$scope.ubuntu4 = "http://1.119.44.205:" +response.data.ubuntuURL[3].port+ "/vnc_lite.html?path=?token="+response.data.ubuntuURL[3].token;
					console.log($scope.ubuntu1);
					console.log($scope.ubuntu2);
					//点击操作机
					$scope.machine = function(index){
						// 点击操作机之后，打开对应的操作机页面
						if(index == 1){
							window.open($scope.ubuntu1);
						}else if(index == 2){
							window.open($scope.ubuntu2);
						}else if(index == 3){
							window.open($scope.ubuntu3);
						}else if(index == 4){
							window.open($scope.ubuntu4);
						}
					}
				}else{
					console.log("虚拟机未启动四个");
					$http.post('/api/launchHadoopVNC',{
						userName : $scope.storage.id
					}).then(function(response){

					});
				}
			}
		});
	}
		
}] );