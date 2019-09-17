// 实验标题发送
exports.sendTitle = function(req,res){
	console.log(req.body);
	/*req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		}else{*/
			// 将实验模块的名称保存到session中，注意加了[0]
			req.session.experimentalContent = req.body.experimentalContent[0].experienceName;
			// 讲实验id保存到session中
			req.session.experimentalId = req.body.experienceId;
			req.session.firsttimeAccess = new Date().getTime();
			// 课程id

			//req.session.courseContent = req.body.courseContent[0].chosingId;

			// req.session.courseContent = req.body.courseContent[0].chosingId;

			console.log("session实验名称更新");
			// console.log(req.body.experimentalContent);
			console.log(req.session);
			res.end();
		/*}
		//conn.release();
	});*/
}

//实验内容返回
exports.getSteps = function(req,res){
	console.log(req.session.experimentalContent);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		//实验标题：experienceName
		//实验目的：experienceObjective        ContentSteps
		//实验环境：experienceEnvironment      ContentEncironment
		//实验原理：experiencePrinciple        ContentPrinciple
		//实验步骤：experienceProcedures       ContentProcedures
		var sql = "SELECT experienceObjective,experienceEnvironment,experiencePrinciple,experienceProcedures FROM experienceTable WHERE experienceName=?";//实验目的
		var name = req.session.experimentalContent;
		console.log("实验内容返回");
		console.log(name);
		conn.query(sql,[name],function(err,ContentSteps){
			//conn.destroy();
			if(err){
				console.log(err);
				res.status(200).json({"courseContentSteps":"","courseContentEnvironments":"","courseContentPrinciples":"","courseContentProcedures":"","ContentProcedures":""});//数据库无数据
			}else{
				var courseContentSteps=ContentSteps[0].experienceObjective;//实验目的
				var courseContentEnvironments=ContentSteps[0].experienceEnvironment;//实验环境
				var courseContentPrinciples=ContentSteps[0].experiencePrinciple;//实验原理
				var courseContentProcedures=ContentSteps[0].experienceProcedures;//实验步骤
				// console.log(courseContentProcedures);
				//字符串切分全部转交给前台浏览器来实现，服务器不再负担此部分功能
				//注意null值
				// console.log(typeof(courseContentProcedures));
				// console.log(courseContentProcedures[0]);
				res.status(200).json({"courseContentName":name,
					"courseContentSteps":courseContentSteps,
					"courseContentEnvironments":courseContentEnvironments,
					"courseContentPrinciples":courseContentPrinciples,
					"courseContentProcedures":courseContentProcedures});
			}
		});	
	//conn.release();
	});
};

exports.getupdCourse = function(req,res){
    var teacherName = req.body.teacherName;
	//console.log("teachName"+teacherName);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
	// 从数据库中读取与当前老师姓名一样的课程数据
		var sql = '';
		if (req.session.authority == 1)
			sql = 'SELECT courseName,courseId,coursePicture FROM courseTable WHERE vncNotebook = 1 and teacherName="' + teacherName +'";';
		//console.log(req.session.authority == 1)
		//console.log(sql);
	conn.query(sql,function(err,rows){
		//conn.destroy();
	    if(err){
			console.log(err);
			res.status(200).json({"courseInfos":""});//数据库中无数据
		}else{
			//console.log("当前教师的课程");
			//console.log(rows);
			res.status(200).json({"courseInfos":rows});//数据库中有数据
		}
	});
	//conn.release();
})
};
exports.getExpContent = function(req,res){
	var vncNotebookFlag = 1;
    req.getConnection(function(err,conn) {
        if (err) {
            console.log("Failed to connect");
            res.status(500).json(err);
        }
        console.log(req.body);
        var sql = "select * from experienceTable WHERE experienceId = ?;";
        // 将课程是否是notebook标记从数据库中读取
        // var sql2 = "select vncNotebook from courseTable WHERE courseId = (select belong from experienceTable WHERE experienceId = "+ req.body.expId +");"
        conn.query(sql, [req.body.expId], function (err, Content) {
            //conn.destroy();
            if (err) {
                console.log(err);
                res.status(200).json("Failed");//数据库无数据
            } else {
                console.log("实验数据获取成功");
                console.log(Content);
                console.log(Content[0]);
                // 将课程vncNotebook标记写入到Content[0]
                // Content[0].vncNotebookFlag = Content[1][0].vncNotebook;
                // console.log(Content[1][0].vncNotebook);
                res.status(200).json({"expcontent": Content[0]});
            }
        });
    });
};

exports.updExpContent = function(req,res){
    req.getConnection(function(err,conn) {
        if (err) {
            console.log("Failed to connect");
            res.status(500).json(err);
        }
        console.log(req.body);
        var sql = "update experienceTable set experienceObjective = ?,experienceEnvironment =? ,experiencePrinciple =?,experienceProcedures =?,experienceName =? WHERE experienceId = ? "
        conn.query(sql, [req.body.expObj, req.body.expEnv, req.body.expPrin, req.body.expPro, req.body.expName, req.body.expId], function (err, ContentSteps) {
            //conn.destroy();
            if (err) {
                console.log(err);
                res.status(200).json("Failed");//数据库无数据
            } else {
                console.log("session实验更新");
                res.status(200).json("success");
            }
        });
    });
};

// updExpNBContent为notebook类型的实验修改
exports.updExpNBContent = function(req,res){
	console.log("notebook类型的实验修改");
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		}
		console.log(req.body);
		var sql = "update experienceTable set experienceName = ?,experienceObjective = ? where experienceId = ?";
		conn.query(sql, [req.body.expName, req.body.expObj, req.body.expId],function(err,rows){
			if(err){
				console.log(err);
				res.status(200).json("Failed");//数据库更新失败
			}else{
				console.log("成功");
				res.status(200).json("success");//更新成功
			}
		});
	});
};
