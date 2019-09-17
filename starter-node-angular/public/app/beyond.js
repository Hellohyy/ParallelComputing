'use strict';

angular.module('app')
    .controller('AppCtrl', [
        //'$scope', '$rootScope', '$localStorage', '$state', '$timeout','$http',
        '$scope', '$rootScope', '$sessionStorage', '$state', '$timeout','$http',
        function ($scope, $rootScope, $sessionStorage, $state, $timeout,$http) {
        //function ($scope, $rootScope, $localStorage, $state, $timeout,$http)
            // 用户初始登录状态：false
            $scope.user_logout = true;
            // 监听登录状态
            $scope.$on("logoutFromChildCtrl",
                function (event, info) {
                    $scope.user_logout =  info;
                    console.log($scope.user_logout);
            });

            // 登录用户用户名
            $scope.user_login_name = "";

            // 存储登录的用户信息
            //$scope.storage = window.localStorage;
            $scope.storage = window.sessionStorage
            /*$scope.$watch($scope.storage, function(newValue, oldValue){
                if(newValue == oldValue){
                    console.log("相等！");
                }else{
                    console.log("不相等！");
                }
            }, true);*/

            // 用户登录账户
            $scope.$on("userNameCtrl",
                function (event, data) {
                    $scope.user_login_name =  data.name;
                    console.log($scope.user_login_name);
            });

            // 修改密码函数
            $scope.modifyPassword = function(){
                console.log("修改密码");
                $state.go('app.userSetting');
            }

            // 用户登出跳转页面
            $scope.logout = function(){
                //清空所有的缓存数据
                $scope.storage.clear();
                $http({
                method: 'get',
                url: '/usrLogout',
                }).success(function(){
                    console.log("退出登录成功");
                }).error(function(err){
                    console.log("退出登录失败"+err);
                });
                window.location.href = "/#/login"
                console.log(window.location.href)
                //window.location.href = "http://1.119.44.205:3000/#/login"
            };

            //获取用户点击的课程ID号,定义一个全局变量来保存id号
            // $rootScope.chosingCourseId = "";
            // $rootScope.$on("courseIdInfo",function(event,data){
            //     $rootScope.chosingCourseId = data;
            //     console.log($rootScope.chosingCourseId);
            // });
            // $scope.$emit("testNameCtrl", $scope.user_login_name);
            // 获取用户点击的模块ID号，定义一个全局变量保存id号
            // $rootScope.chosingModuleId = "";
            // $rootScope.$on("moduleIdInfo",function(event,data){
            //     $rootScope.chosingModuleId = data;
            //     console.log($rootScope.chosingModuleId);
            // });

            //获取用户点击的学习记录的id号，定义一个全局变量保存id号
            // $rootScope.chosingRecordId ="";
            // $rootScope.$on("recordIdInfo",function(event,data){
            //     $rootScope.chosingRecordId = data;
            //     console.log($rootScope.chosingRecordId);
            // });


            // $scope.sendCourseImgName = "",
            // // 这里是接听到老师添加的课程图片的名称，之后将名称作为参数的一部分存入数据库
            // $scope.$on("sendCourseImgName",function(event,data){
            //     $scope.sendCourseImgName = data;
            //     console.log(data);
            //     console.log($scope.sendCourseImgName);
            // })
            // 获取当前的正在进行的实验名称
            console.log("实验名称");
            // console.log($scope.storage.expNameInfo);
            // // 存储当前正在进行的实验名称，方便悬浮窗口显示
            // $rootScope.expName = $scope.storage.expNameInfo;
            // $scope.hideWindow = function(){
            //     $('#floatWindow').style = "display:none";
            // }
            // console.log("当前到的实验！！！");
            // $rootScope.winFlag = $scope.storage.windowFlag;
            // console.log($rootScope.winFlag);
            $scope.$on("expNameInfo",function(event,data){
                console.log("传递过来实验的名称");
                console.log(data);
                // // 存储当前正在进行的实验名称，方便悬浮窗口显示
                $rootScope.expName = data;               
            });
            // 当用户点击悬浮窗中的关闭虚拟机按钮时，将虚拟机的flag标签设置为1，flag默认为0；
            $rootScope.closeVNCFlag = 0;
            $scope.closeVNC = function(){
                console.log("点击关闭VNC快捷键");
                if(confirm("确定关闭虚拟机？")){
                    console.log("确定关闭");
                    $rootScope.closeVNCFlag = 1;
                    $('#floatWindow').hide();
                };
                
            }
            
            // 获取到新添加的课程图片名称
            $scope.newCoursePicture = "";
            $scope.$on("newCoursePicture",function(event,data){
                $scope.newCoursePicture = data;
                console.log(data);
                console.log($scope.newCoursePicture);
            });
            // 获取到新添加的课程名称
            $scope.newCourseName = "";
            $scope.$on("newCourseName",function(event,data){
                $scope.newCourseName = data;
                console.log(data);
                console.log($scope.newCourseName);
            });

            $rootScope.settings = {
                skin: '',
                color: {
                    themeprimary: '#2dc3e8',
                    themesecondary: '#fb6e52',
                    themethirdcolor: '#ffce55',
                    themefourthcolor: '#a0d468',
                    themefifthcolor: '#e75b8d'
                },
                rtl: false,
                fixed: {
                    navbar: false,
                    sidebar: false,
                    breadcrumbs: false,
                    header: false
                }
            };
            /*if (angular.isDefined($localStorage.settings))
               $rootScope.settings = $localStorage.settings;
            else
                $localStorage.settings = $rootScope.settings;*/
            if (angular.isDefined($sessionStorage.settings))
                $rootScope.settings = $sessionStorage.settings;
            else
                $sessionStorage.settings = $rootScope.settings;

            $rootScope.$watch('settings', function () {
                if ($rootScope.settings.fixed.header) {
                    $rootScope.settings.fixed.navbar = true;
                    $rootScope.settings.fixed.sidebar = true;
                    $rootScope.settings.fixed.breadcrumbs = true;
                }
                if ($rootScope.settings.fixed.breadcrumbs) {
                    $rootScope.settings.fixed.navbar = true;
                    $rootScope.settings.fixed.sidebar = true;
                }
                if ($rootScope.settings.fixed.sidebar) {
                    $rootScope.settings.fixed.navbar = true;


                    //Slim Scrolling for Sidebar Menu in fix state
                    var position = $rootScope.settings.rtl ? 'right' : 'left';
                    if (!$('.page-sidebar').hasClass('menu-compact')) {
                        $('.sidebar-menu').slimscroll({
                            position: position,
                            size: '3px',
                            color: $rootScope.settings.color.themeprimary,
                            height: $(window).height() - 90,
                        });
                    }
                } else {
                    if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
                        $(".sidebar-menu").slimScroll({ destroy: true });
                        $(".sidebar-menu").attr('style', '');
                    }
                }
                $sessionStorage.settings = $rootScope.settings;
                //$localStorage.settings = $rootScope.settings;
            }, true);

            $rootScope.$watch('settings.rtl', function () {
                if ($state.current.name != "persian.dashboard" && $state.current.name != "arabic.dashboard") {
                    switchClasses("pull-right", "pull-left");
                    switchClasses("databox-right", "databox-left");
                    switchClasses("item-right", "item-left");
                }
                $sessionStorage.settings = $rootScope.settings;
                //$localStorage.settings = $rootScope.settings;
            }, true);

            $rootScope.$on('$viewContentLoaded',
                function (event, toState, toParams, fromState, fromParams) {
                    if ($rootScope.settings.rtl && $state.current.name != "persian.dashboard" && $state.current.name != "arabic.dashboard") {
                        switchClasses("pull-right", "pull-left");
                        switchClasses("databox-right", "databox-left");
                        switchClasses("item-right", "item-left");
                    }
                    if ($state.current.name == 'error404') {
                        $('body').addClass('body-404');
                    }
                    if ($state.current.name == 'error500') {
                        $('body').addClass('body-500');
                    }
                    $timeout(function () {
                        if ($rootScope.settings.fixed.sidebar) {
                            //Slim Scrolling for Sidebar Menu in fix state
                            var position = $rootScope.settings.rtl ? 'right' : 'left';
                            if (!$('.page-sidebar').hasClass('menu-compact')) {
                                $('.sidebar-menu').slimscroll({
                                    position: position,
                                    size: '3px',
                                    color: $rootScope.settings.color.themeprimary,
                                    height: $(window).height() - 90,
                                });
                            }
                        } else {
                            if ($(".sidebar-menu").closest("div").hasClass("slimScrollDiv")) {
                                $(".sidebar-menu").slimScroll({ destroy: true });
                                $(".sidebar-menu").attr('style', '');
                            }
                        }
                    }, 500);

                    window.scrollTo(0, 0);
                });
        }
    ]);