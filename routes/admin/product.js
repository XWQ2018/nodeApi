var express=require('express');

var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/

var DB=require('../../module/db.js');  /*引入DB数据库*/
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

var multiparty = require('multiparty');  /*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
var  fs=require('fs');

//处理登录的业务逻辑
//查询分类
router.get('/getList',function(req,res){

    DB.find('list',{},function(err,data){

        res.send(data)
    })

})
//添加分类
router.get('/addList',function(req,res){

    let ID= req.query.ID;
    let name= req.query.name;
    console.log(ID,name)

    DB.insert('list',{
        ID,
        name
    },function(err,data){

        if(err){
            res.send('no')
        }else{
            res.send('yes')
        }
    })

})
//添加商品信息
router.post('/addGoodsList',function(req,res){

    let goodsList= req.body.goodsListInfo;
 
    // console.log(goodsList)

    DB.insert('product',goodsList,function(err,data){

        if(err){
            res.send('no')
        }else{
            res.send('yes')
        }
    })

})


//获取表单数据提交的数据，以及post传过来的图片
router.post('/doProductAdd',function(req,res){

    var form = new multiparty.Form();

    form.uploadDir = 'upload'; //图片保存地址   目录需提前存在

    form.parse(req,function(err,fields,files){

        var title = fields.title[0];
        var price = fields.price[0];
        var fee = fields.fee[0];
        var description = fields.description[0];
        var pic = files.pic[0].path;

        DB.insert('product',{
            title,
            price,
            fee,
            pic,
            description,

        },function(err,data){

            if(err){

                console.log(err)
                     
            }

            res.redirect('/admin/product'); //上传成功跳转product首页
        })
             
    })

});

//获取商品列表信息
router.get('/getGoodsList',function(req,res){

    DB.find('product',{},function(err,data){

            if(err){
                console.log(err)
                res.send(err)      
            }else{
                res.send(data)
            }
            
        })  
});

//根据分类获取商品列表信息
router.get('/byList',function(req,res){

    let list = req.query.list;
    console.log(list)
    DB.find('product',{list},function(err,data){

            if(err){
                console.log(err)
                res.send(err)      
            }else{
                res.send(data)
            }
            
        })  
});

//根据关键字获取商品信息列表
router.get('/byNameGetGoodsList',function(req,res){

    let name = req.query.name;
    let regword = new RegExp(name);
    console.log(regword)
    DB.find('product',{$or:[
                {ID:regword},
                {list:regword},
                {name:regword},
                {nowPrice:regword}
            ]},function(err,data){

            if(err){
                console.log(err)
                res.send(err)      
            }else{
                res.send(data)
            }
            
        })  
});

router.post('/doProductEdit',function(req,res){

    // var form = new multiparty.Form();

    // form.uploadDir = 'upload'; //图片保存地址   目录需提前存在

    // form.parse(req,function(err,fields,files){

    //     var id = fields._id[0].replace(/"/g,"");
    //     // console.log(fields)
             
    //     var title = fields.title[0];
    //     var price = fields.price[0];
    //     var fee = fields.fee[0];
    //     var description = fields.description[0];
    //     var pic = files.pic[0].path;

    //     var originalFilename = files.pic[0].originalFilename;
    //     var pic_path = files.pic[0].path;

    //     if(originalFilename){

    //         var setData = {
    //             title,
    //             price,
    //             fee,
    //             description,
    //             pic,
    //         }

    //     }else{   //无修改图片

    //         var setData = {
    //             title,
    //             price,
    //             fee,
    //             description,
    //         };

    //         fs.unlink(pic) //删除生成的临时文件

    //     }

    //     DB.update('product',{'_id':new DB.ObjectID(id)},setData,function(err,data){

    //         if(err){
    //             console.log(err)
    //         }

    //         res.redirect('/admin/product');
    //     })
             
    // })
});

//编辑商品分类
router.get('/editList',function(req,res){

        let id = req.query.id;
        let ID = req.query.ID;
        let name = req.query.name;
        var listInfo = {};
            listInfo.ID=ID;
            listInfo.name=name;
            // console.log(listInfo)

        DB.update('list',{'_id':new DB.ObjectID(id)},listInfo,function(err,data){

            if(err){
                console.log(err)
                res.send('no')
            }else{
                res.send('yes')
            }
        })
});

//编辑商品列表
router.post('/editGoodsList',function(req,res){

        let id = req.body.id;
        let goodsListInfo = req.body.goodsListInfo;

        DB.update('product',{'_id':new DB.ObjectID(id)},goodsListInfo,function(err,data){

            if(err){
                console.log(err)
                res.send('no')
            }else{
                res.send('yes')
            }
        })
});

//删除商品分类
router.get('/delProductList',function(req,res){

    var id  = req.query.ID;
    console.log(id)

    DB.delete('list',{"_id":new DB.ObjectID(id)},function(err,data){

        if(err){
            console.log(err)
            res.send('no')
        }else{
            res.send('yes')
        }

    })

});

//删除单个商品列表
router.get('/delGoodsList',function(req,res){

    var id  = req.query.ID;
    console.log(id)

    DB.delete('product',{"_id":new DB.ObjectID(id)},function(err,data){

        if(err){
            console.log(err)
            res.send('no')
        }else{
            res.send('yes')
        }

    })

});

//多个商品列表删除
router.post('/removeProductList',function(req,res){

    var id = req.body.ID;
    console.log(id)

    id.map(item=>{

        DB.delete('product',{"_id":new DB.ObjectID(item)},function(err,data){
          
            if(err){
                
                console.log(err)      
            }
             
        }) 
    })
    res.send('yes'); 

});

module.exports = router;   /*暴露这个 router模块*/