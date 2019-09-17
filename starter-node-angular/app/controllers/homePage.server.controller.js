// // 获取公共课程信息
// exports.getCommonTeacherCou = function (req,res){
// 	console.log("首页获取信息");
// 	console.log(req.body.userName);
// 	req.getConnection(function(err,conn){
// 		if(err){
// 			console.log("Failed to connect");
// 			res.status(500).json(err);
// 		};
// 		// 获取公共课程
// 		var queryString = 'select *  from courseTable where isGonggong = 1';
// 		// 获取非公共课程
// 		var queryString2 = 'select * from courseTable where isGonggong = 0';

// 	})
// // }
// exports.getTeacherStudentNum = function(req,res){
// 	//console.log(req.body);
// 	req.getConnection(function(err,conn){
// 		if(err){
// 			console.log("Failed to connect");
// 			res.status(500).json(err);
// 		};
// 		// 获取班级数
// 		//var querystring = 'SELECT * FROM courseTable WHERE teacherName ="cuc"';
// 		var string = [];
// 		string = 'SELECT COUNT(*) AS num FROM userTable WHERE authority=1;';
// 		var string2 = 'SELECT COUNT(*) AS num FROM userTable WHERE authority=0';
// 		console.log(string);
// 		conn.query(string+string2,function(err,rows){
// 			if(err){
// 				//console.log(err);
// 				res.status(200).json({"teacherStunum":""});//数据库中无数据
// 				//console.log("no data");
// 			}else{
// 				console.log(rows);
// 				res.status(200).json({"teacherStunum":rows});//数据库中有数据
				
// 			}
// 		});
// 	})
// }
//首页显示の老师课程统计
exports.getTeacherCourseNum = function(req,res){
	//console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 获取班级数
		//var querystring = 'SELECT * FROM courseTable WHERE teacherName ="cuc"';
		var string = [];
		// string = 'SELECT COUNT(*) AS num FROM courseTable WHERE isGonggong=0';
		string = 'select count(*) as commonExpNum from experienceTable where belong in (select courseId from courseTable where isGonggong = 1 and hideShow = 1) and hideShowExp = 1;select count(*) as teacherExpNum from experienceTable where belong in (select courseId from courseTable where teacherName = "'+ req.session.userId +'" );select count(*) as unLearnExpNum from experienceTable where tag="";select count(*) as learnExpNum from experienceTable where tag!="";select count(*) as classNum from classtable;'
		console.log(string);
		conn.query(string,function(err,rows){
			if(err){
				//console.log(err);
				res.status(200).json({"allNum":""});//数据库中无数据
				//console.log("no data");
			}else{
				console.log(rows);
				res.status(200).json({"allNum":rows});//数据库中有数据
				
			}
		});
	})
}

//首页显示の公共课程统计
exports.getCommonCourseNum = function(req,res){
	//console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 获取班级数
		//var querystring = 'SELECT * FROM courseTable WHERE teacherName ="cuc"';
		var string = [];
		string = 'SELECT COUNT(*) AS num FROM courseTable WHERE isGonggong = 1;SELECT COUNT(*) AS num FROM courseTable WHERE isGonggong = 0;';
		console.log(string);
		conn.query(string,function(err,rows){
			if(err){
				//console.log(err);
				res.status(200).json({"commoncoursenum":""});//数据库中无数据
				//console.log("no data");
			}else{
				console.log(rows);
				res.status(200).json({"commoncoursenum":rows});//数据库中有数据
				
			}
		});
	})
};
// 获取当前学生的所有课程数
exports.getStudentCourseNum = function(req,res){
	console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var string = "select count(*) as courseNum from course_student_class,courseTable where studentId = '"+ req.session.userId +"' and courseTable.courseId=course_student_class.courseId and hideShow = 1;select * from course_student_class,courseTable,experienceTable where studentId = '"+ req.session.userId +"' and courseTable.courseId=course_student_class.courseId and hideShow = 1 and experienceTable.belong = courseTable.courseId and hideShowExp = 1;";
		console.log(string);
		conn.query(string,function(err,rows){
			if(err){
				res.status(200).json({"studentCourseNum":""});//数据库中无数库
			}else{
				console.log(rows[0][0].courseNum);
				res.status(200).json({"studentCourseNum":rows[0][0].courseNum,"studentExp":rows[1]});
			}
		});
	})
}

// 获取实验报告和学习时长
exports.getReportTimeNum = function(req,res){
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var string1 = "select count(*) as reportNum from reportTable where stuId = '" + req.body.studentId+"';";
		// var string2 = "SELECT expId,courseName,sum(LearningTime) as sumLearningTime FROM courseSystem.recordTable where userName = "+req.body.studentId+" group by expId;"
		var string3 = "select sum(LearningTime) as sumLearningTime FROM recordTable WHERE userName = '" + req.body.studentId+"';";
		conn.query(string1+string3,function(err,rows){
			if(err){
				res.status(200).json({"reportNum":""});
			}else{
				console.log(rows);
				console.log(rows[0][0].reportNum);
				console.log(rows[1]);
				res.status(200).json({"reportNum":rows[0][0].reportNum,sumLearningTime:rows[1][0].sumLearningTime});
			}
		})
	})
}

// 教师身份获取可见的公共课程和教师自己的课程
exports.getTeacherOwnCourse = function(req,res){
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 获取可见的公共课程、实验
		var string1 = "select count(*) as comCouNum from courseTable where isGonggong = 1 and hideShow = 1;select count(*) as comExpNum from experienceTable where belong in (select courseId from courseTable where isGonggong = 1 and hideShow = 1) and hideShowExp = 1;";
		// 获取老师自己的课程、实验
		var string2 = "select count(*) as teaCouNum from courseTable where teacherName = '"+ req.session.userId +"';select count(*) as teaExpNum from experienceTable where belong in (select courseId from courseTable where teacherName = '"+ req.session.userId +"');";
		// 获取已经被学习过的实验
		var string3 = "select count(*) as learnedExpNum from experienceTable where belong in (select courseId from courseTable where teacherName = '"+ req.session.userId +"') and tag != '';";
		// 获取班级数目，学生人数
		var string4 = "select count(*) as claNum from classtable;select count(*) as stuNum from class_std;"
		conn.query(string1+string2+string3+string4,function(err,rows){
			if(err){
				res.status(200).json({"comCouNum":""});
			}else{
				console.log(rows);
				console.log(rows[0][0].comCouNum);
				console.log(rows[1][0].comExpNum);
				res.status(200).json({"comCouNum":rows[0][0].comCouNum,"comExpNum":rows[1][0].comExpNum,"teaCouNum":rows[2][0].teaCouNum,"teaExpNum":rows[3][0].teaExpNum,"learnedExpNum":rows[4][0].learnedExpNum,"claNum":rows[5][0].claNum,"stuNum":rows[6][0].stuNum});
			}
		})
	})
}