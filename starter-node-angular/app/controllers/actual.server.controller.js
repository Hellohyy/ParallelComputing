// const path=require('path');
// 获取图片
exports.getImage = function(req,res){
	// var aaaa = path.relative('F:\\project\\安检机容器\\代码\\SecurityCheck\\starter-node-angular\\public\\assets\\img\\IMG_0079.JPG', 'F:\\biyeji\\IMG_0079.JPG');
	// console.log(aaaa);
    req.getConnection(function(err,conn){
		if(err){
			console.log("Failed to connect");
			res.status(500).json(err);
		};
   		
   		var now = new Date();  
          
        var year = now.getFullYear();       //年  
        var month = now.getMonth() + 1;     //月  
        var day = now.getDate();            //日  
        if (month < 10) {
		    month = "0" + month;
		}
		if (day < 10) {
		    day = "0" + day;
		}
   		var mytime = year.toString() + month.toString() + day.toString();
   		// console.log(mytime);
   		var sql = "SELECT * FROM " + mytime;
   		// console.log(sql);
		conn.query("SELECT * FROM image_actual",function(err,rows){
			//conn.destroy();
		    if(err){
				console.log(err);
			}else{

				res.status(200).json({"image":rows});
			}
		});
	//conn.release();
    })

};



// // 编辑菜单
// exports.editMenu = function(req,res,next){
// 	// 有更新图片
// 	//console.log(req.files);
// 	if(JSON.stringify(req.files)=="{}"){
// 		// return res.status(400).send('No files were uploaded');
// 		req.getConnection(function(err,conn){
// 			if(err){
// 				console.log("Failed to connect");
// 				// return next("cannot connected!")
// 			}
// 			console.log(req.body);
// 			var id = req.body.id;
// 			var data = {
// 				name:req.body.name,
// 				price : req.body.price,
// 				price_medium : req.body.price_medium,
// 				price_large : req.body.price_large,
// 				detail : req.body.food_detail,
// 				type: req.body.type,
// 			};
// 			var sql = "UPDATE menu_list SET ? WHERE id=?"
// 			var query = conn.query(sql,[data,id],function(err,rows){
// 				if(err){
// 					console.log("Error Updating: %s",err);
// 				}
// 			})
// 			// console.log("test");
// 		//	res.status(200).send("menu updated!");

// 		});
// 		res.status(200).redirect('/#/app/shopMenu');
// 	}else{
// 		//获取上传图片
// 		let editMenuImage = req.files.editMenuImage;
// 		console.log(editMenuImage);
// 		var imgPath = "/home/ordersystem/Image/menu"+editMenuImage.name;
// 		editMenuImage.mv(imgPath,function(err){
// 		// var imgPath = "F:\\project\\餐馆点餐\\代码\\版本-mysql\\ordersystem\\upload\\"+editMenuImage.name;
// 		// editMenuImage.mv("F:\\project\\餐馆点餐\\代码\\版本-mysql\\ordersystem\\upload\\"+editMenuImage.name,function(err){
// 			if(err){
// 				return  next("cannot upload!")
// 			}
// 			console.log("File uploaded!")
// 		});
// 		req.getConnection(function(err,conn){
// 			if(err){
// 				//console.log("Failed to connect");
// 				return next("cannot connected!")
// 			}
// 			console.log(req.body);

// 			var data = {
// 				name:req.body.name,
// 				price : req.body.price,
// 				price_medium : req.body.price_medium,
// 				price_large : req.body.price_large,
// 				detail : req.body.food_detail,
// 				type: req.body.type,
// 				img:imgPath
// 			};
// 			var id = req.body.id;
// 			var sql = "UPDATE menu_list SET ? WHERE id=?"
// 			var query = conn.query(sql,[data,id],function(err,rows){
// 				if(err){
// 					console.log("Error Updating: %s",err);
// 				}
// 			})
// 			// console.log("test");
// 			//res.status(200).send("menu updated!");

// 		});
// 		res.redirect('/#/app/shopMenu');
// 	}
// 	// var goods_id = req.params.goods_id;
// 	// //var imgPath = "";
// 	// // if(object.keys(req.files).length==0){
// 	// // 	console.log("No files!!");
//  //  //   return res.status(400).send('No files were uploaded.');
// 	// // }else{
// 	// // 	let menuImg = req.files.menuImg;
	
// 	// // }
// 	// var data = {
// 	// 	name : req.body.name,
// 	// 	price : req.body.price,
// 	// 	price_medium : req.body.price_medium,
// 	// 	price_large : req.body.price_large,
// 	// 	detail : req.body.detail,
// 	// 	type : req.body.type,
// 	// 	img : req.body.img
// 	// };
// 	// req.getConnection(function(err,conn){
//  //    if(err) return res.status(500).json(err);
// 	// 	var sql = "UPDATE menu_list SET ? WHERE id=?"
// 	// 	var query = conn.query(sql,[data,goods_id],function(err,rows){
// 	// 		if(err){
// 	// 			console.log("Error Updating: %s",err);
// 	// 		}
// 	// 	})
// 	// 	// console.log("test");
// 	// 	res.status(200).send("menu updated!");
// 	// })
// }

// // 删除菜单
// exports.deleteItem = function(req,res,next){
// 	var goods_id = req.params.goods_id;
// 	req.getConnection(function(err,conn){
// 		if(err) return next("Cannot Connect");

// 		var query = conn.query("DELETE FROM menu_list WHERE id = ?",[goods_id],function(err,rows){
// 			if(err){
// 				console.log(err);
// 				return next("Mysql error, check your query")
// 			}

// 			res.status(200);
// 		})
// 	})
// }

// // 增加菜单
// exports.addDishes = function(req,res){
// 	if(!req.files){
// 		return res.status(400).send('No files were uploaded');
// 	}
// 	//获取上传图片
// 	let addMenuImage = req.files.addMenuImage;
// 	console.log(addMenuImage);
// 	var imgPath = "/home/ordersystem/Image/menu"+addMenuImage.name;
// 	addMenuImage.mv(imgPath,function(err){
// 	// var imgPath = "F:\\project\\餐馆点餐\\代码\\版本-mysql\\ordersystem\\upload\\"+addMenuImage.name;
// 	// addMenuImage.mv("F:\\project\\餐馆点餐\\代码\\版本-mysql\\ordersystem\\upload\\"+addMenuImage.name,function(err){
// 		if(err){
// 			return res.status(500).send(err);
// 		}
// 		console.log("File uploaded!")
// 	});
// 	req.getConnection(function(err,conn){
// 		if(err){
// 			//console.log("Failed to connect");
// 			res.status(500).json(err);
// 		}
// 		console.log(req.body);

// 		var post = {
// 			name:req.body.name,
// 			price : req.body.price,
// 			price_medium : req.body.price_medium,
// 			price_large : req.body.price_large,
// 			detail : req.body.food_detail,
// 			type: req.body.type,
// 			img:imgPath
// 		};
// 	    var sql = 'INSERT INTO menu_list SET ?' ;
// 		var query = conn.query(sql,post,function(err,res){
// 			if(err){
// 				console.log(err);
// 			}else{
// 			  console.log("1 record inserted");
// 			}
// 		})

// 	});
// 	res.redirect('/#/app/shopMenu');
// }

// // 增加菜单类型
// exports.addType = function(req,res){
// 	req.getConnection(function(err,conn){
// 		if(err) console.log("connect failed");
// 		var post = {
// 			name : req.body.name,
// 			type : req.body.type
// 		}
// 		var query = conn.query("INSERT INTO type_list SET ?",post,function(err,rows){
// 			if(err){
// 				console.log("INSERT failed!")
// 				res.status(500).json(err);
// 			}else{
// 				console.log("new type inserted");
// 			}
// 		})
// 	});
// 	res.redirect('/#/app/shopMenu');
// }
// exports.getType = function(req,res){
// 	req.getConnection(function(err,conn){
// 		if(err) console.log("connect failed")
// 		var query = conn.query("SELECT * FROM type_list",function(err,rows){
// 			 if(err){
// 					console.log("cannot get the data from mysql")
// 					res.status(500).json(err);
// 			 }else{
// 				 res.status(200).json(rows);
// 			 }
// 		})
// 	})
// }

// // 删除菜单类型
// exports.deleteType = function(req,res,next){
// 	var type_id = req.params.type_id;
// 	req.getConnection(function(err,conn){
// 		if(err) return next("Cannot Connect");

// 		var query = conn.query("DELETE FROM type_list WHERE id = ?",[type_id],function(err,rows){
// 		if(err){
// 			console.log(err);
// 			return next("Mysql error, check your query")
// 		}

// 		res.status(200);
// 	 })
// 	})
// }




