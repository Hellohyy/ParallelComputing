exports.submitAddClass = function(req,res){
	console.log("班级添加！！！");
	console.log(req.body);
	// console.log(req.session.picName);
	var data = req.body;
	// 传递过来的参数课程名称
	var classNameData = req.body.newClassName;
	// 定义一个存储图片的路径的字符串
	var excelUrl = './public/assets/Excel/' + req.body.newClassExcel;

	// var imageUrl = 'assets/img/images/' + req.session.picName;
	var classNameTemp = '';
	var flag = 0;
	// console.log(data.newCourse.courseIntro);
	req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};

		var queryString = 'INSERT into classtable (classname,overall,) values (?,?)' ;
		console.log(queryString);
		conn.query(queryString,[data.newClass.className , data.newClass.overall ],function(err,rows){
			if(err){

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