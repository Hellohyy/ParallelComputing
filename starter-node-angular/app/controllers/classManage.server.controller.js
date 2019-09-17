// 获取班级数目
exports.getClassNum = function(req,res){
	//console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 获取班级数
		//var querystring = 'SELECT * FROM courseTable WHERE teacherName ="cuc"';
		var string = [];
		string = 'SELECT COUNT(*) AS num FROM classtable';
		console.log(string);
		conn.query(string,function(err,rows){
			if(err){
				//console.log(err);
				res.status(200).json({"classnum":""});//数据库中无数据
				//console.log("no data");
			}else{
				console.log(rows);
				res.status(200).json({"classnum":rows});//数据库中有数据
				
			}
		});
	})
}

//获取班级信息
exports.getClasses = function(req,res){
	// 保存传递过来的教师名信息
	//var teacherName =  req.body.teacherName;
	//console.log(teacherName);
	// console.log("老师姓名");
	console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 从数据库中读取所有班级数据
		var querystring = 'SELECT * FROM classtable ORDER BY classID';
		conn.query(querystring,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"classes":""});//数据库中无数据
			}else{
				console.log(rows);
				res.status(200).json({"classes":rows});//数据库中有数据
				console.log("班级信息查询成功");
			}
		});
		//conn.release();
	})
};

//获取已注册学生总人数
exports.getStdNum = function(req,res){
	//console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 获取班级数
		//var querystring = 'SELECT * FROM courseTable WHERE teacherName ="cuc"';
		var string = [];
		string = 'SELECT COUNT(*) AS num FROM userTable WHERE authority =0';
		console.log(string);
		conn.query(string,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"stdnum":""});//数据库中无数据
				//console.log("no data");
			}else{
				res.status(200).json({"stdnum":rows});//数据库中有数据
				console.log(456);
			}
		});
	})
}




// 获取每个班级的当前学生人数
exports.getClassStdNum = function(req,res){
	//console.log(req.body);
	//var teacherName = req.body.teacherName;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 从数据库中读取每个班级的学生人数，并且按照班级ID名字进行排序
		conn.query('SELECT count(*) AS num FROM userTable  where classId is not NULL GROUP BY classId ORDER BY classId;',function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"classstdnum":""});//数据库中无数据
			}else{
				console.log("班级-学生表中的数据");
				console.log(rows);
				res.status(200).json({"classstdnum":rows});//数据库中有数据
			}	
		});
	})
}
//首页显示の统计老师人数
exports.getTeacherNum = function(req,res){
	//console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 获取班级数
		//var querystring = 'SELECT * FROM courseTable WHERE teacherName ="cuc"';
		var string = [];
		string = 'SELECT COUNT(*) AS num FROM userTable WHERE authority=1;SELECT COUNT(*) AS num FROM userTable WHERE authority=0';
		console.log(string);
		conn.query(string,function(err,rows){
			if(err){
				//console.log(err);
				res.status(200).json({"teacherStudentnum":""});//数据库中无数据
				//console.log("no data");
			}else{
				console.log(rows);
				res.status(200).json({"teacherStudentnum":rows});//数据库中有数据
				
			}
		});
	})
}



//删除班级
exports.deleteClass = function(req,res){
	var deleteId = req.body.ClassId;
	console.log(deleteId);
	var queryString1 = '';
	var queryString2 = '';
	var queryString3 = '';
	queryString1 = 'DELETE FROM classtable WHERE classId ='+ deleteId +';';
	queryString2 = 'DELETE FROM class_std WHERE classId ='+ deleteId +';';
	queryString3 = 'DELETE FROM userTable  WHERE classId ='+ deleteId +';';

	req.getConnection(function(err,conn){

	    if(err){
			console.log("Failed to connect");
		};	

		// 删除该班级的信息、班级-学生关系表、删除该班级下的所有学生
		conn.query((queryString1+queryString2+queryString3),function(err,rows){

		    if(err){
				console.log("删除失败");
			}else{
				console.log("删除成功");
				res.status(200).json("success");
			}
		});


		// // 删除班级-学生关系表中该班级的所有学生
		// conn.query('DELETE FROM class_std WHERE classId ='+ deleteId +';',function(err,rows){
		// 	//conn.destroy();
		//     if(err){
		// 		console.log("删除失败");
		// 	}else{
		// 		console.log("删除成功");
		// 		// res.status(200).json("success");
		// 	}
		// });

		// //删除该班级下的所有学生
		// conn.query('DELETE FROM userTable  WHERE classId ='+ deleteId +';',function(err,rows){
		// 	//conn.destroy();
		//     if(err){
		// 		console.log("删除失败");
		// 	}else{
		// 		console.log("删除成功");
		// 		res.status(200).json("success");
		// 	}
		// });
		//conn.release();
	})
};




//新增班级
// exports.addClass = function(req,res){
// 	console.log("新增班级！！！");
// 	console.log(req.body);
// 	// console.log(req.session.picName);
// 	var data = req.body;
// 	// 传递过来的参数班级名称
// 	var classNameData = req.body.newclassName;
// 	// 定义一个存储图片的路径的字符串
// 	//var imageUrl = 'assets/img/images/' + req.body.newCoursePicture;

// 	// var imageUrl = 'assets/img/images/' + req.session.picName;
// 	var classNameTemp = '';
// 	var flag = 0;
// 	// console.log(data.newCourse.courseIntro);
// 	req.getConnection(function(err,conn){
// 		if(err){
// 			console.log("Failed to connect");
// 			res.status(500).json(err);
// 		};

// 		var queryString = "INSERT into classtable ( ,classname, ,overall,createtime) values ( ,?, ,?,?)" ;
// 		console.log(queryString);
// 		conn.query(queryString,[data.newClass.classname , data.newClass.overall , data.newClass.createtime],function(err,rows){
// 			if(err){

// 				if(err.errno == 1062)
// 					res.status(200).json("班级名重复，请重新输入")
// 				console.log("添加班级失败");

// 			}else {
//                 console.log("添加班级成功");
//                 res.status(200).json("success");
//             }
// 		});
// });
// }


//获取班级学生名单
exports.getClassStd = function(req,res){
	// 保存当前所有课程的课程id
	var classId = req.body.ClassId;
	console.log("test2");
	console.log(classId);
	// 提取每个课程的课程id
	/*for(var i = 0;i < req.body.teacherInfo.length; i ++){
		classId[i] = req.body.teacherInfo[i].classId; 
	}
	console.log(courseId);*/
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
		};
		 var querystring = 'select userTable.*,classtable.classname from userTable join classtable on userTable.classId = classtable.classId and userTable.classId = '+classId+';';
		 //var queryString = 'select userTable.*,class_std.classname from userTable join class_std on userTable.userId = class_std.userId and class_std.classID = '+classId+';';
		console.log(querystring);
		conn.query(querystring,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"classstd":""});//数据库无数据
			}else{
				console.log("名单查询成功");
				console.log(rows);
				// 将实验属于当前课程id的所有实验id返回至前台；用于计算统计实验数目
				res.status(200).json({"classstd":rows});//数据库有数据	
			}
		});
	})
}
//添加班级
exports.submitAddClass = function(req,res){
	console.log("班级添加！！！");

	console.log(req.body);
	// console.log(req.session.picName);
	var data = req.body;
	// 传递过来的参数课程名称
	var classNameData = req.body.val;

	// var imageUrl = 'assets/img/images/' + req.session.picName;
	var classNameTemp = '';
	var flag = 0;
	// console.log(data.newCourse.courseIntro);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};

		var queryString = "INSERT into classtable (classname,overall,createtime) values (?,?,date_format(now(),'%Y/%m/%d'))" ;
		console.log(queryString);
		conn.query(queryString,[data.val.className , data.val.overall ],function(err,rows){
			if(err){
				console.log(err);
				if(err.errno == 1062)
					res.status(200).json("班级名重复，请重新输入")

				console.log("添加班级失败");

			}else {
                console.log("添加班级成功");
                res.status(200).json("success");
            }
		});
});
}

//添加学生
exports.addStudent = function(req,res){
  console.log("学生添加！！！");
  console.log(req.body);
  // console.log(req.session.picName);
  var data = req.body;
  // 传递过来的参数课程名称
  // var classNameData = req.body.newClassName;
  // // 定义一个存储图片的路径的字符串
  // var excelUrl = './public/assets/Excel/' + req.body.newClassExcel;

  // // var imageUrl = 'assets/img/images/' + req.session.picName;
  // var classNameTemp = '';
  // var flag = 0;
  // console.log(data.newCourse.courseIntro);
  req.getConnection(function(err,conn){
    if(err){
      console.log("Failed to connect");
      res.status(500).json(err);
    };

    var queryString = 'SELECT classId into @clsid from classtable where classname = ?;INSERT into userTable (userId,userName,password,authority,classId,gender,major,apartment) values (?,?,123456,2,@clsid,?,?,?)' ;
    console.log(queryString);
    conn.query(queryString,[data.student.className,data.student.studentId,data.student.studentName,data.student.studentGen,data.student.studentMajor,data.student.studentApartment],function(err,rows){
      if(err){

        if(err.errno == 1062)
          res.status(200).json("该用户已经注册");
        console.log("学生添加失败");

      }else {
                console.log("学生添加成功");
                res.status(200).json("success");
            }
      // res.redirect('/#/app/classDetails');

    });
});
}

