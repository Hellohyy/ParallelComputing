var app =
    angular.module('app')
        .config(
        [
            '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
            function($controllerProvider, $compileProvider, $filterProvider, $provide) {
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                app.constant = $provide.constant;
                app.value = $provide.value;
            }
        ]);


app.config(function($breadcrumbProvider) {
    $breadcrumbProvider.setOptions({
        template: '<ul class="breadcrumb"><li><i class="fa fa-home"></i><a href="#">Home</a></li><li ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li></ul>'
    });
});

app.directive('fileModel',function($parse){
    return {
        restrict:'A',
        link:function(scope,element,attrs){
            // console.log(attrs);
            // console.log(element);
            var model = $parse(attrs.fileModel);
            // console.log(model);
            var modelSetter = model.assign;
            // console.log(modelSetter);
            element.bind('change',function(event){
                scope.$apply(function(){
                    modelSetter(scope,element[0].files[0]);
                });
                scope.getFile();

            });
        }
    };
});
// fileReader通过一部方式读取文件内容，结果通过事件回调获取
app.service('fileReader', function ($q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    // 当读取操作成功完成时调用
    var onLoad=function (reader,deferred,scope) {
      return function () {
        scope.$apply(function () {
          deferred.resolve(reader.result);
          // console.log(reader);
        });
      };
    };
    // 当读取操作发生错误时调用
    var onError=function (reader,deferred,scope) {
      return function () {
        scope.$apply(function () {
          deferred.reject(reader.result);
        });
      };
    };

    var getReader=function (deferred,scope) {
      var reader=new FileReader();
      reader.onload=onLoad(reader,deferred,scope);
      reader.onerror=onError(reader,deferred,scope);
      // console.log(reader);
      return reader;
    }

    var readAsDataURL=function (file,scope) {/*上传图片的主函数*/
      var deferred=$q.defer();
      // console.log(deferred);
      // console.log(scope);
      var reader=getReader(deferred,scope);
      // console.log(file);
      reader.readAsDataURL(file);
      return deferred.promise;
    };

    return{
      readAsDataUrl:readAsDataURL
    };
  });
/*
angular.module('scHelper').filter('paging',function(){
    return function(items, index, pageSize){
        if(!items) return  [];
        var offset = (index -1) * pageSize;
        return items.slice(offset,offset+pageSize);
    }
});

angular.module('scHelper').filter('size',function(){
    return function(items){
        if(!item) return 0;

        return items.length || 0;
    }
});*/