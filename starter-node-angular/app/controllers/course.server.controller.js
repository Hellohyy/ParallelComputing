const callfile = require("child_process");
var fs = require("fs");


//获取课程信息
exports.getCourse = function(req,res){
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		console.log("学生id："+req.session.userId);
		// 找到某个学生用户所有的课程，即找到课程——学生——班级表中包含该学生id的课程（同时该课程必须是学生可见），然后找到课程表中对应的课程信息
		var string1 = "select courseTable.courseId,course_student_class.studentId,course_student_class.classId,courseTable.courseName,courseIntro,coursePicture,courseNum,teacherName,vncNotebook,hideShow,hideLogo,experienceNum,isGonggong,userName as currentTeacher from course_student_class,courseTable,userTable where studentId = '"+ req.session.userId +"' and courseTable.courseId=course_student_class.courseId and hideShow = 1 and courseTable.teacherName = userTable.userId;";
		// var string = "select * from course_student_class where studentId = " + req.session.userId;
		console.log(string1);
		conn.query(string1,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"course":""});//数据库无数据
			}else{
				console.log(rows);
				res.status(200).json({"course":rows});//数据库有数据
			}
		});
	//conn.release();
	})
};

// 当用户为教师时，读取自己对应的课程表中的数据信息
exports.getTeacherCourse = function(req,res){
	// 保存传递过来的教师名信息
	var teacherId =  req.body.teacherName;
	console.log(teacherId);
	// console.log("老师姓名");
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 从数据库中读取与老师姓名一致的课程数据
		conn.query('SELECT * FROM courseTable WHERE teacherName ="'+ teacherId +'" ORDER BY courseId;',function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"teacherCourse":""});//数据库中无数据
			}else{
				console.log("教师表中的数据");
				console.log(rows);
				res.status(200).json({"teacherCourse":rows});//数据库中有数据
				console.log("123");
			}
		});
		//conn.release();
	})
};

//获取当前老师每门课程下的每个课程的实验数目
exports.getCourseNumber = function(req,res){
	console.log(req.body.teacherInfo);
	// 保存当前所有课程的课程id
	var courseId = new Array();
	// 提取每个课程的课程id
	for(var i = 0;i < req.body.teacherInfo.length; i ++){
		courseId[i] = req.body.teacherInfo[i].courseId; 
	}
	console.log(courseId);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
		};
		var string = [];
		var queryString = [];
		for(var i = 0;i < courseId.length;i ++){
			queryString[i] = 'SELECT experienceId FROM experienceTable WHERE belong ='+courseId[i]+';';
			string += queryString[i];
		}
		console.log(string);
		conn.query(string,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"experience":""});//数据库无数据
			}else{
				console.log(rows);
				// 将实验属于当前课程id的所有实验id返回至前台；用于计算统计实验数目
				res.status(200).json({"experience":rows});//数据库有数据
			}
		});
	})
}

// 当用户为管理员时，读取所有老师的课程表信息
exports.getTeacherCourses = function(req,res){
	// 保存传递过来的教师名信息
	//var teacherName =  req.body.teacherName;
	// console.log(teacherName);
	 console.log("老师姓名");
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 从数据库中读取与老师姓名一致的课程数据
		// conn.query('SELECT * FROM courseTable WHERE teacherName <> "cuc" ORDER BY courseId;',function(err,rows){
		var queryString = 'SELECT courseId,courseName,courseIntro,coursePicture,courseNum,teacherName,vncNotebook,hideShow,hideLogo,experienceNum,isGonggong,userName as currentTeacher FROM courseTable,userTable WHERE isGonggong = 0 and courseTable.teacherName = userTable.userId and hideShow = 1 order by courseId;';
		// conn.query('SELECT * FROM courseTable WHERE teacherName in (select userName from userTable where authority = 1) order by courseId;',function(err,rows){
		conn.query(queryString,function(err,rows){		
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"teacherCourses":""});//数据库中无数据
			}else{
				console.log("教师表中的数据");
				console.log(rows);
				res.status(200).json({"teacherCourses":rows});//数据库中有数据
				console.log("123");
			}
		});
		//conn.release();
	})
};

//cuc获取所有老师课程下的实验数目
exports.getCoursesNumber = function(req,res){
	console.log(req.body.teacherInfo);
	// 保存当前所有课程的课程id
	var courseId = new Array();
	// 提取每个课程的课程id
	for(var i = 0;i < req.body.teacherInfo.length; i ++){
		courseId[i] = req.body.teacherInfo[i].courseId; 
	}
	console.log(courseId);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
		};
		var string = [];
		var queryString = [];
		for(var i = 0;i < courseId.length;i ++){
			queryString[i] = 'SELECT experienceId FROM experienceTable WHERE belong ='+courseId[i]+' and hideShowExp = 1;';
			string += queryString[i];
		}
		console.log(string);
		conn.query(string,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"experience":""});//数据库无数据
			}else{
				// console.log(rows[0]);
				// 将实验属于当前课程id的所有实验id返回至前台；用于计算统计实验数目
				res.status(200).json({"experience":rows});//数据库有数据
			}
		});
	})
}

//获取当前老师每门课程下的每个课程的实验数目
exports.getAllCourseNumber = function(req,res){
	console.log(req.body.teacherInfo);
	// 保存当前所有课程的课程id
	var courseId = new Array();
	// 提取每个课程的课程id
	for(var i = 0;i < req.body.teacherInfo.length; i ++){
		courseId[i] = req.body.teacherInfo[i].courseId; 
	}
	console.log(courseId);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
		};
		var string = [];
		var queryString = [];
		for(var i = 0;i < courseId.length;i ++){
			queryString[i] = 'SELECT experienceId FROM experienceTable WHERE belong ='+courseId[i]+' and hideShowExp = 1;';
			string += queryString[i];
		}
		console.log(string);
		conn.query(string,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"allExperience":""});//数据库无数据
			}else{
				// console.log(rows[0]);
				// 将实验属于当前课程id的所有实验id返回至前台；用于计算统计实验数目
				res.status(200).json({"allExperience":rows});//数据库有数据
			}
		});
	})
}

// 教师可以设置课程是否隐藏：默认值为1，表示该课程对学生是可见的；当设置为0时，表示当前课程对学生隐藏
exports.updateCouHideShow = function(req,res){
	// 当前需要隐藏或显示的课程id
	var updateId = req.body.updateId;
	// 当前点击按钮的次数：奇数次（课程隐藏）时数据表中的hideShow字段更新设置为0；偶数次（课程显示）更新设置为1
	// var tag = req.body.hideShow;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
		};
		// 更新课程表，如果当前课程的hideShow参数为1则变为0，为0则变为1
		queryString1 = 'update courseTable set hideLogo =(case hideShow when 1 then "assets/img/avatars/show.ico" when 0 then "assets/img/avatars/hide.ico" else hideShow end ) where courseId = '+ updateId +';';
		queryString2 = 'update courseTable set hideShow =(case hideShow when 1 then 0 when 0 then 1 else hideShow end) where courseId =' + updateId + ';';
		conn.query(queryString1+queryString2,function(err,rows){
			if(err){
				console.log("为未找到对应的课程");
				res.status(200).json("failed");
			}else{
				// res.status(200).json("success");
				conn.query('SELECT hideLogo,hideShow FROM courseTable WHERE courseId =' + updateId +';',function(err,rows){
					if(err){
						console.log("获取隐藏图片路径失败");
						res.status(200).json("failed");
					}else{
						// 获取到当前数据库中存储的图片路径值冰传递给前台
						res.status(200).json({"logo":rows});
					}
					
				});
			}
		})
		// tag为奇数时将1设置为0
		// if(tag % 2 == 1){
		// 	// 更新数据库
		// 	conn.query('UPDATE courseTable SET hideShow = 0 WHERE courseId =' + updateId +';',function(err,rows){
		// 		if(err){
		// 			console.log("为未找到对应的课程");
		// 			res.status(200).json("failed");
		// 		}else{
		// 			res.status(200).json("hidesuccess");
		// 		}
		// 	});
		// }else{
		// 	// 更新数据库
		// 	conn.query('UPDATE courseTable SET hideShow = 1 WHERE courseId =' + updateId +';',function(err,rows){
		// 		if(err){
		// 			console.log("为未找到对应的课程");
		// 			res.status(200).json("failed");
		// 		}else{
		// 			res.status(200).json("showsuccess");
		// 		}
		// 	});
		// }
		
	})
}

//删除选中的课程全部信息
exports.deleteCourse = function(req,res){
	var deleteId = req.body.deleteCourseId;
	console.log(deleteId);
	req.getConnection(function(err,conn){

	    if(err){
			console.log("Failed to connect");
		};
		var queryString1 = 'DELETE FROM courseTable WHERE courseId ='+ deleteId +';';
		var queryString2 = 'DELETE FROM experienceTable WHERE belong ='+ deleteId +';';
		console.log(queryString1);
		console.log(queryString2);
		// 从数据库中找出即将删除的课程的图片存储的地址信息
		// conn.query('SELECT coursePicture FROM courseTable WHERE courseId =' + deleteId +';',function(err,rows){
		// 	if(err){
		// 		console.log("未找到该id号的图片");
		// 	}else{
		// 		console.log("找到了该id号的图片");
		// 		console.log(rows[0]);
		// 		// 由于公共课程可以导入到老师的课程下，因此两者共用同一张封面图，当封面图对应两门课程的时候就不对文件进行删除操作，如果只对应一门课程，则可以删除该图片文件
		// 		var string = 'select count(courseId) as num from courseTable WHERE coursePicture = "'+ rows[0].coursePicture+ '";';
		// 		console.log(string);
		// 		conn.query(string,function(err,rows1){
		// 			if(err){
		// 				console.log(err);
		// 			}else{
		// 				console.log(rows1);
						// 
						// console.log("共用该课程封面图的课程数目："+rows1[0].num);
						// if(rows1[0].num > 1){
						// 	console.log("多个课程共用该课程封面图，因此不需要删除");
						// }else{
						// 	// 删除文件夹中的对应图片文件
						// 	var query3 = "./public/" + rows[0].coursePicture;
						// 	console.log(query3);
						// 	// 删除对应文件夹下面的课程图片
						// 	fs.unlinkSync(query3,function(){err});
						// }
						conn.query(queryString1+queryString2,function(err,rows){
						    if(err){
								console.log("删除失败");
								res.status(200).json("failed");
							}else{
								console.log("删除成功");
								res.status(200).json("success");
							}
						});						
				// 	}
				// })
				
				
			// }
		// })		
	})
};

// 教师对自己的某个课程内容进行修改
exports.updCourse = function(req,res){
	// console.log("课程修改："+req.body.newCourse);
	console.log(req.body.newCourse);
	// 更改后的图片路径
	// var picUrl = "assets/img/image/"+req.body.newCourse.couPicture;
	// console.log(picUrl);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
		};
		// 对数据库中内容进行修改
		var queryString = "update courseTable set courseName = '" + req.body.newCourse.couName + "',courseIntro = '"+req.body.newCourse.couIntro +"',coursePicture = '"+req.body.newCourse.couPicture+"' where courseId = "+req.body.newCourse.currentCouId;
		console.log(queryString);
		conn.query(queryString,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json("failed");
			}else{
				console.log("修改成功！");
				res.status(200).json("success");
			}
		})
	})
}