'use strict';

app.controller('experimentalTrainingCtrl', [
        '$rootScope', '$scope', function($rootScope, $scope) {

            console.log("experimentalTraining");
        }
    ]);



// var myEditorImage;  
// 			var d;  
// 			function upImage() {      
// 			    d = myEditorImage.getDialog("insertimage");  
// 			    d.render();  
// 			    d.open();  
// 			}  
			  
// 			myEditorImage= new UE.ui.Editor();  
// 			myEditorImage.render('myEditorImage');  
// 			myEditorImage.ready(function(){  
// 			    myEditorImage.setDisabled();  
// 			    myEditorImage.hide();//隐藏UE框体  
// 			    myEditorImage.addListener('beforeInsertImage',function(t, arg){  
// 			        alert(arg[0].src);//arg就是上传图片的返回值，是个数组，如果上传多张图片，请遍历该值。  
// 			        //把图片地址赋值给页面input，我这里使用了jquery，可以根据自己的写法赋值，到这里就很简单了，会js的都会写了。  
// 			        $("#abccc").attr("value", arg[0].src);  
// 			    });  
// 			}); 


