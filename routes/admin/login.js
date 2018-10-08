var express=require('express');

var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/
var md5=require('md5-node'); /*md5加密*/
var DB=require('../../module/db.js');  /*引入DB数据库*/
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

router.get('/',function(req,res){

    res.render('admin/login');

})

//处理登录的业务逻辑
//登入成功
router.post('/doLogin',function(req,res){

    //获取post提交的数据
    console.log(req.body)
    var username = req.body.username;
    var password = md5(req.body.password);

        DB.find('user',{

            username:username,
            password:password,

        },function(err,data){

            if(data.length>0){

                req.session.userinfo= data[0];
 
                res.send('yes')
            
            }else{

                res.send("no");
            }
        })   
});

//退出登入
router.get('/loginOut',function(req,res){
    //销毁session
    req.session.destroy(function(err){

        if(err){
            res.send(err)
        }else{
            res.send('yes')
        }
    })
    
});


module.exports = router;   /*暴露这个 router模块*/