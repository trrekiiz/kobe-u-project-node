var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getall', function(req,res){
  var MongoClient = mongodb.MongoClient;
  var url = 'mongodb://127.0.0.1:27017/angles';
  MongoClient.connect(url, function(err,db){
    if(err){
      console.log('Unble to connect',err);
    }else{
      console.log("Connection Established");
      var collection = db.collection('angles');
      collection.find({}).toArray(function(err, result){
        if(err){
          res.send(err);
        }else if(result.length){
          res.render('anglelist',{
            "anglelist" : result
          });
        }else{
          res.send('No document found');
        }
        db.close();
      });
    }
  });
});



module.exports = router;
