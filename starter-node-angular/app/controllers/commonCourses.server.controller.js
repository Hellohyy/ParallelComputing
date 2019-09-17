const fs = require("fs");
const callfile = require("child_process");
var async = require("async");

// 获取公共课程信息
exports.getCommonCourses = function(req,res){
	console.log(req.body);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		console.log(req.session.authority);
		// 获取公共课程:当前用户为老师时只能看到可见的公共课程；当前用户为管理员时能够看到所有的课程。
		if(req.session.authority == 1){
			var querystring = 'SELECT courseId,courseName,courseIntro,coursePicture,courseNum,teacherName,vncNotebook,hideShow,hideLogo,experienceNum,isGonggong,userName as currentTeacher FROM courseTable,userTable WHERE isGonggong = 1 and hideShow = 1 and courseTable.teacherName = userTable.userId order by courseId;';
		}else{
			// 当前用户为管理员时看到所有的课程
			var querystring = 'SELECT courseId,courseName,courseIntro,coursePicture,courseNum,teacherName,vncNotebook,hideShow,hideLogo,experienceNum,isGonggong,userName as currentTeacher FROM courseTable,userTable WHERE isGonggong = 1 and courseTable.teacherName = userTable.userId order by courseId;';
		}

		// var querystring = 'SELECT * FROM courseTable WHERE teacherName in (select userName from userTable where authority = 2)';
		
		conn.query(querystring,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"commonCourses":""});//数据库中无数据
			}else{
				console.log(rows);
				res.status(200).json({"commonCourses":rows});//数据库中有数据
			}
		});
	})
}

//获取当前老师每门课程下的每个课程的实验数目
exports.getCommonCourseNumber = function(req,res){
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
			// 当前用户为教师时，可以看到可见的实验，当前用户为管理员时，可以看到所有的实验
			if(req.session.authority == 1){
				queryString[i] = 'SELECT count(*) AS num FROM experienceTable WHERE belong = '+courseId[i]+' and hideShowExp = 1;';
				string += queryString[i];
			}else{
				// 当前用户为管理员时可以看到所有的实验
				queryString[i] = 'SELECT count(*) AS num FROM experienceTable WHERE belong = '+courseId[i]+';';
				string += queryString[i];
			}
			
		}
		// string = 'SELECT count(*) AS num FROM experienceTable WHERE belong in ('+ courseId +');';
		console.log(string);
		conn.query(string,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"commonExperience":""});//数据库无数据
			}else{
				console.log(rows);
				// console.log(rows[2].length);
				// 将实验属于当前课程id的所有实验id返回至前台；用于计算统计实验数目
				res.status(200).json({"commonExperience":rows});//数据库有数据
			}
		});
	})
}

// 添加公共课程到新的课程
exports.loadNewCourse = function(req,res){
	console.log(req.body);
	var loadCourseId = req.body.loadCourseId;
	var teacherId = req.body.teacherId;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 公共课程添加,由于课程名已经存在，且不能重名，所以将公共名称后面加上当前老师的名称作为唯一标识符
		// var queryString1 = 'SELECT CONCAT(courseName,"--'+teacherId +'"),courseIntro,coursePicture,courseNum,vncNotebook,experienceNum,"'+teacherId+'"FROM courseTable WHERE courseId =' + loadCourseId;
		var queryString1 = 'SELECT courseName,courseIntro,coursePicture,courseNum,vncNotebook,experienceNum,"'+teacherId+'"FROM courseTable WHERE courseId =' + loadCourseId;
		// console.log(queryString1);
		var queryString2 = 'INSERT INTO courseTable(courseName,courseIntro,coursePicture,courseNum,vncNotebook,experienceNum,teacherName)(' + queryString1 +');'
		console.log(queryString2);
		// 当前最新更新的id值获取
		var queryString5 = 'SELECT LAST_INSERT_ID() as newInsertCourseId;';
		var queryString3 = 'SELECT experienceName,experienceObjective,experienceEnvironment,experiencePrinciple,experienceProcedures,experienceLabel,(SELECT LAST_INSERT_ID()) FROM experienceTable WHERE belong ='+loadCourseId;
		// console.log(queryString3);
		var queryString4 = 'INSERT INTO experienceTable(experienceName,experienceObjective,experienceEnvironment,experiencePrinciple,experienceProcedures,experienceLabel,belong)('+ queryString3 +');'
		console.log(queryString4);
		// 找到添加的课程是否是notebook课程
		conn.query('select vncNotebook from courseTable where courseId ='+loadCourseId,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json({"vncNotebookFlag":""});//数据库新纪录添加失败
			}else{
				console.log("vnc还是notebook类型的显示：")
				console.log(rows[0].vncNotebook);
				if(rows[0].vncNotebook == 1){
					// 该课程为非notebook类型时，只需要更新experienceTable，不需要对实验指导书进行复制
					conn.query(queryString2,function(err,rows){
						if(err){
							console.log(err);
							res.status(200).json("loadNewCourse failed");//数据库新纪录添加失败
						}else{
							// 课程更新成功后更新实验表
							conn.query(queryString4,function(err,rows){
								if(err){
									console.log(err);
									res.status(200).json("loadNewExp failed");
								}else{
									res.status(200).json("loadNewExp successful");//新纪录添加成功
								}
							})
							
						}
					});
				}else{
					// 当该课程为notebook类型，需要将每个实验的实验指导书进行文件的复制
					console.log("notebook实验部分");
					// // 该课程为notebook类型
					conn.query(queryString2+queryString5,function(err,rows){
						if(err){
							console.log(err);
							res.status(200).json("loadNewCourse failed");//数据库新纪录添加失败
						}else{
							console.log("新建课程的id号");
							console.log(rows);
							console.log(rows[1][0].newInsertCourseId);
							// 课程更新成功后更新实验表
							var queryString6 = 'select * from experienceTable where belong = ' + loadCourseId+';';
							// 从实验表中读取该公共课程下的所有实验
							conn.query(queryString6,function(err,rows1){
								if(err){
									console.log(err);
								}else{
									console.log(rows1);
									console.log("公共课程下的所有实验");
									console.log(rows1[0]);
									// async.map(rows1[0],function(item,callback){

									// })
									// 该课程下所有实验的临时存放处
									var expTemp = [];
									for(var i = 0; i < rows1.length; i ++){
										expTemp[i] = rows1[i];
										console.log(rows1[i].experienceId);
										var expid = rows1[i].experienceId;
										console.log(expid);
										var strings1 = 'INSERT INTO experienceTable(expOrder,experienceName,experienceObjective,belong)value("'+i+'","'+ rows1[i].experienceName +'","'+ rows1[i].experienceObjective +'","'+rows[1][0].newInsertCourseId+'");';
										console.log(strings1);
										// 获取最新插入的实验id号
										var strings2 = 'select LAST_INSERT_ID() as newInsertExpId;select ' +expid + ' as expid';
										var flag = 0;
										// 为了在query模块里面读取到公共课程的实验id，strings3传递id
										// var strings3 = 'select '+ rows1[i].experienceId +'from experienceTable where experienceId = '+rows1[i].experienceId+';';
										conn.query(strings1+strings2,function(err,rows2){
											if(err){
												console.log(err);
												res.status(200).json("loadNewExp failed");
											}else{
												// 输出新生成的实验id
												console.log(rows2[1][0]);
												console.log("expid:");
												console.log(rows2[2][0].expid);
												
												// 原始的公共实验id
												// console.log(rows2[2][0]+"1111111");
												fs.mkdir("TensorFlow/CommonFiles/"+rows2[1][0].newInsertExpId+"/", function(err){
													if(err) {
									                    querystring = "delete from experienceTable where experienceId = ?";
									                    conn.query(querystring,[rows2[1][0].newInsertExpId],function(err,rows){
									                    	if(err){
									                    		console.log(err);
															}
														});
														str = "couldn't create dir";
														console.log(str);
									                }else{
									                	// 将旧课程下的文件拷贝到新课程下
									                	console.log("将课程下的文件拷贝到新课程下");
									                	console.log(rows2[1][0].newInsertExpId);								
									                	console.log(rows2[2][0].expid);

									                	// var source = "./TensorFlow/CommonFiles/"+loadCourseId+"/"+rows1[i].experienceId+"/";
									                	// var target = "./TensorFlow/CommonFiles/"+rows[1][0].newInsertCourseId+"/"+rows2[1][0].newInsertExpId+"/";
									                	// 将就id文件夹下的所有文件复制到新的id文件夹下面
														callfile.exec('cp -r ./TensorFlow/CommonFiles/'+rows2[2][0].expid+'/* ./TensorFlow/CommonFiles/'+rows2[1][0].newInsertExpId+'/',function(err,stdout,stderr){
															if(err){
																flag = flag - 1;
																console.log("复制error:"+err);
															}
														});
														// 将新id文件夹整个复制到gpu-1上面
														callfile.exec('scp -r ./TensorFlow/CommonFiles/'+rows2[1][0].newInsertExpId+' root@10.20.0.19:/home/tensorflow/199/CommonFiles',function(err,stdout,stderr) {
															if(err){
																flag = flag - 1;
																console.log("复制到gpu-1：error:"+err);
															}
														});
														flag = flag + 1;
														console.log("文件拷贝成功"+flag);
														// i的值为for循环的跳出时的值，当复制语句全部成功时，flag值即为i的值
														if(flag == i){
															res.status(200).json("loadNewExp successful");//新纪录添加成功
														}
														
													}
												})
											}
										})

									}
									// console.log(expTemp);

								}
							})
							
						}
					});
				}
			}
		})
		
	})
}

// 获取当前老师的课程
exports.loadCourse = function(req,res){
	console.log(req.body);
	console.log(req.body.loadCommonCourseId);
	// 由于使用教师名称读取数据库可能存在同名现象，因此使用教师的id
	var teacherId = req.body.teacherId;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		// 公共课程的类型标签
		var queryString1 = 'select vncNotebook from courseTable where courseId = '+req.body.loadCommonCourseId+';';
		console.log(queryString1);
		// 从数据库中找到公共课程的所属类型是notebook还是非notebook，然后从数据库中找到公共课程的类型			
		conn.query('SELECT courseId,courseName,vncNotebook FROM courseTable WHERE teacherName ="'+ teacherId +'" ORDER BY courseId;'+queryString1,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"teacherCourse":""});//数据库中无数据
			}else{
				console.log("教师表中的数据");
				console.log(rows);
				console.log(rows[0]);
				res.status(200).json({"teacherCourse":rows});//数据库中有数据
			}
		});
		
	})

}
//添加公共课程到已有的课程中
exports.loadExistCourse = function(req,res){
	console.log(req.body);
	// 老师已有的课程id
	var existCourseId = req.body.existCourseId;
	console.log(existCourseId);
	// 共有课程id
	var loadCourseId = req.body.loadCourseId;
	console.log(loadCourseId);
	var courseFlag = req.body.flag;
	console.log(courseFlag);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		//公共课程添加到已有的课程中时，已有课程原本的课程名称、简介等信息保持不变，实验内容更新
		// 获取公共课程的相关信息
		// var queryString1 = 'SELECT experienceName,experienceObjective,experienceEnvironment,experiencePrinciple,experienceProcedures,experienceLabel,'+ existCourseId +' FROM experienceTable WHERE belong ='+loadCourseId;
		var queryString1 = 'select * from experienceTable WHERE belong = '+loadCourseId;
		// var queryString2 = 'INSERT INTO experienceTable(experienceName,experienceObjective,experienceEnvironment,experiencePrinciple,experienceProcedures,experienceLabel,belong)('
		var queryString2 = 'INSERT INTO experienceTable(experienceName,experienceObjective,experienceEnvironment,experiencePrinciple,experienceProcedures,experienceLabel,belong)('+ queryString1 +');'
		console.log(queryString2);
		// 获取老师已有的课程下的所有实验个数，方便expOrder字段继续增加
		var queryString3 = 'SELECT experienceId FROM experienceTable WHERE belong = '+ existCourseId +';';
		console.log(queryString3);
		// 获取公共课程下的所有实验的id
		// var queryString4 = 'select experienceId FROM experienceTable WHERE belong = '+ loadCourseId+';';
		// 该课程为非notebook类型时，只需要更新experienceTable，不需要对实验指导书进行复制
		conn.query(queryString3+queryString1,function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json("null");//数据库新纪录添加失败
			}else{
				// res.status(200).json("loadExistExp successful");//新纪录添加成功
				console.log("老师已有课程下的实验id以及公共课程下的所有实验内容：");
				console.log(rows);
				console.log("原始实验的个数："+rows[0].length);
				console.log("实验插入："+rows[1]);
				
				// 数据库操作完毕之后的标签数字，当为实验的总长度时，代表实验全部复制成功，当不为总长度时，代表复制过程失败
				var endFlag = 0;
				var j = 0;
				// var i = 0;
				for(var i = 0; i < rows[1].length; i ++){
					// 在原始教师实验的基础上，插入新的公共实验，因此order增加
					var order = rows[0].length + i;
					console.log(order);
					// 保存当前公共课程下的某个实验原始id
					var expid = rows[1][i].experienceId;
					if(courseFlag == 1){
						// 将实验表中的实验步骤和实验原理中的双引号前面加上转义字符\
						var stringPrinciple = rows[1][i].experiencePrinciple.replace(/"/gi,'\\\"');
						var stringProcedure = rows[1][i].experienceProcedures.replace(/"/gi,'\\\"');
					}else{
						var stringPrinciple = rows[1][i].experiencePrinciple;
						var stringProcedure = rows[1][i].experienceProcedures;
					}
					var strings1 = 'INSERT INTO experienceTable(expOrder,experienceName,experienceObjective,experienceEnvironment,experiencePrinciple,experienceProcedures,experienceLabel,belong) value ("'+order+'","'+ rows[1][i].experienceName +'","'+ rows[1][i].experienceObjective +'","'+rows[1][i].experienceEnvironment+'","'+stringPrinciple+'","'+stringProcedure+'","'+rows[1][i].experienceLabel+'","'+existCourseId+'");';
					console.log(strings1);
					// 当前新插入的id
					var strings2 = 'select LAST_INSERT_ID() as newInsertExpId;select ' +expid + ' as expid';
					conn.query(strings1+strings2,function(err,results){
						if(err){
							console.log("出错");
							// endFlag[i++] = "failed";	
							res.status(200).json("loadExistExp failed");//新纪录添加失败
						}
						// endFlag[j++] = "success";	
						if(courseFlag == 1){	
								console.log("novnc课程部分");
								endFlag = endFlag + 1;
								if(endFlag == rows[1].length){
									console.log("数据库全部复制成功");
									// 非notebook课程只需要对数据库进行更新，不需要对文件进行复制，因此直接返回
									res.status(200).json("loadExistCourse successful");//数据库新纪录添加成功
									
								}
						}else{
							// 当课程为notebook类型的课程，不仅需要对实验表进行更新，还需要对实验指导书文件进行复制
							console.log("notebook课程部分");
							// 输出新生成的实验id
							console.log("新实验id："+results[1][0].newInsertExpId);
							console.log("原始实验id："+results[2][0].expid);
							fs.mkdir("TensorFlow/CommonFiles/"+results[1][0].newInsertExpId+"/", function(err){
								if(err) {
				                    querystring = "delete from experienceTable where experienceId = ?";
				                    conn.query(querystring,[results[1][0].newInsertExpId],function(err,rows){
				                    	if(err){
				                    		console.log(err);
										}
									});
									str = "couldn't create dir";
									console.log(str);
				                }else{
				                	// 将旧课程下的文件拷贝到新课程下
				                	console.log("将课程下的文件拷贝到已有课程下");
									callfile.exec('cp -r ./TensorFlow/CommonFiles/'+results[2][0].expid+'/* ./TensorFlow/CommonFiles/'+results[1][0].newInsertExpId+'/',function(err,stdout,stderr){
										if(err){
											endFlag = endFlag - 1;
											console.log("复制error:"+err);
										}
									});
									callfile.exec('scp -r ./TensorFlow/CommonFiles/'+results[1][0].newInsertExpId+'/ root@10.20.0.19:/home/tensorflow/199/CommonFiles',function(err,stdout,stderr) {
										if(err){
											endFlag = endFlag - 1;
											console.log("复制到gpu-1：error:"+err);
										}
									});
									endFlag = endFlag + 1;
									console.log(endFlag);
									console.log(endFlag+"文件拷贝成功");
									if(endFlag == rows[1].length){
										console.log("数据库全部复制成功");
										// 非notebook课程只需要对数据库进行更新，不需要对文件进行复制，因此直接返回
										res.status(200).json("loadExistCourse successful");//数据库新纪录添加成功
										
									}
								}
							})
						}
					});
				}
			}
		});
		
	})
}