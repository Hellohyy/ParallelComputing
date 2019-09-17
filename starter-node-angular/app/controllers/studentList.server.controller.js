const callfile = require("child_process");
var fs =require("fs");

// 获取当前老师的所有课程
exports.getCourseList = function(req,res){
	// 传递过来的参数是当前用户的用户id
	console.log(req.body);
	var teaName = req.body.teacherName;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 从课程表中读取当前老师下的所有课程名称信息
		conn.query('SELECT courseId,courseName,coursePicture,courseIntro FROM courseTable WHERE teacherName = "' + teaName +'";',function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"courses":""});//数据库中无数库
			}else{
				console.log(rows);
				res.status(200).json({"courses":rows});//数据库中有数据
			}
		})
	});
}
// 获取课程下所有的班级和学生信息
exports.getCouClaStu = function(req,res){
	// 传递过来的课程id
	var param = req.body.paramId;
	console.log(param);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 从表中找到一共有的班级个数统计，以及查询出所有的学生和班级信息
		var queryString = 'SELECT classId,count( * ) AS idCount FROM course_student_class WHERE courseId = '+ param + ' GROUP BY classId ORDER BY classId;SELECT * FROM course_student_class WHERE courseId = ' + param +' ORDER BY classId;';
		console.log(queryString);
		conn.query(queryString,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"couClaStu":""});//数据库中无数据
			}else{
				console.log("查询到的所有班级和学生");
				console.log(rows);
				res.status(200).json({"couClaStu":rows});//数据库中有数据
			}
		})
	});
}

// 获取班级和学生对应的名称信息
exports.getCouClaStuName = function(req,res){
	console.log(req.body);
	var classIdInfo = req.body.claId;
	var studentIdInfo = req.body.stuId;
	console.log(classIdInfo);
	var queryString1 = '';
	var queryString2 = '';
	// 如果班级id号中存在null值，把null替换为-1，方便查询，不然sql语句会报错；学生id不会为null，因此不做处理
	for( var i = 0; i < classIdInfo.length; i ++){
		if(classIdInfo[i] == null){
			console.log("该班级id号为空值");
			classIdInfo[i] = -1;
		}
	}
	req.getConnection(function(err,conn){
		if(err){
			console.log(err);
			res.status(500).json(err);
		};
		if(classIdInfo.length > 0){
			queryString1 = 'SELECT classID,classname FROM classtable WHERE classID in ( ' + classIdInfo +' );';
		}
		if(studentIdInfo.length > 0){
			queryString2 = 'SELECT userId,userName FROM userTable WHERE find_in_set( userId ,"' + studentIdInfo + '" );';
		}
		console.log(queryString2);
		// 先查询学生名称(一定存在),然后查询班级名称不一定存在
		var string = queryString2 + queryString1;
		conn.query(string,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"couClaStuName":""});//数据库中无数据
			}else{
				console.log("查询到的所有班级和学生的名称");
				console.log(rows);
				// 学生id一定存在所以一定有对应的学生名称,但是搜索出来的班级名称信息个数不一定和班级id号一一对应，因为有些班级id为空，查询不出结果；
				// 查询出的学生一定和学生id一一对应;rows[0]一定存在，rows[1]不一定存在
				res.status(200).json({"couClaStuName":rows});//数据库中有数据
			}
		})
		
	});
}
// // 获取班级和学生信息
// exports.getClass = function(req,res){
// 	// 传递过来的课程id
// 	var param = req.body.paramId;
// 	console.log(req.body.paramId);
// 	var sameClass = [];
// 	req.getConnection(function(err,conn){
// 		if(err){
// 			console.log("Failed to connect");
// 			res.status(500).json(err);
// 		};
// 		// 去除重复的记录
// 		var queryString = 'SELECT distinct course_id,class_id FROM course_class WHERE course_id = '+ param +';'
// 		console.log(queryString);
// 		// 获取课程-班级表中的课程一下的所有班级
// 		conn.query('SELECT distinct course_id,class_id FROM course_class WHERE course_id = '+ param +';',function(err,rows){
// 			if(err){
// 				console.log(err);
// 				res.status(200).json({"class":""});//数据库中无数据
// 			}else{
// 				console.log(rows);
// 				res.status(200).json({"class":rows});//数据库中有数据
// 			}
// 		})
// 	});
// };

// // 获取班级下的学生信息
// exports.getStudents = function(req,res){
// 	console.log("获取学生新消息");
// 	console.log(req.body.class);
// 	var string = [];
// 	var queryString = [];
// 	// 将班级的id信息存储到classId中，方便之后在数据库中查找
// 	var classInfo = req.body.class;
// 	req.getConnection(function(err,conn){
// 		if(err){
// 			console.log("Failed to connect");
// 			res.status(500).json(err);
// 		};
// 		console.log(classInfo.length);
// 		for(var i = 0; i < classInfo.length; i ++){
// 			queryString[i] = 'SELECT * FROM class_std WHERE classID = '+ classInfo[i].class_id + ';';
// 			string +=  queryString[i];
// 		}
// 		console.log(string);
// 		var stuIds = [];
// 		// 学生id的下标
// 		var flag = 0;
// 		// 学生名称的下表
// 		var flag2 = 0;
// 		// 保存学生与课程的信息
// 		var claStuInfo = [];
// 		conn.query(string,function(err,rows){
// 			if(err){
// 				console.log(err);
// 				res.status(200).json({"students":""});//数据库中无数据
// 			}else{
// 				// 获取到关于班级、学生对应的所有信息
// 				console.log(rows)
// 				// console.log(rows[0][0]);
// 				// 将所有结果存到claStuInfo
// 				claStuInfo = rows;
// 				console.log(claStuInfo.length);
// 				// 将得到的所有学生的id号提取出来，存到stuIds中，方便从数据库中获取所有学生的学生名称
// 				if(classInfo.length == 1){
// 					// 当只有一个班级的学生时，一维数组
// 					for(var j = 0; j < rows.length; j ++){
// 						// 将所有的学生id存储到stuIds
// 						stuIds[flag] = rows[j].userId;
// 						flag +=1;
// 					}
// 				}else{//多个班级
// 					for(var i = 0; i < rows.length; i ++){
// 						for(var j = 0; j < rows[i].length; j ++){
// 							// 将所有的学生id存储到stuIds
// 							stuIds[flag] = rows[i][j].userId;
// 							flag +=1;
// 						}
// 					}
// 				}
				
// 				console.log(stuIds);
// 				console.log('SELECT userName FROM userTable WHERE userId IN (' + stuIds + ');');
// 				// 通过获取到的学生id，再次查找数据表找到该学生名称
// 				conn.query('SELECT userName FROM userTable WHERE userId IN (' + stuIds + ');',function(err,rows){
// 					if(err){
// 						console.log(err);
// 						res.status(200).json({"stuNames":""});//数据库中无数据
// 					}else{
// 						console.log(rows);
// 						// 输出的是获取的学生的名称,将获取到的学生名称存到claStuInfo
// 						for(var i = 0; i < claStuInfo.length; i ++){
// 							for(var j = 0; j < claStuInfo[i].length; j ++){
// 								// 将所有的学生id存储到stuIds
// 								claStuInfo[i][j].userName = rows[flag2].userName;
// 								flag2 +=1;
// 							}
// 						}
// 						console.log(claStuInfo);
// 						// 获取每个班级下的所有学生信息
// 						res.status(200).json({"students":claStuInfo});//数据库中有数据
// 					}
// 				})
				
// 			}
// 		})
// 	});
// }

// 删除选中的学生或班级
exports.deleteClassStudent = function(req,res){
	// 存储即将删除的班级id
	var deleteClassIds = req.body.delete.classId;
	// 存储即将删除的学生id
	var deleteStudentIds = req.body.delete.studentId;
	// 存储即将删除的学生对应的所属的班级id
	var deleteBelongClasses = req.body.delete.belongClassId;
	console.log("删除班级或学生");
	console.log(req.body.delete);
	// console.log(delteClassIds);
	// console.log(delteStudentIds);
	// console.log(deleteBelongClasses);
	// if(deleteBelongClasses in deleteClassIds){
	// 	console.log("在班级中");
	// }
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var queryString = '';
		var queryString1 = '';
		var queryString2 = '';
		var queryString3 = '';
		var queryString4 = '';
		// 当没有要删除的班级时，length为0,有要删除的班级时，不为0
		if(deleteClassIds.length != 0){
			console.log("00000");
			// 删除选中的所有班级以及班级下的学生：对course_class表格进行删除操作，之后在数据库中使用触发器将课程-班级-学生表中该课程和班级下的所有学生删除
			// var queryString1 = 'DELETE FROM class_std WHERE classID in (' + deleteClassIds + ');';
			// var queryString2 = 'DELETE FROM classtable WHERE classID in (' + deleteClassIds +');';
			queryString1 = 'DELETE FROM course_class WHERE class_id in (' + deleteClassIds +') AND course_id = ' + req.body.delete.paramCourseId +';';
			queryString3 = 'DELETE FROM course_student_class WHERE courseId in (' + req.body.delete.paramCourseId +' ) AND classId in (' + deleteClassIds +' );';
			console.log(queryString1);
		}
		if(deleteStudentIds.length != 0 ){
			// 找到课程班级学生表中包含的所有在该课程下的记录
			// var queryString2 = 'SELECT * FROM course_student_class WHERE courseId = ' + req.body.delete.paramCourseId +';';
			queryString2 = 'DELETE FROM course_student_class WHERE courseId in (' + req.body.delete.paramCourseId +' ) AND studentId in (' + deleteStudentIds +' );';		
		}
		// 删除班级或删除学生必定存在一个
		console.log(queryString1 + queryString3 + queryString2);
		
		queryString = queryString1 + queryString3 + queryString2;
		// console.log(queryString);
		conn.query(queryString,function(err,rows){
			if(err){
				console.log("删除失败");
				res.status(200).json("failed");
			}else{
				console.log("删除成功");
				res.status(200).json("success");
			}
		});
		
		
	})
}

// 获取所有的班级列表信息
exports.getAllClass = function(req,res){
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var queryString = 'SELECT classID, classname FROM classtable';
		console.log(queryString);
		// 从数据库获取当前的所有班级信息
		conn.query(queryString,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"allClass":""});//数据库中无数据
			}else{
				console.log(rows);
				res.status(200).json({"allClass":rows});//数据库中有数据
			}
		})
	});
}

// 向当前的课程下添加选中的班级:courseId是唯一的，班级id为一到多个
exports.addNewClass = function(req,res){
	console.log("新增班级");
	console.log(req.body);
	var courseId = req.body.courseId;
	var newClassIds = req.body.classIds;
	var queryString1 = '';
	var queryString2 = '';
	console.log(courseId);
	console.log(newClassIds);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
		};
		// 对多条插入语句进行拼接：在课程-班级表中插入信息之后，数据库调用触发器找到班级下对应的所有学生信息，并将班级-课程-学生信息全部加入到课程-班级-学生表中
		for(var i = 0; i < newClassIds.length; i ++){
			queryString1 += 'INSERT INTO course_class ( course_id,class_id) VALUE ( ' + courseId + ',' + newClassIds[i] +' );';
			// queryString2 += 'INSERT INTO course_student_class ( courseId, classId, studentId ) VALUE ( ' + courseId + ',' + newClassIds[i] + ',( SELECT userId FROM class_std WHERE classID = '+ newClassIds[i] +' ));';
			// queryString2 += 'SELECT classID,userId FROM class_std WHERE classID = '+ newClassIds[i] +';';
		}
		console.log(queryString1);
		// console.log(queryString2);
		conn.query(queryString1,function(err,rows){
			if(err){
				// 数据库插入执行失败
				console.log(err);
				res.status(200).json("failed");
			}else{
				// 数据库插入语句执行成功
				console.log("成功");
				res.status(200).json("success");
			}
		})

	});

}

// 获取所有的学生信息
exports.getAllStudent = function(req,res){
	console.log("获取所有的学生信息");
	var classIds = [];
	var queryString = '';
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 找到权限为0的用户：即为学生,获取学生名称和学生id
		conn.query('SELECT userId,userName,classId FROM userTable WHERE authority = 0',function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"allStudent":""});//数据库中无数据
			}else{
				console.log(rows);
				for(var i = 0; i < rows.length; i ++){
					// 将班级id提取出来，方便查找班级名称
					queryString += 'SELECT classId,classname FROM classtable WHERE classId = ' + rows[i].classId + ';';
					
				}
				// console.log(classIds);
				// 对查询出的每个学生根据班级id找到对应的班级名称
				conn.query(queryString,function(err,rows1){
					if(err){
						console.log(err);
						res.status(200).json({"allstudent":""});//班级名称为空
					}else{
						console.log(rows1);

						// for(var i =  0; i < rows.length; i ++){

						// 	for(var j = 0; j < rows1.length; j ++){
						// 		if(rows[i].classId == rows1[j].classId){
						// 			// rows[i].classname = '';
						// 			// 增加classname属性
						// 			rows[i].classname = rows1[j].classname;
						// 		}
						// 	}
						// }
						
						res.status(200).json({"allStudent":rows,"allStudentClass":rows1});//数据库中有数据
					}

				})
				
			}
		})
	});
}

// 向当前的课程中添加选中的学生
exports.addNewStudent = function(req,res){
	console.log("学生添加");
	console.log(req.body);
	// 当前课程id
	var courseId = req.body.courseId;
	// 当前选中的所有学生id
	var newStudentIds = req.body.studentIds;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var queryString = '';
		// 向班级-课程-学生表中插入新的学生信息:暂时不做去重操作，所以可能会有重复数据记录
		for(var i = 0; i < newStudentIds.length; i ++){
			queryString += 'INSERT INTO course_student_class(courseId,studentId) VALUE( ' + courseId +',"'+ newStudentIds[i] +' ");';
		}
		console.log(queryString);
		conn.query(queryString,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json("failed");
			}else{
				console.log("成功");
				res.status(200).json("success");
			}
		})

	});
}