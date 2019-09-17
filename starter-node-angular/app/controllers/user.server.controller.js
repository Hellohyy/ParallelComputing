// 获取用户信息
exports.getUser = function(req,res){
  var select_user_id = req.body.USER_ID;
  var select_user_password = req.body.USER_PASSWORD;
  var select_user_identity = req.body.USER_IDENTITY;
  console.log(select_user_id);
  console.log(select_user_identity);
    req.getConnection(function(err,conn){
    console.log(err);
    console.log(conn);
    if(err){
      console.log("Failed to connect");
      res.status(500).json(err);
    };
    if (select_user_password =='' || select_user_id=='' || select_user_id == null || select_user_password == null)
      res.status(403).json({"error":"非法请求"}).end();
    else {
            var querystring = 'SELECT * FROM usertable WHERE userId = "'  + select_user_id + '" and authority = "' + select_user_identity +'"';
            // console.log(querystring);
            conn.query(querystring, function (err, rows) {
                //conn.destroy();
                if (err) {
                    console.log(err);
                    res.status(403).json({"error": err});//数据库无数据
                } else {
                    if(rows.length == 0){
                        res.status(200).json({"info": "无此用户"});//数据库无数据
                    }
                    else {
                        if (rows[0].password == select_user_password) {
                            req.session.userId = rows[0].userId;
                            req.session.password = rows[0].password;
                            req.session.authority = rows[0].authority;
                            res.status(200).json({"info": "success", "authority": rows[0].authority,"name":rows[0].userName,"headPortrait":rows[0].headPortrait});//数据库有数据
                        }
                        else
                            res.status(200).json({"info": "密码错误"});//数据库有数据
                        // console.log(req.session);
                        // console.log(req.sessionID);
                    }
                    //res.end();
                    }
            });
        }
    //conn.release();
    });

};


// 注册用户信息
exports.addUser = function(req,res){
	var add_user_name = req.body.USER_NAME;
	var add_user_password = req.body.USER_PASSWORD;
	console.log(add_user_name);
	console.log(add_user_password);
    req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
		
   		var querystring = 'INSERT INTO userTable(userName,password) VALUES (' + '\'' + add_user_name + '\',' + '\'' + add_user_password + '\')';
   		console.log(querystring);
		conn.query(querystring,function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err.sqlMessage);
				if(err.errno == 1062)
				res.status(200).json({"info":"用户名重复，请重新输入"})
                else
                    res.status(200).json({"info":err.sqlMessage})
			}else{
				console.log('注册成功');
				res.status(200).json({"info":"成功"});
			}
		});
	//conn.release();
    })

};

exports.usrLogout = function(req,res){
   req.session.userName = null;
   req.session.password = null;
   req.session.authority = null;
   req.session.destroy(function(err) {
       if (err) {
           res.status(403).json({ret_code: 2, ret_msg: '退出登录失败'});
           return;
       }
       res.clearCookie('session');
       res.end();
       req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		}
		    conn.destroy();
       });
       //res.redirect('/#/login');
   });
}

exports.deleteStd = function(req,res){
  var deleteId = req.body.StdId;
  console.log(deleteId);
  req.getConnection(function(err,conn){

      if(err){
      console.log("Failed to connect");
    };  

    // 删除班级-学生关系表中该学生的信息
    conn.query('DELETE FROM class_std WHERE userId ='+ deleteId +';',function(err,rows){

        if(err){
        console.log("删除失败");
      }else{
        console.log("删除成功");
        // res.status(200).json("success");
      }
    });


    // 删除用户表中的该学生
    conn.query('DELETE FROM usertable WHERE userId ='+ deleteId +';',function(err,rows){
      //conn.destroy();
        if(err){
        console.log("删除失败");
      }else{
        console.log("删除成功");
        res.status(200).json("success");
      }
    });
    //conn.release();
  })
};

//获取当前用户名
// exports.getUserName = function(req,res){
// 	var name = req.session.userName;
// 	// console.log("这是username");
// 	console.log(name);
// 	res.json({"userName":name});

// };

exports.getTeacherList = function(req,res){
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
    var querystring = 'SELECT * FROM userTable WHERE authority=1 ORDER BY userID';
    conn.query(querystring,function(err,rows){
      //conn.destroy();
        if(err){
        console.log(err);
        res.status(200).json({"teachers":""});//数据库中无数据
      }else{
        console.log(rows);
        res.status(200).json({"teachers":rows});//数据库中有数据
        console.log("教师名单查询成功");
      }
    });
    //conn.release();
  })
};

//获取所有学生名单
exports.getAllStdList = function(req,res){
  // 保存传递过来的学生信息
  console.log(req.body);
  req.getConnection(function(err,conn){
    if(err){
      console.log("Failed to connect");
      res.status(500).json(err);
    };
    // 从数据库中读取所有班级数据
    // var querystring = 'SELECT * FROM userTable WHERE authority=0 ORDER BY userID';
    var querystring = 'select userTable.*,classtable.classname from userTable join classtable on userTable.classId = classtable.classId and userTable.authority = 0;';
    conn.query(querystring,function(err,rows){
      //conn.destroy();
        if(err){
        console.log(err);
        res.status(200).json({"students":""});//数据库中无数据
      }else{
        console.log(rows);
        res.status(200).json({"students":rows});//数据库中有数据
        console.log("学生名单查询成功");
      }
    });
    //conn.release();
  })
};



// H获取用户的个人信息
exports.getUserInfo = function(req,res){
  console.log("获取用户信息"+req.body.userId);
  req.getConnection(function(err,conn){
    if(err){
      console.log("Failed to connect");
      res.status(500).json(err);
    };
    var querystring = "select * from userTable where userId = '"+ req.body.userId+"' ;";
    console.log(querystring);
    conn.query(querystring,function(err,rows){
      if(err){
        console.log(err);
        res.status(200).json({"userInfo":""});//数据库中无数据
      }else{
        console.log("用户信息：");
        console.log(rows);
        res.status(200).json({"userInfo":rows});//数据库中有数据
      }
    })
  })
};

// 修改密码
exports.modifyPassword = function(req,res){
  console.log("修改密码");
  console.log(req.body.userId);
  console.log(req.body.newPassword);
  req.getConnection(function(err,conn){
    if(err){
      console.log("Failed to connect");
      res.status(500).json(err);
    };
    var querystring = "update userTable set password = '"+ req.body.newPassword+"' where userId = '"+ req.body.userId +"';";
    console.log(querystring);
    conn.query(querystring,function(err,rows){
      if(err){
        console.log(err);
        res.status(200).json("failed");//密码修改失败
      }else{
        console.log("密码修改成功");
        res.status(200).json("success");//密码修改成功
      }
    })
  })
}