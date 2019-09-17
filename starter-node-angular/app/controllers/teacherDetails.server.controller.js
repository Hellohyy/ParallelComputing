exports.getTeacherInfo = function(req,res){
  console.log(req.body);
  var teacherName=req.body.teacherName;
  req.getConnection(function(err,conn){
    if(err){
      console.log("Failed to connect");
      res.status(500).json(err);
    };
    // 从数据库中读取所有班级数据
    var querystring = 'SELECT * FROM userTable WHERE userId="'+teacherName+'" ORDER BY userId;';
    conn.query(querystring,function(err,rows){
      //conn.destroy();
        if(err){
        console.log(err);
        res.status(200).json({"teacherInfo":""});//数据库中无数据
      }else{
        console.log(rows);
        res.status(200).json({"teacherInfo":rows});//数据库中有数据
        console.log("教师信息查询成功");
      }
    });
  })
};
// exports.getChosingTeacherCourses = function(req,res){
//   console.log(req.body);
//   var teacherName=req.body.teachername;
//   console.log(teacherId);
//   req.getConnection(function(err,conn){
//     if(err){
//       console.log("Failed to connect");
//       res.status(500).json(err);
//     };
//     // 从数据库中读取所有班级数据
//     //var querystring = 'SELECT * FROM userTable WHERE userId='+teacherId+'';
//     conn.query('SELECT * FROM courseTable WHERE teacherName ="'+ teacherName +'" ORDER BY courseId;',function(err,rows){
//       //conn.destroy();
//         if(err){
//         console.log(err);
//         res.status(200).json({"chosingteacherCourses":""});//数据库中无数据
//       }else{
//         console.log(rows);
//         res.status(200).json({"chosingteacherCourses":rows});//数据库中有数据
//         console.log("教师信息查询成功");
//       }
//     });
//   })
// };





//获取当前用户名
// exports.getUserName = function(req,res){
// 	var name = req.session.userName;
// 	// console.log("这是username");
// 	console.log(name);
// 	res.json({"userName":name});

// };


//添加老师数据到数据库
exports.submitAddTeacher = function(req,res){
  console.log("添加老师！！！");
  console.log(req.body);
  console.log(req.body.newTeacher.teacherId);
  var data = req.body;
  // 传递过来的参数课程名称
  //var teacherNameData = req.body.newCourseName;
  // 定义一个存储图片的路径的字符串
  // var imageUrl = 'assets/img/teachers/' + req.body.newTeacherPicture;

  // var imageUrl = 'assets/img/images/' + req.session.picName;
  var teacherNameTemp = '';
  var flag = 0;
  // console.log(data.newCourse.courseIntro);
  req.getConnection(function(err,conn){
    if(err){
      console.log("Failed to connect");
      res.status(500).json(err);
    };

    //var queryString = "INSERT into userTable (userId,userName,titles,password,headPortrait,authority,gender,major,Pre,apartment) values (?,?,?,123456,?,1,?,?,?,?)";
    var queryString = "INSERT into userTable (userId,userName,titles,password,authority,gender,major,Pre,apartment,headPortrait) values (?,?,?,123456,1,?,?,?,?,?)";
    console.log(queryString);
    //conn.query(queryString,[data.newTeacher.teacherId,data.newTeacher.teacherName,data.newTeacher.teacherTitle,imageUrl,data.newTeacher.teacherGen,data.newTeacher.teacherMajor,data.newTeacher.teacherPre,data.newTeacher.teacherApartment],function(err,rows){
    conn.query(queryString,[data.newTeacher.teacherId,data.newTeacher.teacherName,data.newTeacher.teacherTitle,data.newTeacher.teacherGen,data.newTeacher.teacherMajor,data.newTeacher.teacherPre,data.newTeacher.teacherApartment,data.newTeacher.teacherPicture],function(err,rows){
      if(err){
        if(err.errno == 1062)
          res.status(200).json("已存在该教师")
          console.log("教师添加失败");

      }else {
                console.log("教师添加成功");
                res.status(200).json("success");
            }
    });
});
}

// 删除老师
exports.deleteTeacher = function(req,res){
  console.log("删除老师："+req.body.teacherId);
  req.getConnection(function(err,conn){
    if(err){
      console.log(err);
      res.status(500).json(err);
    };
    var queryString = "delete from userTable where userId = '"+ req.body.teacherId + "';"
    console.log(queryString);
    conn.query(queryString,function(err,rows){
      if(err){
        console.log(err);
        res.status(200).json("failed");//删除失败
      }else{
        console.log("删除成功");
        res.status(200).json("success");//删除成功
      }
    })
  })
}

