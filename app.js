var express = require('express');
var app = new express();
//引入session模块
var session = require('express-session');
//配置中间件  固定格式
app.use(session({

    secret: 'keyboard cat',
    resave: false,   
    saveUninitialized: true,
    cookie: {
        maxAge:1000*60*30  //保存30分钟
    },
    rolling:true  //强制生成cookie ID

}));

//引入模块
var admin =require('./routes/admin.js');
var index =require('./routes/index.js')


//使用ejs模板引擎  默认找views这个目录
app.set('view engine','ejs');

//配置public目录为我们的静态资源目录
app.use(express.static('public')); //使用托管静态服务中间件
app.use('/upload',express.static('upload'));


app.use('/',index);

app.use('/admin',admin);

app.listen(5555);

