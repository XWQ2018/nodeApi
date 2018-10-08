//引入mongodb数据库
var MongoClient = require('mongodb').MongoClient;

var dbUrl = "mongodb://localhost:27017/productmanage";

var ObjectID = require('mongodb').ObjectID;


function connectDB(callback){

    MongoClient.connect(dbUrl,function(err,client){

        if(err){

            console.log('数据库连接失败')
            return
        }

        var db = client.db('productmanage');


        callback(db)

        client.close() //关闭数据库
    })
};


//暴露objectid

exports.ObjectID = ObjectID;

//数据库查找封装
/*
 Db.find('user',{},function(err,data){
    data数据
})

 */
 //暴露方法和函数
exports.find = function(collectionname,json,callback){

        connectDB(function(db){

            var result = db.collection(collectionname).find(json);

            result.toArray(function(error,data){

                if(error){

                    console.log(error)
                    return
                }

                callback(error,data) //得到数据执行回调函数
            })

        })

}

//增加数据
exports.insert = function(collectionname,json,callback){

        connectDB(function(db){

            db.collection(collectionname).insertOne(json,function(error,data){


            callback(error,data) //得到数据执行回调函数

            })
        })

}

//修改数据
exports.update = function(collectionname,json1,json2,callback){

        connectDB(function(db){

            db.collection(collectionname).updateOne(json1,{$set:json2},function(error,data){


            callback(error,data) //得到数据执行回调函数

            })
        })

}

//删除数据
exports.delete = function(collectionname,json,callback){

        connectDB(function(db){

            db.collection(collectionname).deleteOne(json,function(error,data){

            callback(error,data) //得到数据执行回调函数

            })
        })

}