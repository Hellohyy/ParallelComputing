// 从数据库中获取当前课程的名称等概括信息
exports.getCourseName = function(req,res){
	var data = req.body.id;
	console.log(data);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		conn.query('SELECT * FROM courseTable WHERE courseId ='+ data+';',function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"chosingCourse":""});//数据库中无数据
			}else{
				// console.log(rows);
				res.status(200).json({"chosingCourse":rows});//数据库中有数据
			}
		});
		//conn.release();
	})
};
exports.findCourseName = function(req,res){
    	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		console.log("实验id"+req.body.expId);
		var querystring = "SELECT courseName,experienceName FROM courseTable as a join experienceTable as b on b.belong = a.courseId and b.experienceId = '" + req.body.expId +"';";
		conn.query(querystring,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
			}else{
				//console.log("数据库更新成功");
				res.status(200).json({"courseName":rows[0].courseName,"experienceName":rows[0].experienceName});//数据库更新成功
			}
		//conn.release();
		});
});
}

exports.getModule = function(req,res) {
    //获取从前端传递过来的参数：课程id
    var data = req.body.id;
    //data是{}类型的数据
    console.log(data);
    req.getConnection(function (err, conn) {
        if (err) {
            console.log("Failed to connect");
            res.status(500).json(err);
        }
        ;
        var result = '';
        var pyJudge = '';
        var stuNum = '';
        conn.query('SELECT * FROM experienceTable WHERE belong =? order by experienceId', [data], function (err, rows) {
            if (err) {
                console.log(err);
                res.status(500).json('无法获取数据库数据');
            } else {
                result = rows;
                conn.query("SELECT vncNotebook from courseTable where courseId = ?", [data], function (err, results) {
                    //conn.destroy();
                    if (err) {
                        console.log(err);
                        //res.status(500).json(err);
                        res.status(500).json('无法获取数据库数据');
                    } else {
                        // console.log(results[0]);
                        // console.log("这门课程是用notebook吗"+results[0].vncNotebook);
                        pyJudge = results[0].vncNotebook;
                        if (req.session.authority == 1 || req.session.authority == 2) {
                            conn.query("SELECT courseName,count(distinct userName) as userCount from recordTable join experienceTable on experienceTable.belong = ? and experienceTable.experienceName = recordTable.courseName group by recordTable.courseName ", [data], function (err, results) {
                                //conn.destroy();
                                if (err) {
                                    console.log(err);
                                    res.status(500).json('教师无法获取数据库数据');
                                    //res.status(500).json(err);
                                } else {
                                    // console.log(results[0]);
                                    // console.log("这门课程是用notebook吗"+results[0].vncNotebook);
                                    stuNum = results;
                                    res.status(200).json({
                                        "chosingModule": result,
                                        "pyJudge": pyJudge,
                                        "stuNum": stuNum
                                    });
                                }

                            });
                        }
                        else {
                            res.status(200).json({"chosingModule": result, "pyJudge": pyJudge});
                        }
                    }
                });

            }
            //sql语句的拼接，选取id号符合的模块，查询该实验所属课程，判断实验展示界面是否为jupyter界面
            /*conn.query('SELECT * FROM experienceTable WHERE belong ='+ data +';', function(err,rows){
                if(err){
                    console.log(err);
                    res.status(200).json({"chosingModule":""});//数据库中无数据
                }else{
                    // console.log(rows);
                    var sql = "SELECT vncNotebook From courseTable where courseId = ?";
                    conn.query(sql,[data],function(err,results){
                        //conn.destroy();
                        if(err){
                            console.log("Failed to connect");
                            res.status(500).json(err);
                        }else{
                            // console.log(results[0]);
                            // console.log("这门课程是用notebook吗"+results[0].vncNotebook);
                            var pyJudge = results[0].vncNotebook;
                            res.status(200).json({"chosingModule":rows,
                                "pyJudge":pyJudge});
                        }
                    })
                }
            });*/
            // conn.release();
        });
    });
}

//获取当前用户名
exports.getUserName = function(req,res){
	var name = req.session.userName;
	// console.log("这是username");
	console.log(name);
	res.json({"userName":name});

};


//获取模块名
exports.sendModuleId = function(req,res){
	console.log("1111");
	// console.log(req.body);
	var experienceId = req.body.experienceId;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var querystring ='';
		//sql语句
		querystring = 'SELECT experienceName FROM experienceTable WHERE experienceId = '+ experienceId +';';
		console.log(querystring);
		conn.query(querystring,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
				res.status(200).json({"experienceName":""});//数据库中无数据
			}else{
				console.log(rows);
				res.status(200).json({"experienceName":rows});//数据库中有数据
			}
		});
	//conn.release();
	})


}

// 更新实验表，确定实验对于学生是否可见
exports.updateExpHideShow = function(req,res){
	console.log(req.body);
	// 当前需要隐藏或显示的实验id
	var updateId = req.body.updateId;
	// 当前点击的次数
	// var tag = req.body.hideShow;
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
		};

		queryString1 = 'update experienceTable set hideLogoExp =(case hideShowExp when 1 then "assets/img/avatars/show.ico" when 0 then "assets/img/avatars/hide.ico" else hideShowExp end ) where experienceId = '+ updateId +';';
		queryString2 = 'update experienceTable set hideShowExp =(case hideShowExp when 1 then 0 when 0 then 1 else hideShowExp end) where experienceId =' + updateId + ';';

		// 数据库中hideShowExp字段更新:0变为1；1变为0
		conn.query(queryString1+queryString2,function(err,rows){
			if(err){
				console.log("未找到对应的实验");
				res.status(200).json("failed");
			}else{
				conn.query('SELECT hideLogoExp,hideShowExp FROM experienceTable WHERE experienceId =' + updateId +';',function(err,rows){
					if(err){
						console.log("获取隐藏图片路径失败");
						res.status(200).json("failed");
					}else{
						// 获取到当前数据库中存储的图片路径值冰传递给前台
						res.status(200).json({"logoExp":rows});
					}
					
				});
			}
		});

	})

}

// 删除选中的某个实验内容
exports.deleteExperience = function(req,res){
	console.log(req.body.expId);
	var experienceId = req.body.expId;
	console.log("这里是删除特定的实验");
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var querystring = '';
		//sql语句
		querystring = 'DELETE FROM experienceTable WHERE experienceId = ' + experienceId +';';
		conn.query(querystring,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log("数据库更新失败");
			}else{
				console.log("数据库更新成功");
				res.status(200).json("success");//数据库更新成功
			}
		//conn.release();
		});


	})
}



//用户点击某一模块后，对该模块中的tag标签进行更新，tag=用户名
exports.updateTag = function(req,res){
	var tag_data = req.body.tagId;
	console.log(tag_data);
	console.log(req.session);
	//当前用户名:id

	var currentUserName = req.session.userId;
	console.log("1234567890");
	// console.log(req.session);
	console.log(currentUserName);
	
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		var querystring ='';

		//select获取tag字段，将结果变量保存在一个string变量中，然后，我们对这个变量做一个split切分，对字符串数组轮流对比是否有同用户名。
		
		conn.query('SELECT tag FROM experienceTable WHERE experienceId =' + tag_data,function(err,rows){
			if(err){
				console.log("未找到tag");
				return;
			}else{
				var flag =0;
				console.log(rows);
				var experienceTagName = rows[0].tag.split(",");
				console.log(experienceTagName)
				for(var temp in experienceTagName){
					console.log(temp);
					if(currentUserName === experienceTagName[temp]){
						console.log("该用户名已存在");
						flag=1;
						break;
					}
				}
				// 若tag字段中已存在该用户名，证明该用户已学过，不需要更新tag字段，如果不存在，则更新该tag字段
				if(flag == 0){
					//将结果添加进tag字段
					querystring = 'UPDATE experienceTable SET tag = CONCAT(tag,",' + currentUserName +'") WHERE experienceId ='+ tag_data + ';';
					console.log(querystring);
					conn.query(querystring,function(err,rows){
						if(err){
							console.log("更新失败");//数据库更新失败
						}else{
							console.log("更新成功！");
							res.status(200).json("success");//数据库更新成功
						}
					});
				}else{
					console.log("该用户已经学过本实验");
					res.status(200).json("success");//数据库不需要更新即可
				}
			}
		});
		
				//上面这一段内容都在select这个语句执行的小括号里面完成。

		
	})
};
