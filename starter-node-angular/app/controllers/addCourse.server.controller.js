// 向数据库中添加课程信息
// exports.sendAddCourse = function(req,res){
// 	console.log("添加课程！！！");
// 	// console.log(req);
// }


// 向数据库中添加课程信息，这里还没对数据库中的图片内容进行更新，图片单独进行更新
exports.submitAddCourse = function(req,res){
	console.log("提交课程！！！");
	console.log(req.body);
	console.log(req.body.newCourse.coursePicture);
	var data = req.body;
	// 传递过来的参数课程名称
	var courseNameData = req.body.newCourseName;
	// 定义一个存储图片的路径的字符串
	// var imageUrl = 'assets/img/images/' + req.body.newCoursePicture;

	// var imageUrl = 'assets/img/images/' + req.session.picName;
	var courseNameTemp = '';
	var flag = 0;
	// console.log(data.newCourse.courseIntro);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 新增公共课程标记字段
		var queryString = "INSERT into courseTable (courseName,courseIntro,teacherName,coursePicture,vncNotebook,isGonggong) values (?,?,?,?,?,?)" ;
		console.log(queryString);
		conn.query(queryString,[data.newCourse.courseName , data.newCourse.courseIntro , data.newCourse.courseTeacher , data.newCourse.coursePicture, data.newCourse.courseEnv, data.newCourse.gongGongFlag],function(err,rows){
			if(err){

				if(err.errno == 1062)
					res.status(200).json("课程名重复，请重新输入")
				console.log("添加课程失败");

			}else {
                console.log("添加课程成功");
                res.status(200).json("success");
            }
		});

		/*conn.query('SELECT courseName FROM courseTable',function(err,rows){

			if(err){
				console.log(err);
				// res.status(200).json({"courseNameS":""});//数据库中无数据
			}else{
				// res.status(200).json({"courseNames":rows});//数据库中有数据
				courseNameTemp = rows;
				console.log("临时课程名字存放处");
				console.log(courseNameTemp.length);
				for(var i = 0;i < courseNameTemp.length;i ++){
					if(courseNameTemp[i].courseName == data.newCourse.courseName){
						console.log("该课程名已经存在");
						//如果相同课程名称已经存在在数据库中，标记flag为1
						flag = 1;
						break;
					}
				}
				// 向数据库的课程表中添加新的课程信息
				var queryString = '';
				// 插入语句
				queryString = 'INSERT into courseTable (courseName,courseIntro,teacherName,coursePicture) values ("' + data.newCourse.courseName + '","' + data.newCourse.courseIntro +'","' + data.newCourse.courseTeacher +'","' + imageUrl +'")';
				console.log(queryString);
				// flag为0时代表：此时数据表中暂时没有该课程，进行数据库的课程添加操作
				if(flag==0){
					conn.query(queryString,function(err,rows){
						//conn.destroy();
						if(err){
							console.log("添加课程失败");

						}else{
							console.log("添加课程成功");
							res.status(200).json("success");
						}
					});
				}else{
					// 此新提交的课程与已存在的课程同名，返回一个同名提醒，告诉前端
					res.status(200).json("sameCourse");
				}
				
					}
				});
	//conn.release();
	})*/
});
}

//向数据库中添加课程的图片路径信息，
// exports.submitAddPicture = function(req,res){
// 	console.log("添加图片！！！");
// 	console.log(req.body);
// 	console.log(req.body.newCourseName);
// 	console.log(req.body.newCoursePicture);
// 	// 传递过来的参数课程名称
// 	var courseNameData = req.body.newCourseName;
// 	// 传递过来的参数课程图片
// 	var imageUrl = 'assets/img/images/' + req.body.newCoursePicture;

// 	req.getConnection(function(err,conn){
// 		if(err){
// 			console.log("Failed to connect");
// 			res.status(500).json(err);
// 		};

// 		var queryString = '';
// 		queryString = 'UPDATE courseTable set coursePicture ="' + imageUrl + '"WHERE courseName ="' + courseNameData +'";';
// 		console.log(queryString);
// 		conn.query(queryString,function(err,rows){
// 			//conn.destroy();
// 			if(err){
// 				console.log(err);

// 			}else{
// 				console.log("图片更新成功");
// 				res.status(200).json("success");
// 			}
// 		});
// 		//conn.release();
// 	});
// }
