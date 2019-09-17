module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// frontend routes =========================================================
	// route to handle all angular requests

	// 过滤，只有跟设定路径一致时才能
	app.route('/api/*').all(function(req,res,next) {
		//console.log('过滤判断');
		//console.log(req.session.has("userName"));
        console.log(req.session.userId + " is Accessing");

        if (req.session.userId == null || req.session.password == null) {
            console.log('非法访问');
            //res.clearCookie('session');
            res.redirect('/#/login');
        }
        else {
            select_user_id = req.session.userId;
            select_user_password = req.session.password;

            var querystring = 'SELECT * FROM userTable WHERE userId=' + '\'' + select_user_id + '\' and password =' + '\'' + select_user_password + '\'';
            req.getConnection(function(err,conn) {
                if (err) {
                    console.log("Failed to connect");
                    res.status(500).json(err);
                }
                conn.query(querystring, function (err, rows) {
                    //conn.destroy();
                    if (err) {
                        req.session.userId == null;
                        req.session.password == null;
                        req.session.authority == null;
                        console.log('数据库连接异常');
                        res.clearCookie('session');
                    }
                    else {
                        if (rows.length == 1 && rows[0].authority == req.session.authority)
                            next();
                        else {
                            req.session.userId == null;
                            req.session.password == null;
                            req.session.authority == null;
                            cosole.log('用户名密码错误');
                            res.clearCookie('session');
                        }
                    }
                });
            //conn.release();
            });
        }
    });

	var Actual = require('./controllers/actual.server.controller.js');
	var User = require('./controllers/user.server.controller.js');
	var VNC = require('./controllers/vnc.server.controller.js');
	var Contents = require('./controllers/contents.server.controller.js');
	var Course = require('./controllers/course.server.controller.js');
	var Module = require('./controllers/module.server.controller.js');
	var Record = require('./controllers/record.server.controller.js');
	var ContManage=require('./controllers/contManage.server.controller.js');
	var AddCourse=require('./controllers/addCourse.server.controller.js');
	var ExpReport=require('./controllers/expReport.server.controller.js');
	var commonCourses = require('./controllers/commonCourses.server.controller.js');
	var studentList = require('./controllers/studentList.server.controller.js');
	var classManage = require('./controllers/classManage.server.controller.js');
	var addClass = require('./controllers/addClass.server.controller.js');
	var homePage = require('./controllers/homePage.server.controller.js');
	var teacherDetails = require('./controllers/teacherDetails.server.controller.js');
	//实时走图页面数据接口
	app.route('/api/getImage').get(Actual.getImage);//获取图片
	
	// 用户页面数据接口
	app.route('/getUser').post(User.getUser);//用户登录，用户信息保存至Session
	app.route('/addUser').post(User.addUser);//插入用户信息
	app.route('/usrLogout').get(User.usrLogout);//用户登录退出，清空Session
	app.route('/deleteStd').post(User.deleteStd);//删除学生
	app.route('/getTeacherList').get(User.getTeacherList);//获取老师名单

	// 获取当前用户的信息
	app.route('/getUserInfo').post(User.getUserInfo);//获取用户信息
	app.route('/modifyPassword').post(User.modifyPassword);//修改密码
	// app.route('/getTeacher').get(User.getTeacher);//删除学生
	// app.route('/api/getUserName').get(User.getUserName);
	
	// 首页获取相关的课程、实验以及教师相关信息
	// app.route('/api/getCommonTeacherCou').post(homePage.getCommonTeacherCou);


	//实验内容发送接口
	app.route('/api/sendTitle').post(Contents.sendTitle);//发送一个章节标题返回，然后用于给其页面初始化

	//课程内容获取接口
	// app.route('/api/getContents').get(Contents.getContents);//实验步骤
	app.route('/api/getSteps').get(Contents.getSteps);//实验内容传递
    app.route('/api/updateContent').post(Contents.updExpContent);
    // notebook类型的实验修改
    app.route('/api/updateNBContent').post(Contents.updExpNBContent);
    app.route('/api/getupdCourse').post(Contents.getupdCourse);
    app.route('/api/getExpContent').post(Contents.getExpContent);
	
	//VNC获取接口
	app.route('/api/launchVNC').post(VNC.launchVNC);//启动VNC请求并返回url
	app.route('/api/shutdownVNC').post(VNC.shutdownVNC);//关闭vnc请求	
	app.route('/api/selectVNC').post(VNC.selectVNC);//查询vnc是否开启

	// 获取hadoop集群安装实验的实验内容
	app.route('/api/getHadoop').get(VNC.getHadoop);//获取hadoop集群安装的实验内容
	// 启动hadoop集群的虚拟机
	app.route('/api/launchHadoopVNC').post(VNC.launchHadoopVNC);//启动hadoop集群并返回url

	// 获取当前正在进行的实验
	app.route('/api/getcurrentExp').post(VNC.getcurrentExp);//获取当前正在进行的实验信息
	//notebook获取接口
	app.route('/api/launchNB').post(VNC.launchNB);//获取notebook URL
	app.route('/api/shutdownNB').post(VNC.shutdownNB);//关闭notebook

	//课程数据接口
	app.route('/api/getCourse').get(Course.getCourse);//获取课程信息
	app.route('/api/getTeacherCourse').post(Course.getTeacherCourse);//获取教师自己表中的课程信息
	app.route('/api/getTeacherCourses').post(Course.getTeacherCourses);//获取所有老师的课程信息
	app.route('/api/deleteCourse').post(Course.deleteCourse);//教师删除课程
	app.route('/api/updateCouHideShow').post(Course.updateCouHideShow);//教师设置当前课程隐藏：学生不可见
	app.route('/api/getCourseNumber').post(Course.getCourseNumber);//获取当前老师的所有课程的实验数目
	app.route('/api/getCoursesNumber').post(Course.getCoursesNumber);
	app.route('/api/getAllCourseNumber').post(Course.getAllCourseNumber);//学生身份获取当前所有课程的实验数目
	
	app.route('/api/updCourse').post(Course.updCourse);//教师对自己的课程内容进行修改：包括课程名称、课程简介、课程封面图

	//模块数据接口
	app.route('/api/getModule').post(Module.getModule);//获取选中课程的模块信息
	app.route('/api/updateTag').post(Module.updateTag);//对选中模块的tag标签进行更新
    app.route('/api/getUserName').get(Module.getUserName);//从数据库中获取当前用户名数据
    app.route('/api/sendModuleId').post(Module.sendModuleId);//从数据库中获取当前模块名称
    app.route('/api/getCourseName').post(Module.getCourseName);//从数据库中获取当前课程的课程名称相关大概信息
    app.route('/api/deleteExperience').post(Module.deleteExperience);//从数据库中删除选中id的实验内容

    app.route('/api/updateExpHideShow').post(Module.updateExpHideShow);//设置实验是否对学生可见

    app.route('/api/findCourseName').post(Module.findCourseName);


    //课程内容管理接口
	app.route('/api/createContent').post(ContManage.createContent);//创建新的课程内容
    app.route('/api/createNBContent').post(ContManage.createNBContent);//创建新的课程内容
	// 添加实验内容页面读取当前老师的所有课程
	app.route('/api/currentCourseNames').post(ContManage.currentCourseNames);
	app.route('/api/uploadExp').post(ContManage.uploadExp);

	//添加课程数据接口
	// app.route('/api/sendAddCourse').post(AddCourse.sendAddCourse);//添加新的课程
	app.route('/api/submitAddCourse').post(AddCourse.submitAddCourse);
	// app.route('/api/submitAddPicture').post(AddCourse.submitAddPicture);
	//学习记录详情数据接口
	app.route('/api/getRecord').get(Record.getRecord);//获取某用户的学习记录数据
	app.route('/api/getLearningRecordDetails').post(Record.getLearningRecordDetails);//获取当前模块的详细学习记录
    app.route('/api/getUserLearningRecordDetails').post(Record.getUserLearningRecordDetails);//获取当前模块的详细学习记录
	app.route('/api/getModuleInfo').post(Record.getModuleInfo);//获取模块的名称



	//学习记录数据接口
	app.route('/api/getRecord').post(Record.getRecord);//获取所有用户的学习记录数据
    app.route('/api/getUserRecord').post(Record.getUserRecord);//获取当前用户的学习记录
	app.route('/api/sendEndTime').post(Record.sendEndTime);//获取用户学习结束时间

	//实验报告接口
	app.route('/api/getcourseinfo').post(ExpReport.getcourseinfo);//获取实验报告对应课程信息
	app.route('/api/getexpinfo').post(ExpReport.getexpinfo);//获取实验报告对应实验信息
	// app.route('/api/getstuid').post(ExpReport.getstuid);//获取学生ID
	app.route('/api/addreport').post(ExpReport.addreport);//添加实验报告
	app.route('/api/getstudent').post(ExpReport.getstudent);//获取完成实验报告的所有学生
	app.route('/api/getreport').post(ExpReport.getreport);//获取实验报告内容
	app.route('/api/updreport').post(ExpReport.updreport);//更新实验报告
	app.route('/api/getAllReport').post(ExpReport.getAllReport);//获取该教师的所有实验报告
	app.route('/api/getSelfReport').post(ExpReport.getSelfReport);//获取该学生的所有实验报告

	// 公共课程接口
	app.route('/api/getCommonCourses').get(commonCourses.getCommonCourses);//老师从数据库中读取公共课程信息
	app.route('/api/loadNewCourse').post(commonCourses.loadNewCourse);//老师添加公共课程到自己新的课程
	app.route('/api/loadExistCourse').post(commonCourses.loadExistCourse);//老师添加公共课程到自己已有的课程中
	app.route('/api/loadCourse').post(commonCourses.loadCourse);//获取当前老师的所有现有课程
	app.route('/api/getCommonCourseNumber').post(commonCourses.getCommonCourseNumber);//返回每个课程下的所有实验内容

	// 班级管理接口
	app.route('/api/getClassNum').get(classManage.getClassNum);//获得班级数目
	app.route('/api/getClasses').get(classManage.getClasses);//获得班级名、班级总人数、创建时间
	app.route('/api/getStdNum').get(classManage.getStdNum);//获得已注册学生总人数
	app.route('/api/getClassStdNum').get(classManage.getClassStdNum);//获得班级当前人数
	app.route('/api/deleteClass').post(classManage.deleteClass);//从数据库中删除选中班级信息
	app.route('/api/getClassStd').post(classManage.getClassStd);//选择班级跳转到班级学生名单

	app.route('/api/addStudent').post(classManage.addStudent);//选择班级跳转到班级学生名单

	app.route('/api/addClass').post(classManage.submitAddClass);//新增班级信息到数据库

	app.route('/api/getTeacherNum').get(classManage.getTeacherNum);//获取老师人数
	
	app.route('/api/getTeacherCourseNum').get(homePage.getTeacherCourseNum);//获取老师课程数
	app.route('/api/getCommonCourseNum').get(homePage.getCommonCourseNum);//获取公共课
	app.route('/api/getStudentCourseNum').post(homePage.getStudentCourseNum);//获取当前学生所有的课程数
	app.route('/api/getReportTimeNum').post(homePage.getReportTimeNum);//获取当前学生的实验报告和学习时长
	app.route('/api/getTeacherOwnCourse').get(homePage.getTeacherOwnCourse);//获取当前老师自己的课程，以及可见的公共课程
	// 学生名单页面相关接口
	app.route('/api/getCourseList').post(studentList.getCourseList);//获取当前老师下的所有课程
	// app.route('/api/getClass').post(studentList.getClass);//获取班级信息
	// app.route('/api/getStudents').post(studentList.getStudents);//获取班级下的所有学生信息
	app.route('/api/deleteClassStudent').post(studentList.deleteClassStudent);//删除选中的学生或班级
	app.route('/api/getAllClass').get(studentList.getAllClass);//获取所有班级
	app.route('/api/addNewClass').post(studentList.addNewClass);//向当前的课程中添加选中的班级
	app.route('/api/getAllStudent').get(studentList.getAllStudent);//获取当前所有的学生信息
	app.route('/api/addNewStudent').post(studentList.addNewStudent);//向当前课程中添加选中的学生
	app.route('/api/getCouClaStu').post(studentList.getCouClaStu);//获取当前课程下的所有班级和学生信息
	app.route('/api/getCouClaStuName').post(studentList.getCouClaStuName);//根据课程下的班级和学生id信息找到对应的名称信息
	//老师相关信息接口
	app.route('/api/getTeacherInfo').post(teacherDetails.getTeacherInfo);
	app.route('/api/addTeacher').post(teacherDetails.submitAddTeacher);
	// 删除老师
	app.route('/api/deleteTeacher').post(teacherDetails.deleteTeacher);//删除某个老师
};
