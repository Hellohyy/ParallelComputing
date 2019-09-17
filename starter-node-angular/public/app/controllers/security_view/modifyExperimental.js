
'use strict';

app.controller('modifyExperimentalCtrl', function($rootScope, $scope, $http,$state) {
    
	console.log("modifyExperimentalCtrl");
    // $scope.experience = {
    //     "expId":"",//实验id
    //     "expName":"",//实验名称
    //     "expObjective":"",//实验目的
    //     "expEnvironment":"",//实验环境
    //     "expPrinciple":"",//实验原理
    //     "expProcedures":"",//实验步骤
    //     "expLabel":""//实验标签
    // }    
    $scope.experiences = [
    {
        "expId":"0",//实验id
        "expName":"实验一",//实验名称
        "expObjective":"目的一",//实验目的
        "expEnvironment":"环境一",//实验环境
        "expPrinciple":"原理一",//实验原理
        "expProcedures":"步骤一",//实验步骤
        "expLabel":"标签一"//实验标签
    },{
        "expId":"1",//实验id
        "expName":"实验二",//实验名称
        "expObjective":"目的二",//实验目的
        "expEnvironment":"环境二",//实验环境
        "expPrinciple":"原理二",//实验原理
        "expProcedures":"步骤二",//实验步骤
        "expLabel":"标签二"//实验标签
    }];
    // 从数据库中读取当前老师的所有实验内容，让老师选择某个实验进行内容的修改
    // $http({
    //     url:'/api/modifyExperimence',
    //     method:'POST',
    //     data:{teacherName:$scope.storage.name}
    // }).success(function(response){
    //     console.log(response);
    //     console.log("获取当前老师的实验成功");
    //     $scope.experiences = [];
    // })


});