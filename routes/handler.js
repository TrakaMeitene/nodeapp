const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const Schemas = require('../models/Schemas.js');
var bodyParser = require('body-parser')
var ObjectId = require('mongodb').ObjectID;
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://trakameitene.github.io/comments-section"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", true)
  next();
});

router.use(bodyParser.json())


//get all comments from db
router.get('', async (req, res) => {
  const data = Schemas.Comment;

 await data.find({}).sort({createdAt: 1}).exec((err, dbdata) => {
    if (err) throw err;
    if (dbdata) {
      res.end(JSON.stringify(dbdata));
    } else {
      res.end();

    }
  })
})

//update comment score
router.put("/score", (req, res) => {
  const comment = req.body.comment
  console.log(comment)
  const type = req.body.type
  const data = Schemas.Comment;

  data.findByIdAndUpdate(req.body.id, {
    "id": comment.id,
    "content": comment.content,
    "createdAt": comment.createdAt,
    "score": type === 'plus' ? comment.score + 1 : comment.score - 1,
    "user": {
      "image": {
        "png": comment.user.image.png,
        "webp": comment.user.image.webp
      },
      "username": comment.user.username
    },
    "replyTo": comment.replyingTo
  }, { upsert: true },
    function (err, dbdata) {
      if (err) throw err;
      if (dbdata) {
        res.send(dbdata);
      } else {
        res.end();
      }
    }
  ).clone().catch(function (err) { console.log(err) })
})

//get current user
router.get("/user", (req, res) => {
  const name = req.query.name
  const data = Schemas.User;

  data.find({username: name},{},
    function (err, dbdata) {
      if (err) throw err;
      if (dbdata) {
        res.send(dbdata);
      } else {
        res.end();
      }
    }
  )
})

//save new comment
router.post("/addcomment", async (req, res) => {
const reqestdata = req.body.newcomment

const newComment = new Schemas.Comment({ 

  "id": reqestdata.id,
  "content":reqestdata.content,
  "createdAt": reqestdata.createdAt,
  "score": reqestdata.score,
  "user": reqestdata.user,
  "replyTo": reqestdata.replyTo
});
await newComment.save();
res.send(newComment)
})

//update comment, that is postes by current user
router.put("/edit", (req, res) => {
  const comment = req.body.params

  const data = Schemas.Comment;

  data.findByIdAndUpdate(req.body.params._id, {
    "id": comment.id,
    "content": comment.content,
    "createdAt": comment.createdAt,
    "score": comment.score,
    "user": {
      "image": {
        "png": comment.user.image.png,
        "webp": comment.user.image.webp
      },
      "username": comment.user.username
    },
    "replyTo": comment.replyTo
  }, { upsert: false },
    function (err, dbdata) {
      if (err) throw err;
      if (dbdata) {
        res.send(dbdata);
      } else {
        res.end();
      }
    }
  ).clone().catch(function (err) { console.log(err) })
})

//delete by id of comment created of current user 
router.delete("/delete/:id", (req, res) => {
  const name = req.query
  const data = Schemas.Comment;
const id = req.body.id

data.findByIdAndRemove(id,
function (err, dbdata) {
      if (err) throw err;
      if (dbdata) {
       res.end()
      }else {
        res.end()
      }}
  );
});

module.exports = router;