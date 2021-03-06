var express = require('express');
var router = express.Router();
const auth = require('../auth.js')
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;  

//simple 글 리스트 찾아오기
router.post('/read', function(req, res, next) {
  MongoClient.connect("mongodb://localhost:27017",
  {useNewUrlParser:true},async(err,client)=>{
    if(!err){
      console.log("MongoDb Connected - readSimple")
    }
    const db = client.db("hci")
    const simple = db.collection('simple')
    console.log("simple list 불러오기 ")
    var simpleList = await simple.find().toArray()
    // console.log("simpleList " + simpleList);
    // console.log(simpleList)
    res.send(simpleList)
  })
});

router.post('/read/:id', function(req, res, next) {
  MongoClient.connect("mongodb://localhost:27017",
  {useNewUrlParser:true},async(err,client)=>{
    if(!err){
      console.log("MongoDb Connected - readSimple")
    }
    const db = client.db("hci")
    const simple = db.collection('simple')
    var id = req.params.id
    console.log("내가 쓴 simple list 불러오기 ")
    var simpleList = await simple.find({author : id}).toArray()
    // console.log("simpleList " + simpleList);
    // console.log(simpleList)
    res.send(simpleList)
  })
});

//simple 글 쓰기
router.post('/write',(req,res)=>{
  MongoClient.connect("mongodb://localhost:27017",
  {useNewUrlParser:true},async(err,client)=>{
    if(!err){
      console.log("MongoDb Connected - SimpleWrite")
    }
    const db = client.db("hci")
    const simple = db.collection('simple')


    var simpleWriteContent = req.body.simpleWriteContent
    var simpleWriteAuthor = req.body.simpleWriteAuthor
    var simpleWriteO = req.body.simpleWriteO
    var simpleWriteX = req.body.simpleWriteX
    var simplePlusContent = req.body.simplePlusContent
    var simplePlusO = req.body.simplePlusO
    var simplePlusX = req.body.simplePlusX

    console.log("사용자가 입력한 글 조건 : " + simpleWriteContent)
    console.log("사용자가 입력한 O : " + simpleWriteO)
    console.log("사용자가 입력한 X : " + simpleWriteX)
    console.log("사용자가 입력한 추가정보 내용 : " + simplePlusContent)
    console.log("사용자가 입력한 추가정보 O : " + simplePlusO)
    console.log("사용자가 입력한 추가정보 X : " + simplePlusX)
    
    await simple.insertOne(
      {
        content:simpleWriteContent, 
        author : simpleWriteAuthor,
        O:simpleWriteO, 
        X:simpleWriteX,
        plusContent : simplePlusContent,
        plusO : simplePlusO,
        plusX : simplePlusX,
        plusOvoteO : 0,
        plusOvoteX : 0,
        plusXvoteO : 0,
        plusXvoteX : 0,
        oVote:0, 
        xVote:0,

        genderMaleO:0,
        genderFemaleO:0,
        jobNoneO:0,
        jobMiddleO:0,
        jobHighO:0,
        jobUnivO:0,
        jobHouseWifeO:0,
        jobCompanyO:0,
        jobSelfO:0,
        jobArtO:0,
        jobEtcO:0,
        liveSsO:0,
        liveGgO:0,
        liveGwO:0,
        liveCcO:0,
        liveJlO:0,
        liveGsO:0,
        liveJjO:0,
        ageZeroO:0,
        ageOneO:0,
        ageTwoO:0,
        ageThreeO:0,
        ageFourO:0,
        ageUpFiveO:0,


        genderMaleX:0,
        genderFemaleX:0,
        jobNoneX:0,
        jobMiddleX:0,
        jobHighX:0,
        jobUnivX:0,
        jobHouseWifeX:0,
        jobCompanyX:0,
        jobSelfX:0,
        jobArtX:0,
        jobEtcX:0,
        liveSsX:0,
        liveGgX:0,
        liveGwX:0,
        liveCcX:0,
        liveJlX:0,
        liveGsX:0,
        liveJjX:0,
        ageZeroX:0,
        ageOneX:0,
        ageTwoX:0,
        ageThreeX:0,
        ageFourX:0,
        ageUpFiveX:0,

        voter : [],
        xvoter : [],
        ovoter : [],
        
        plusOSetter : [],
        plusXSetter : [],
        
      })
    res.send("good")
  })
})
 
//simple contentId 글에 찬성하기
router.post('/vote-o/:contentId', function(req, res, next) {
  MongoClient.connect("mongodb://localhost:27017",
  {useNewUrlParser:true},async(err,client)=>{
    if(!err){
      console.log("MongoDb Connected - simple vote-o")
    }
    const db = client.db("hci")
    const simple = db.collection('simple')
    var contentId = req.params.contentId
    var voterId  = req.body.voter
    var voterGender = req.body.voterGender + "O"
    var voterBirth = req.body.voterBirth + "O"
    var voterJob = req.body.voterJob + "O"
    var voterLive = req.body.voterLive + "O"
    console.log("찾으려는 글의 _id 값 : " + contentId)      
    var oContentId = new ObjectId(contentId);
    var test1 = await simple.findOne( {plusOSetter : {$in:[voterId]}} )
    console.log("Test1 : ----------------------------------------")
    console.log(test1)
    //투표 한 경우
    if((await simple.findOne({$and: 
      [
        {_id:oContentId},
        {voter : {$in:[voterId]}}, 
      ]
    }))){
      console.log("error")
    }else{
      //투표 안 한 경우
      console.log("OkOKOK")

      //투표 안했는데 추가정보 O에 입력한 경우
      if(await simple.findOne( {$and:[{_id:oContentId},{plusOSetter : {$in:[voterId]}} ]})){
        await simple.update({_id:oContentId},{ $inc: { oVote: 1 , [voterGender] : 1 , [voterBirth] : 1, [voterJob] : 1 , [voterLive] : 1 , plusOvoteO : 1  } })
        await simple.update({_id:oContentId},{$push: { voter : voterId , ovoter : voterId}})

      //투표 안했는데 추가정보 X에 입력한 경우
      }else if(await simple.findOne( {$and:[{_id:oContentId},{plusXSetter : {$in:[voterId]}} ]})){
        await simple.update({_id:oContentId},{ $inc: { oVote: 1 , [voterGender] : 1 , [voterBirth] : 1, [voterJob] : 1 , [voterLive] : 1 , plusXvoteO : 1  } })
        await simple.update({_id:oContentId},{$push: { voter : voterId , ovoter : voterId}})

      //투표 안했고 , 추가 정보 입력안한 경우
      }else{
        await simple.update({_id:oContentId},{ $inc: { oVote: 1 , [voterGender] : 1 , [voterBirth] : 1, [voterJob] : 1 , [voterLive] : 1  } })
        await simple.update({_id:oContentId},{$push: { voter : voterId , ovoter : voterId}})
        
      }
     
    }
    res.send("good")
  })
});

//simple contentId 글에 반대하기
router.post('/vote-x/:contentId', function(req, res, next) {
  MongoClient.connect("mongodb://localhost:27017",
  {useNewUrlParser:true},async(err,client)=>{
    if(!err){
      console.log("MongoDb Connected - simple vote-x")
    }
    const db = client.db("hci")
    const simple = db.collection('simple')
    var contentId = req.params.contentId
    var voterId  = req.body.voter 
    var voterGender = req.body.voterGender + "X"
    var voterBirth = req.body.voterBirth + "X"
    var voterJob = req.body.voterJob + "X"
    var voterLive = req.body.voterLive + "X"
    console.log("찾으려는 글의 _id 값 : " + contentId)
    var xContentId = new ObjectId(contentId);


    if((await simple.findOne({$and: 
      [
        {_id:xContentId},
        {voter : {$in:[voterId]}}, 
      ]
    }))){
      console.log("error")
    }else{
      console.log("OkOKOK")
      //투표 안했는데 추가정보 O에 입력한 경우
      if(await simple.findOne( {$and:[{_id:xContentId},{plusOSetter : {$in:[voterId]}} ]} )){
        await simple.update({_id:xContentId},{ $inc: { xVote: 1 , [voterGender] : 1 , [voterBirth] : 1, [voterJob] : 1 , [voterLive] : 1 , plusOvoteX : 1  } })
        await simple.update({_id:xContentId},{$push: { voter : voterId , xvoter : voterId}})

      //투표 안했는데 추가정보 X에 입력한 경우
      }else if(await simple.findOne({$and:[{_id:xContentId},{plusXSetter : {$in:[voterId]}} ]})){
        await simple.update({_id:xContentId},{ $inc: { xVote: 1 , [voterGender] : 1 , [voterBirth] : 1, [voterJob] : 1 , [voterLive] : 1 , plusXvoteX : 1  } })
        await simple.update({_id:xContentId},{$push: { voter : voterId , xvoter : voterId}})

      //투표 안했고 , 추가 정보 입력안한 경우
      }else{
        await simple.update({_id:xContentId},{ $inc: { xVote: 1 , [voterGender] : 1 , [voterBirth] : 1, [voterJob] : 1 , [voterLive] : 1  } })
        await simple.update({_id:xContentId},{$push: { voter : voterId , xvoter : voterId}})
        
      }
    }
    res.send("stupid")
  })
});

//simple contentId 글의 추가 정보 설정하고 / 그에 맞게 올려주기
router.post('/set-plus-o/:contentId', function(req, res, next) {
  MongoClient.connect("mongodb://localhost:27017",
  {useNewUrlParser:true},async(err,client)=>{
    if(!err){
      console.log("MongoDb Connected - set-plus-o")
    }
    const db = client.db("hci")
    const simple = db.collection('simple')
    var contentId = req.params.contentId
    var voterId  = req.body.voter
    console.log("찾으려는 글의 _id 값 : " + contentId)      
    var oContentId = new ObjectId(contentId);
   
    //있으면
    if(await simple.findOne({$and: 
      [
        {_id:oContentId},
        {
          $or : 
          [
            {plusOSetter : {$in:[voterId]}},
            {plusXSetter : {$in:[voterId]}}
          ]
        }
      ]
    })){
      console.log("set-plus-o nothing")
    }else{
      await simple.update({_id:oContentId},{$push: { plusOSetter : voterId}})
      if(await simple.findOne({$and: 
        [
          {_id:oContentId},
          {ovoter : {$in:[voterId]}}, 
        ]
      })){
        //o를 투표한 사람인 경우
        await simple.update({_id:oContentId},{ $inc: { plusOvoteO : 1} })
      }else if(await simple.findOne({$and: 
        [
          {_id:oContentId},
          {xvoter : {$in:[voterId]}}, 
        ]
      })){
        //x를 투표한 사람인 경우
        await simple.update({_id:oContentId},{ $inc: { plusOvoteX : 1} })
      }else{
        console.log("투표를 아직 안함")
      }
    }
    res.send("good")
  })
});


router.post('/set-plus-x/:contentId', function(req, res, next) {
  MongoClient.connect("mongodb://localhost:27017",
  {useNewUrlParser:true},async(err,client)=>{
    if(!err){
      console.log("MongoDb Connected - set-plus-o")
    }
    const db = client.db("hci")
    const simple = db.collection('simple')
    var contentId = req.params.contentId
    var voterId  = req.body.voter
    console.log("찾으려는 글의 _id 값 : " + contentId)      
    var xContentId = new ObjectId(contentId);
    console.log("test - 1")
    //있으면
    if(await simple.findOne({$and: 
      [
        {_id:xContentId},
        {
          $or : 
          [
            {plusOSetter : {$in:[voterId]}},
            {plusXSetter : {$in:[voterId]}}
          ]
        }
      ]
    })){
      console.log("test - 2")
      console.log("set-plus-x nothing")
    }else{
      await simple.update({_id:xContentId},{$push: { plusXSetter : voterId}})
      if(await simple.findOne({$and: 
        [
          {_id:xContentId},
          {ovoter : {$in:[voterId]}}, 
        ]
      })){
        //o를 투표한 사람인 경우
        console.log("test - 3")
        await simple.update({_id:xContentId},{ $inc: { plusXvoteO : 1} })
      }else if(await simple.findOne({$and: 
        [
          {_id:xContentId},
          {xvoter : {$in:[voterId]}}, 
        ]
      })){
        console.log("test - 4")
        //x를 투표한 사람인 경우
        await simple.update({_id:xContentId},{ $inc: { plusXvoteX : 1} })
      }else{
        console.log("test - 5")
        console.log("투표를 아직 안함")
      }
    }
    console.log("test - 6")
    res.send("good")
  })
});


router.post('/vote/:id', function(req, res, next) {
  MongoClient.connect("mongodb://localhost:27017",
  {useNewUrlParser:true},async(err,client)=>{
    if(!err){
      console.log("MongoDb Connected - readSimple")
    }
    const db = client.db("hci")
    const simple = db.collection('simple')
    var id = req.params.id
    console.log("내가 투표한 simple list 불러오기 ")
    var simpleList = await simple.find(
      {
        voter : id
      }
    ).toArray()
    console.log(simpleList)
    res.send(simpleList)
  })
});





module.exports = router;
