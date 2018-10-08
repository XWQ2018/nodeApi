
var express=require('express');
var router = express.Router();   /*可使用 express.Router 类创建模块化、可挂载的路由句柄*/
var md5=require('md5-node'); /*md5加密*/
var bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
router.use(bodyParser.json());

var DB=require('../../module/db.js');  /*引入DB数据库*/

/*=========以上是用到的模块===========*/ 

router.post('/getuser',function(req,res){
    //res.send('显示用户首页');
    DB.find('user',{},function(err,data){

        res.send(data)

    })

});

//资料修改，按登入的用户名查询信息
router.post('/getUserInfo',function(req,res){

    var username = req.body.username;
    // console.log(username)

    DB.find('user',{username},function(err,data){

        res.send(data)

    })

});

//按条件查询用户
router.post('/checkResult',function(req,res){

    var username = req.body.username;
    var userTel = req.body.userTel;
    var email = req.body.email;
    var juse = req.body.juse;
    let obj={};
    if(username!=''){
        obj.username=username
    }
    if(userTel!=''){
        obj.userTel=userTel
    }
    if(email!=''){
        obj.email=email
    }
    if(juse!=''){
        obj.juse=juse
    }
    console.log(obj)

    DB.find('user',obj,function(err,data){

        res.send(data)

    })

});
//处理增加用户的业务逻辑
router.get('/userAdd',function(req,res){

    res.render('./admin/user/userAdd')

});

router.post('/doUserAdd',function(req,res){

    var username = req.body.username;
    var password = md5(req.body.password);
    var userTel = req.body.userTel;
    var email = req.body.email;
    var juse = req.body.juse;
    var dateTime = req.body.dateTime;
    var gender = req.body.gender;
    var nickname = req.body.nickname;
    var imgurl = req.body.imgurl;
    var desc = req.body.desc;

    DB.insert('user',{
        username,
        password,
        userTel,
        email,
        juse,
        dateTime,
        gender,
        nickname,
        imgurl,
        desc
    },function(err,data){

        if(err){
            console.log(err)
        }

        res.send("yes");
    })
});

//用户修改
// router.get('/userEdit',function(req,res){

//     var id = req.query.id.replace(/"/g,"");  //得到get传值

//     DB.find('user',{"_id":new DB.ObjectID(id)},function(err,data){
        
//             console.log(data[0])
                 
//             if(err){
//                 console.log(err)      
//             }

//             res.render('./admin/user/userEdit',{

//                 list:data[0],
//             })
            
//         }) 
// });

//通过ID修改用户信息
router.post('/doUserEdit',function(req,res){
    // var id = req.body._id.replace(/"/g,"");
    var id = req.body.id;
    var userInfo = req.body.Info;
    console.log(userInfo)
    console.log(id)

    DB.update('user',{'_id':new DB.ObjectID(id)},userInfo,function(err,data){

        if(err){
            console.log(err) 
            res.send('no')  
        }else{
            res.send("yes");
        }
        
    })

});

//通过用户名修改用户信息
router.post('/UserEdit',function(req,res){
    // var id = req.body._id.replace(/"/g,"");
    var username = req.body.username;
    var userInfo = req.body.Info;
    console.log(userInfo)
    console.log(username)

    DB.update('user',{username},userInfo,function(err,data){

        if(err){
            console.log(err)
            res.send('no')  
        }else{
            res.send("yes");
        }
        
    })

});

//修改用户密码
router.post('/uppasw',function(req,res){

    var username = req.body.username;
    var password = md5(req.body.password);
    console.log(username,password)

    DB.update('user',{'username':username},{password},function(err,data){

        if(err){
            console.log(err)
                 
        }

        res.send("yes");
    })

});

//单个用户删除
router.get('/userDelete',function(req,res){

    // var id = req.query.ID.replace(/"/g,"");  //得到get传值
    var id = req.query.ID;
    console.log(id)

    DB.delete('user',{"_id":new DB.ObjectID(id)},function(err,data){
      
        if(err){
            console.log(err)      
        }

        res.send("yes");  
    }) 

});

//多个用户删除
router.post('/usersDelete',function(req,res){

    var id = req.body.ID;

    id.map(item=>{

        DB.delete('user',{"_id":new DB.ObjectID(item)},function(err,data){
          
            if(err){
                
                console.log(err)      
            }
             
        }) 
    })
    res.send("yes"); 

});





module.exports = router;   /*暴露这个 router模块*/