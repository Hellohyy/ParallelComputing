const fs = require("fs");
const callfile = require("child_process");
// 获取当前老师的课程
exports.currentCourseNames = function(req,res){
	// 保存传递过来的教师名称信息
	var teacherName = req.body.teacherName;
	console.log("当前老师的姓名信息显示："+teacherName);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
	// 从数据库中读取与当前老师姓名一样的课程数据
	conn.query('SELECT courseName,courseId,vncNotebook FROM courseTable WHERE teacherName="' + teacherName +'";',function(err,rows){
		//conn.destroy();
	    if(err){
			console.log(err);
			res.status(200).json({"courseNames":""});//数据库中无数据
		}else{
			console.log("当前教师的课程");
			console.log(rows);
			res.status(200).json({"courseNames":rows});//数据库中有数据
			console.log("测试1205");
		}
	});
	//conn.release();
})
};
//内容管理
exports.createContent = function(req,res){
	//获取从前端传递过来的参数：
	var data = req.body;
	//data是{}类型的数据
	// 实验名称、环境、目的、步骤、标签
	var expCourseId=data.expCourseId;//实验所属的课程名称
	var expName=data.expName;
	var expObj=data.expObj;//实验目的
	var expPrin=data.expPrin;//实验原理
	var expEnv=data.expEnv;//实验环境
	var expPro=data.expPro;//实验步骤
	var existExpNum=data.existExpNum;//已有的实验数目
	// var expLabel=data.expLabel; 

	//var expLabel=data.expLabel;

	// 课程名称、简介、图片
	// var couName = data.couName;
	// var couIntro = data.couIntro;
	// var couPic = data.couPic;
	var expBelong = '';//实验所属课程id号
	// console.log("测试课程名称1205")
	// console.log(data);
	// console.log(expCourseId);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};

	// 如果找到对应的课程id号则进行数据表的更新：添加实验内容;增加实验顺序字段order
	var querystring = "INSERT INTO experienceTable(expOrder,experienceName,experienceObjective,experienceEnvironment,experiencePrinciple,experienceProcedures,belong) VALUES (?,?,?,?,?,?,?)";
	//console.log(querystring);
	conn.query(querystring,[existExpNum,expName,expObj,expEnv,expPrin,expPro,expCourseId], function(err,rows){
		//conn.destroy();
	    if(err){
			console.log(err);
			// 实验表添加新内容更新失败
			res.status(200).json("Failed");
		}else{
			console.log(rows);
			// 实验表添加新内容更新成功
			res.status(200).json("success");
		}
	});
	//conn.release();
})	
};

exports.createNBContent = function(req,res){
	//获取从前端传递过来的参数：
	console.log("NB 实验添加");
	console.log(req.body);
	var data = req.body;
	//data是{}类型的数据
	// 实验名称、环境、目的、步骤、标签
	var expCourseId=data.expCourseId;//实验所属的课程名称
	var expName=data.expName;
	var expIntro=data.expIntro;//实验介绍
	var addMethod=data.addMethod;//实验环境
	var existExpNum=data.existExpNum;//已有的实验数目
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};

	// 如果找到对应的课程id号则进行数据表的更新：添加实验内容
	var querystring = "INSERT INTO  experienceTable(expOrder,experienceName,experienceObjective,belong) VALUES (?,?,?,?);select @@IDENTITY;";
	//console.log(querystring);
	conn.query(querystring,[existExpNum,expName,expIntro,expCourseId], function(err,rows){
		//conn.destroy();
	    var str = "";
        if(err){
			console.log(err);
			// 实验表添加新内容更新失败
			res.status(200).json("Failed");
		}else{
			var id = rows[1][0]["@@IDENTITY"];

			fs.mkdir("TensorFlow/CommonFiles/"+id+"/", function(err){
				if(err) {
                    querystring = "delete from experienceTable where experienceId = ?";
                    conn.query(querystring,[id],function(err,rows){
                    	if(err){
                    		console.log(err);
						}
					});
					str = "couldn't create dir";
					console.log(str);
                }
				else{
                    fs.open("TensorFlow/CommonFiles/" + id + "/guidance.ipynb", 'w', function (err, fd) {
                        if (err) {
                            fs.rmdir("TensorFlow/CommonFiles/" + id,function(err){
                           		console.log(err);
							});
                            str = "couldn't create file";
                            console.log(str);
                        }
                        else {
                        	var success = true;
                        	fs.mkdir("TensorFlow/CommonFiles/"+id+"/original/",function(err){
                        		if (err) console.log(err);
                            });
                            text = '{"cells": [], "metadata": {}, "nbformat": 4, "nbformat_minor": 2}';
                            console.log(text);
                            fs.write(fd, text, function (err) {
                                fs.close(fd, function (err) {
                                    if (err) {
                                       console.log(err);
                                    	success = false;
                                    }
                                });
                                if (err) success = false;
                                if (!success) {
                                	querystring = "delete from experienceTable where experienceId = ?";
                    				conn.query(querystring,[id],function(err,rows) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                                    fs.unlink("TensorFlow/CommonFiles/" + id + "/guidance.ipynb",function (err) {
										console.log(err);
                                    });
                                    fs.unlink("TensorFlow/CommonFiles/" + id + "/original",function (err) {
										console.log(err);
                                    });
                                    fs.unlink("TensorFlow/CommonFiles/" + id ,function (err) {
										console.log(err);
                                    });
                                    str = "WriteFile failed";
                                }
                                else{
                                	req.session.experimentalContent = expName;
                                	req.session.experimentalId = id;
                                	callfile.exec('scp -r ./TensorFlow/CommonFiles/'+id+'/ root@192.168.1.61:/home/tensorflow/199/CommonFiles',function(err,stdout,stderr) {
                                        if (err) {
                                            console.log('error:' + err);
                                        }
                                    });
                                	console.log(req.session);
								}
                            });
                        }

                    });
                }
            });




			// 实验表添加新内容更新成功

		}
		res.status(200).json({insertResult: id, writeResult: str});
	});
	//conn.release();
});
};

exports.uploadExp = function(req,res){

	if(req.files["expFile"] == undefined){
        console.log('空文件上传');
		res.status(500);
        // return;
    }else {
		file = req.files["expFile"];
        // 将新课程的图片名称保存到session中，方便之后数据库更新时进行使用
        // req.session.picName = req.file.originalname;

        console.log("这里是文件名");
        console.log(file.name);
        console.log(req.body);
        // var picName = "";
        // picName = req.file.originalname;
		fs.open("TensorFlow/CommonFiles/" + req.body.expId + "/guidance.ipynb", 'w', function (err, fd) {
            if (err) {
                console.log(err);
            }
            else {
                fs.write(fd, file.data, function (err) {
                    fs.close(fd, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    if(err){
                    	console.log(err);
					}
					else{
						callfile.exec('scp -r ./TensorFlow/CommonFiles/'+req.body.expId+'/ root@192.168.1.61:/home/notebook/TensorFlow/CommonFiles/205',function(err,stdout,stderr) {
                                        if (err) {
                                            console.log('error:' + err);
                                            }
                                        else{
                                                console.log('传输完毕');
                                                res.status(200).redirect("/#/app/contentManage");
                                                }

                                    });
					}
                });
            }
		});
    }
};