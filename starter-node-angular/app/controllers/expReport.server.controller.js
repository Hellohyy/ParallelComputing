//获取实验报告所属课程ID与名称
exports.getcourseinfo = function(req,res){
	// 保存传递过来的名称信息
	var teacherName = req.body.teacherName;
	console.log("用户id："+teacherName);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
	// 从数据库中读取与当前老师姓名一样的课程数据
		var sql = '';
		if (req.session.authority == 1)
			sql = 'SELECT courseName,courseId,coursePicture FROM courseTable WHERE teacherName="' + teacherName +'";';
		else{
			// 学生所有所在的课程
			// 找到某个学生用户所有的课程，即找到课程——学生——班级表中包含该学生id的课程（同时该课程必须是学生可见），然后找到课程表中对应的课程信息
			sql = "select courseTable.courseId,courseName,coursePicture from course_student_class,courseTable where studentId = "+ teacherName +" and courseTable.courseId=course_student_class.courseId and hideShow = 1;";
			// sql = 'SELECT courseName,courseId,coursePicture FROM courseTable where hideShow = 1;';
		}
		//console.log(req.session.authority == 1)
		//console.log(sql);
	conn.query(sql,function(err,rows){
		//conn.destroy();
	    if(err){
			console.log(err);
			res.status(200).json({"courseInfos":""});//数据库中无数据
		}else{
			console.log("当前所有的课程");
			console.log(rows);
			res.status(200).json({"courseInfos":rows});//数据库中有数据
		}
	});
	//conn.release();
})
};
//获取实验id与名称
exports.getexpinfo = function(req,res){
	var cid=req.body.cid;
	//console.log("cid:"+cid);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var sql = '';
		if (req.session.authority == 1)
			sql = 'SELECT experienceId,experienceName FROM experienceTable WHERE belong="'+cid+'";';
		else{
			// 获取当前课程下所有学生可见的所有实验
			sql = 'SELECT experienceId,experienceName FROM experienceTable,courseTable WHERE belong="'+cid+'" and courseTable.hideShow = 1 and courseTable.courseId = experienceTable.belong and experienceTable.hideShowExp = 1;';
		}
		conn.query(sql,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"expInfos":""});
			}else{
				console.log(rows);
				res.status(200).json({"expInfos":rows});
			}
		});

})
};
//获取学生用户Id
// exports.getstuid = function(req,res){
// 	var stuName = req.body.stuName;
// 	req.getConnection(function(err,conn){
// 		if(err){
// 			console.log("Failed to connect");
// 			res.status(500).json(err);
// 		};
// 		var sql = 'SELECT userId FROM userTable WHERE userName="'+stuName+'";';
// 	conn.query(sql,function(err,rows){
// 		if(err){
// 			console.log(err);
// 			res.status(200).json({"stuID":""});
// 		}else{
// 			//console.log(rows);
// 			res.status(200).json({"stuID":rows});
// 		}
// 	});

// })
// };

//获取完成实验报告的所有学生
exports.getstudent = function(req,res){
	var courseId=req.body.courseId;
	var expId=req.body.expId;
	//console.log("courseId:"+courseId);
	//console.log("expId:"+expId);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var sql = 'SELECT stuId FROM reportTable WHERE couId="'+courseId+'" AND expId="'+expId+'";';
	conn.query(sql,function(err,rows){
		if(err){
			console.log(err);
			res.status(200).json({"student":""});
		}else{
			//console.log(rows);
			res.status(200).json({"student":rows});
		}
	});

})	
};
//获取实验报告
exports.getreport = function(req,res){
	//var courseId=req.body.courseId;
	var expId=req.body.expId;
	var stuId=req.body.stuId;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var sql = 'SELECT reportText,status FROM reportTable WHERE expId="'+expId+'" AND stuId="'+stuId+'";';
	conn.query(sql,function(err,report){
		if(err){
			console.log(err);
			res.status(200).json({"report":""});
		}else{
			console.log(report);
			res.status(200).json({"report":report[0]});
		}
	});

})	
};

//获取该老师所有的实验报告
exports.getAllReport = function(req,res){
	var teacherName=req.body.teacherName;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var sql = 'select expId,couId,stuId,stuName,status,experienceName,courseName,coursePicture,reportText From reportTable,experienceTable,courseTable where expId in ( select experienceId From experienceTable where belong in (select courseId From courseTable where teacherName=?)) and reportTable.expId=experienceTable.experienceId and reportTable.couId=courseTable.courseId';
	conn.query(sql,[teacherName],function(err,report){
		if(err){
			console.log(err);
			res.status(200).json({"report":""});
		}else{
			console.log(report);
			res.status(200).json({"report":report});
		}
	});

})	
};

//获取该学生所有的实验报告
exports.getSelfReport = function(req,res){
	var stuName=req.body.stuName;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var sql = 'select courseName,coursePicture,experienceName,stuName,status,reportText From reportTable,courseTable,experienceTable where stuName= ? and reportTable.couId=courseTable.courseId and reportTable.expId=experienceTable.experienceId';
	conn.query(sql,[stuName],function(err,report){
		if(err){
			console.log(err);
			res.status(200).json({"report":""});
		}else{
			console.log(report);
			res.status(200).json({"report":report});
		}
	});

})	
};

//更新实验报告
exports.updreport = function(req,res){
	var expId=req.body.expId;
	var stuId=req.body.stuId;
	var reportText=req.body.reportText;
	var status=req.body.status;

	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var sql= "update reportTable set reportText = ? ,status = ? WHERE expId = ?  AND stuId = ?";
	conn.query(sql,[reportText,status,expId,stuId],function(err,report){
		if (err) {
            console.log(err);
            res.status(200).json("Failed");//数据库无数据
        } else {
            console.log("sssss");
            res.status(200).json("success");
        }
	});

})	
};

//添加实验报告
exports.addreport=function(req,res){
	var data=req.body;
	var queryString='INSERT into reportTable (expId,couId,stuId,stuName,reportText,status) values (?,?,?,?,?,?)';
	console.log(queryString);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
	conn.query(queryString,[data.expId,data.couId,data.stuId,data.stuName,data.reportText,data.status],function(err,rows){
		if(err){
			console.log(err);
			console.log("添加报告失败");
			res.status(200).json("Failed")
		}else{
			console.log("添加报告成功");
			res.status(200).json("success");
		}
	});

})
};