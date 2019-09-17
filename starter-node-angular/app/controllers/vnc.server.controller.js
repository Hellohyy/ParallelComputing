const callfile = require("child_process");

// 获取hadoop集群安装的实验内容信息
exports.getHadoop = function(req,res){
	console.log("hadoop集群安装");
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var queryString = "select * from experienceTable where experienceId = 48;";
		conn.query(queryString,function(err,rows){
			console.log(rows);
			if(err){
				console.log(err);
				res.status(200).json({"hadoopContent":""});//数据库中无数据
			}else{
				console.log(rows[0]);
				res.status(200).json({"hadoopContent":rows[0]})//数据库中有数据
			}
		})
	})
}

// 启动hadoop集群
exports.launchHadoopVNC = function(req,res){
	console.log("启动hadoop集群内容");
	console.log(req.body)
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var userName = req.body.userName;
		var sessionId = req.sessionID;
		console.log(sessionId);
		var string = "select count(novncId) as flagNum from vnc_ubuntuTable where novncId = '"+userName+"';"
		conn.query(string,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"ubuntuURL":""});//数据库中无数据
			}else{
				console.log(rows[0]);
				if(rows[0].flagNum == 0){
					//从未启动过Ubuntu，需要首次启动，执行启动脚本
					console.log("从未启动过11111");
					callfile.exec('/opt/confdir/run_ubuntu.sh'+' '+userName+' '+sessionId,function(err, stdout, stderr){
						if(err) {
							console.log('error:'+err);
							return;
						}else{
							console.log(stdout);
							console.log("启动成功");
							for(var start = +new Date; +new Date - start <= 1000 * 5; ) { }
							var ubuntu1 = "";
							var ubuntu2 = "";
							var ubuntu3 = "";
							var ubuntu4 = "";
							var queryString1 = "SELECT distinct token,port FROM vnc_ubuntuTable where novncId = '"+userName+"';";
							console.log(queryString1);
							conn.query(queryString1,function(err,rows){
								console.log(rows);
								if(err){
									console.log(err);
									res.status(200).json({"ubuntuURL":""});//数据库中无数据
								}else{
									console.log(rows.length);
									// while(rows.length < 4){
									// 	console.log(rows.length);
									// 	console.log("少于4");
									// 	for(var start = +new Date; +new Date - start <= 1000 * 5; ) { }
									// 	conn.query(queryString1,function(err,rows){
									// 		console.log(rows);
									// 		var rows1 = rows;
									// 	})	
									// }
									if(rows.length < 4){
										console.log("少于4");
										for(var start = +new Date; +new Date - start <= 1000 * 5; ) { }
										conn.query(queryString1,function(err,rows1){
											console.log(rows1);
											if(err){
												console.log(err);
												res.status(200).json({"ubuntuURL":""});//数据库中无数据
											}else{
												res.status(200).json({"ubuntuURL":rows1});
											}
										})
									}else{
										res.status(200).json({"ubuntuURL":rows});
									}
									
									// ubuntu1 = "http://1.119.44.205:" +rows[1].port+ "/vnc_lite.html?path=?token="+rows[1].token;
									// ubuntu2 = "http://1.119.44.205:" +rows[0][1].port+ "/vnc_lite.html?path=?token="+rows[0][1].token;
									// ubuntu3 = "http://1.119.44.205:" +rows[0][2].port+ "/vnc_lite.html?path=?token="+rows[0][2].token;
									// ubuntu4 = "http://1.119.44.205:" +rows[0][3].port+ "/vnc_lite.html?path=?token="+rows[0][3].token;
									// console.log(ubuntu1);
									// console.log(ubuntu2)
									// res.status(200).json({"ubuntu1":ubuntu1,"ubuntu2":ubuntu2,"ubuntu3":ubuntu3,"ubuntu4":ubuntu4});
								}
							});
						}
						
					});
				}else{
					//ubuntu已经启动过，不需要执行启动脚本
					console.log("已经启动过");
					var ubuntu1 = "";
					var ubuntu2 = "";
					var ubuntu3 = "";
					var ubuntu4 = "";
					var queryString = "SELECT distinct token,port FROM vnc_ubuntuTable where novncId = '"+userName+"';";
					console.log(queryString);
					conn.query(queryString,function(err,rows){
						console.log(rows);
						if(err){
							console.log(err);
							res.status(200).json({"ubuntuURL":""});//数据库中无数据
						}else{
							ubuntu1 = "http://1.119.44.205:" +rows[0].port+ "/vnc_lite.html?path=?token="+rows[0].token;
							console.log(ubuntu1);
							res.status(200).json({"ubuntuURL":rows});
						}
					});
				}
				
			}
		})
		
	})
}

//启动VNC请求
exports.launchVNC = function(req,res){
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var usrName = req.body.userName;
		var sessionID = req.sessionID;
		callfile.exec('/opt/confdir/bootscript.sh'+' '+usrName+' '+sessionID,function(err, stdout, stderr){
			if(err) {
				console.log('error:'+err);
				return;
			}
		});
		console.log('postVNC');
		//延时十秒，读数据库获得url
		for(var start = +new Date; +new Date - start <= 1000 * 5; ) { } 
			//var slavestring = "SELECT port,token FROM vnc_dockerTable where sessionID = ? AND token LIKE 'hadoop-slave%'";
			var string = "SELECT port,token FROM vnc_dockerTable where sessionID = ? AND token LIKE 'hadoop-master%';SELECT port,token FROM vnc_dockerTable where sessionID = ? AND token LIKE 'hadoop-slave%'";
			console.log(string);
			var masterVncUrl="";
			var slave1VncUrl="";
			var slave2VncUrl="";
			var slave3VncUrl="";
		// conn.query(masterstring,[sessionID],function(err,token){
		// 	console.log(token);
		// 	if(err){
		// 		console.log(err);
		// 		res.status(200).json({"vncurl":""});//数据库无数据
		// 	}else{
		// 		masterVncUrl = "http://1.119.44.205:" +token[0].port+ "/vnc_lite.html?path=?token="+token[0].token;
		// 		console.log(masterVncUrl);
		// 		res.status(200).json({"masterVncUrl":masterVncUrl});//返回url
		// 	}
		// })
		
		conn.query(string,[sessionID,sessionID],function(err,token){
			//conn.destroy();
			console.log(token);
			if(err){
				console.log(err);
				res.status(200).json({"vncurl":""});//数据库无数据
			}else{
				masterVncUrl = "http://1.119.44.205:" +token[0][0].port+ "/vnc_lite.html?path=?token="+token[0][0].token;
				slave1VncUrl = "http://1.119.44.205:" +token[1][0].port+ "/vnc_lite.html?path=?token="+token[1][0].token;
				slave2VncUrl = "http://1.119.44.205:" +token[1][1].port+ "/vnc_lite.html?path=?token="+token[1][1].token;
				slave3VncUrl = "http://1.119.44.205:" +token[1][2].port+ "/vnc_lite.html?path=?token="+token[1][2].token;
				console.log(slave1VncUrl);
				console.log(slave2VncUrl);
				console.log(slave3VncUrl);
				res.status(200).json({"masterVncUrl":masterVncUrl,"slave1VncUrl":slave1VncUrl,"slave2VncUrl":slave2VncUrl,"slave3VncUrl":slave3VncUrl});//返回url
			}
		});
	//conn.release();
})
};

// 获取当前正在进行的实验
exports.getcurrentExp = function(req,res){
	console.log("当前正在进行的实验");
	console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		
	});
}
//停止vnc请求
exports.shutdownVNC = function(req,res) {
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		}else{
			var usrName = req.body.userName;
			var sessionID = req.sessionID;
			callfile.exec('/opt/confdir/recycle.sh'+' '+usrName+' '+sessionID,function(err,stdout,stderr){
				if(err) {
					console.log('error:'+err);
					return;
				}
			});
		}
	//conn.release();
});
}

//notebook url请求 
//传入参数：用户名 userName,实验名 experimentName
exports.launchNB = function(req,res){
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var usrName = req.body.userName;
		var expId   = req.body.expId;
		var expName = req.session.experimentalContent;
		console.log("这里是notebook url请求:"+ usrName + expName);
		//查库获得userID和实验ID
		var query = "SELECT userID,authority FROM userTable WHERE userId= ? ;SELECT teacherName,isGonggong FROM courseTable WHERE courseId = (SELECT belong FROM experienceTable WHERE experienceId = ?);"
		conn.query(query,[usrName,expId,expId],function(err,results){
			if(err){
				console.log(err);
				res.status(200).json({"vncurl":""});
			}else{
				var userID = results[0][0].userID;
				var authority =results[0][0].authority;
				var teachername = results[1][0].teacherName;
				var isGonggong = results[1][0].isGonggong;
				console.log("当前的用户权限是"+authority);
				console.log("当前课程所有者是"+teachername);
				console.log("当前课程是公共课程"+isGonggong);
				//缺失，判断执行启动还是重启脚本
				//判断是老师用户还是学生用户，分别执行CPU版本的notebook和GPU版本的notebook
				//公共管理员进入教师走学生流程，进公共课走老师流程
				//教师查看自己的课程在自己目录下，教师走公共课程走学生路线
				//启动notebook
				if(teachername==usrName || (authority == 2 && isGonggong == 1)){
					console.log("当前notebook接入用户身份是所有者");
					callfile.exec('/opt/confdir/run_notebook_tc.sh' + ' ' + userID + ' ' + expId,function(err,stdout,stderr){
						if(err) {
							console.log('error:'+err);
							return;
						}
					});
				}else{
					console.log("当前notebook接入用户身份是其他人");
					callfile.exec('/opt/confdir/run_notebook.sh'+ ' ' + userID + ' ' + expId,function(err,stdout,stderr){
						if(err) {
							console.log('error:'+err);
							return;
						}
					});
				}
				for(var start = +new Date; +new Date - start <= 1000 * 7; ) { }
				//查询url并发送
				var querystring = "SELECT token,port FROM nbEstablishTable WHERE userID = ? and expID = ?";
				var vncurl="";
				var notebook_ip = '1.119.44.204';
				//console.log("发送url");
				conn.query(querystring,[userID,expId],function(err,token){
					if(err){
						console.log(err);
						res.status(200).json({"vncurl":""});
					}else{
						NBurl = "http://" + notebook_ip + ":" + token[0].port + "?token=" + token[0].token;
						console.log("notebookIP地址" + NBurl);
						res.status(200).json({"NBurl":NBurl,
							"expName":expName});
					}
				})
			}
		});
	})
}

//notebook关闭
exports.shutdownNB = function(req,res){
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var usrName = req.body.userName;//userName中存储的是用户id
		var expName = req.session.experimentalContent;
		var expId   = req.body.expId;
		console.log("即将关闭notebook"+usrName+expName);
		//查库获得userID和实验ID
		var query = "SELECT userID FROM userTable WHERE userId= ? ;SELECT experienceId FROM experienceTable WHERE experienceId = ? ;"
		conn.query(query,[usrName,expId],function(err,results){
			if(err){
				console.log(err);
				res.status(200).json({"vncurl":""});
			}else{
				var userID = results[0][0].userID;
				var expID = results[1][0].experienceId;
				console.log("二次确认，即将关闭notebook,"+userID+expID);
				//关闭notebook
				callfile.exec('/opt/confdir/stop_notebook.sh' + ' ' + userID + ' ' + expID,function(err,stdout,stderr){
					if(err) {
						console.log('error:'+err);
						return;
					}
				});
			}
		});
	})
}

//查询是否已经开启过vnc
exports.selectVNC = function(req,res){
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect selectVNC!");
			res.status(500).json(err);
		}else{
			var selectSQL = "SELECT VMname FROM vncEstablishTable WHERE userName = ?";
			
		}
	//conn.release();
})
}
