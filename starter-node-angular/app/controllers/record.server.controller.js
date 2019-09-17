//从数据库获取学习记录数据表
exports.getRecord = function(req,res){
	
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect!");
			res.status(500).json(err);
		};
		// 老师获取课程下的所有记录
		conn.query('SELECT record_id as recordId,recordTable.expId,recordTable.courseName,count(*) as recordcount, count(distinct(userName)) as usercount, sum(LearningTime) as sumLearningTime, max(onTime) as lastonTime FROM courseSystem.recordTable,courseTable,experienceTable where recordTable.expId=experienceTable.experienceId and experienceTable.belong = courseTable.courseId group by courseName order by lastonTime desc',function(err,rows){
			//conn.destroy();
			if(err){
				console.log(err);
				res.status(200).json({"record":""});//数据库无数据
			}else{
				console.log(rows);
				res.status(200).json({"record":rows});//数据库有数据
			}
		});
	//conn.release();
	})
};
exports.getUserRecord = function(req,res){
// 学生获取自己的实验记录信息
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect!");
			res.status(500).json(err);
		};
		var username=req.body.username;//当前用户id
        //console.log(username);
		conn.query("SELECT record_id as recordId,recordTable.expId,recordTable.courseName,count(*) as recordcount, count(distinct(userName)) as usercount, sum(LearningTime) as sumLearningTime, max(onTime) as lastonTime FROM courseSystem.recordTable where userName = '"+username+"' group by courseName order by lastonTime desc",function(err,rows){
			//conn.destroy();
			if(err){
				console.log(err);
				res.status(200).json({"record":""});//数据库无数据
			}else{
				//console.log(rows);
				res.status(200).json({"record":rows});//数据库有数据
			}
		});
	//conn.release();
	})
};

//获取当前模块的详细学习记录
exports.getLearningRecordDetails = function(req,res){
	//传递过来的参数是学习记录详情的id
	console.log(req.body);
	var currentId = req.body.expId;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect!");
			res.status(500).json(err);
		};
		conn.query("SELECT * FROM recordTable WHERE expId = '" + currentId +"' order by onTime desc;",function(err,rows){
			//conn.destroy();
			if(err){
				console.log(err);
				res.status(200).json({"recordDetails":""});//数据库中无数据
			}else{
				console.log(rows);
				res.status(200).json({"recordDetails":rows});//数据库中有数据
			}
		});
		
	//conn.release();
	})
};


exports.getUserLearningRecordDetails = function(req,res){
	//传递过来的参数是学习记录详情的id
	console.log(req.body);
	var currentId = req.body.expId;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect!");
			res.status(500).json(err);
		};
		conn.query("SELECT * FROM recordTable WHERE expId = '" + currentId +"' and userName = '"+ req.session.userId + "' order by onTime desc;",function(err,rows){
			//conn.destroy();
			if(err){
				console.log(err);
				res.status(200).json({"recordDetails":""});//数据库中无数据
			}else{
				// console.log(rows);
				res.status(200).json({"recordDetails":rows});//数据库中有数据
			}
		});

	//conn.release();
	})
};

//获取模块（目前为：实验）名称
exports.getModuleInfo = function(req,res){
	//传递参数为experienceId
	var experienceId = req.body.id;
	console.log(experienceId);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect!");
			res.status(500).json(err);
		};
		conn.query('SELECT * FROM experienceTable WHERE experienceId = ' + experienceId + ' order by onTime desc;',function(err,rows){
			//conn.destroy();
			if(err){
				console.log(err);
				res.status(200).json({"moduleInfo":""});//数据库中无数据
			}else{
				console.log(rows);
				res.status(200).json({"moduleInfo":rows});//有数据
			}
		});
	//conn.release();
	})
}

//vnc启动时长
function vncTimeCount(hour,min,sec){
	var consequence = "";
	if(hour>0){
		consequence += hour + "小时";
	}
	if(min>0){
		consequence += min + "分钟";
	}
	if(sec>0){
		consequence += sec + "秒";
	}
	return consequence;
}
/*
//GMT时间切分


//计算学习时长，结束时间减去开始时间(今后对某用户需要对已经记录过的学习时间加进来)
function subtract(start,end,addTime){
	var consequence = "";
	if(addTime == 0){//第一次计算学习时长
		consequence = parseInt(end) - parseInt(start);
	}else{//需要加上之前的学习时长
		consequence = parseInt(end) - parseInt(start) + parseInt(addTime);
	}
	return consequence;
}
*/
//结束学习时间记录，本次学习时间归档数据库
exports.sendEndTime= function(req,res) {
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		}else{
			//用户名： userName userName
			//课程章节名字： course courseName
			//课程id：courseContent
			//学习开始时间： onTime onTime
			//vnc时长： vncTime vncTime
			//ip地址： ip ip
			//结束学习时间： offTime offTime
			//学习时长获取： LearningTime LearningTime		
			var userName = req.body.userName;//用户名id		
			var course = req.body.course;//课程章节名字获取			
			var onTime = req.session.firsttimeAccess;	//学习开始时间获取
			var courseId = req.session.courseContent;//	课程id
			var expId = req.session.experimentalId;//实验id
			var vncTime = vncTimeCount(req.body.vncTimeHour,req.body.vncTimeMin,req.body.vncTimeSec);//vnc时长获取
			var ip = req.body.ipAdd;//ip地址获取
			var offTime = new Date().getTime();		//服务器生成学习结束时间
			//var offTime = divideDate(new Date(EndTime));	//结束学习时间获取
			// var LearningTime = subtract(onTime,offTime);//学习时长获取

			//记入数据库中
			//var querystring = "SELECT * FROM recordTable WHERE userName = ? AND courseName = ?";//查询语句，判断
			//var updateString = "UPDATE recordTable SET LearningTime = ? , onTime = ? , offTime = ? ,ip = ? , vncTime = ? , courseName= ? WHERE userName = ? ";
			var insertString = "INSERT INTO recordTable (LearningTime , onTime , offTime ,ip , vncTime , courseName , userName, expId) VALUES (?,?,?,?,?,?,?,?)"
			/*var judge = "";
			//首先查询判断数据库是否已存在该类数据
			conn.query(querystring,[userName,course],function(err,ContentSteps){
				//conn.destroy();
				if(err){
					console.log(err);
					// res.status(200).json({"courseContentSteps":"","courseContentEnvironments":"","courseContentPrinciples":"","courseContentProcedures":""});//数据库无数据
				}else{
					// console.log(ContentSteps[0].courseName+ "判断");
					judge = ContentSteps[0];
					if(typeof(judge) !== "undefined"){
						// console.log("非空");
						// console.log(ContentSteps[0].LearningTime);
						var LearningTime = subtract(req.session.firsttimeAccess,req.body.EndTime,ContentSteps[0].LearningTime);//学习时长获取
						conn.query(updateString,[LearningTime,onTime,offTime,ip,vncTime,course,userName],function(err,ContentSteps){
							if(err){
								console.log(err);
							}else{
								console.log("数据更新成功！");
								res.status(200).json({"end":"1"});
							}
						});	
					}else{*/
						// console.log("空数据");
						var LearningTime = parseInt((offTime-onTime)/1000);//学习时长获取
						conn.query(insertString,[LearningTime,onTime,offTime,ip,vncTime,course,userName,expId],function(err,ContentSteps){
							if(err){
								console.log(err);
							}else{
								console.log("数据插入成功！");
								res.status(200).json({"end":"1"});
							}
						});
					/*}
				}
			});*/
		}
	//conn.release();
	});
}

