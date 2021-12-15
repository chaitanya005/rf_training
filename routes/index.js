var express = require('express');
var router = express.Router();
const db = require('../config/dbConfig')
const passport = require('passport');
const bcrypt = require('bcrypt');
var multer  = require('multer')
var emoji = require('node-emoji')

const intializePassport = require('../config/passport-config');

intializePassport(passport);

let base64String = "";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
  
var upload = multer({ storage: storage })

// function imageUploaded() {
//     var file = document.querySelector(
//         'input[type=file]')['files'][0];
  
//     var reader = new FileReader();
//     console.log("next");
      
//     reader.onload = function () {
//         base64String = reader.result
//     }
//     reader.readAsDataURL(file);
//     return base64String;
// }

function addUser(db, newUser) {
  console.log(newUser)
  return db
    .insert(newUser)
    .into("users")
    .then(rows => {
      return rows[0];
    });
}

function addBlog(db, newBlog) {
  console.log(newBlog)
  return db
    .insert(newBlog)
    .into("blogs")
    .then(rows => {
      return rows[0];
    });
}

router.get('/', function(req, res, next) {
  res.render('login')
});

router.get('/home', async(req, res, next) =>  {
  const blogs = await db('blogs').select('id', 'title', 'content', 'image', 'user_id', 'posted_by');
  res.render('home', {blogs});
  // if (req.isAuthenticated()) {
  //   const blogs = await db('blogs').select('id', 'title', 'content', 'image');
  //   res.render('home', {blogs});
  // }
  // else {
  //   res.redirect('/login')
  // }
});

router.get('/all-users', (req, res) => {
  const users = await db('users').select('id, user_name', 'email')
  res.send(users)
})

router.get('/add-blog', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.render('addBlog');
  } else {
    res.redirect('/login')
  }
});

router.get('/blog', function(req, res, next) {
  res.render('blog');
});

router.get('/blog/:id', async (req, res, next) => {
  const blog = await db('blogs').where({id: req.params.id}).select('title', 'content');
  console.log(blog)
  res.render('blog', {blog});
});

router.post('/add-blog', upload.single('imageupload') , async(req, res) => {
  if (req.isAuthenticated()) {
    try {
      console.log(req.user)
      const { title, content } = req.body;
      // const image = await imageUploaded(imageupload)
      const user = await addBlog(db, { title, content, image: req.file.path, user_id: req.user.id, posted_by: req.user.user_name });

      // return res.send(response)
      res.redirect('/home');
    }
    catch (err) {
      console.log(err);
    }
  } else {
      res.redirect('/login')
    }
})

router.get('/add-blog', async(req, res) => {
  if (req.files) 
  {
    console.log('sdjflskdfjsdflkjfd')
  }
})

router.get('/reactions', (req, res) => {
  let emojiList = []
  let heart = emoji.find('heart')
  let like = emoji.find('thumbsup')
  let disLike = emoji.find('thumbsdown')
  // console.log(emoji.emoji, emoji.key)
  emojiList = emojiList.concat(heart, like, disLike)
  res.send({emojiList})
})


router.get('/login', function(req, res) {
  res.render('login')
})

router.route('/login')
  .get(async function(req, res) {
    res.render('login')
  })
  .post(passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
    }));

router.get('/signup', function(req, res) {
  res.render('signup')
})

router.post('/signup', async(req, res)=> {
  try {
    console.log(req.body)
    const { email, password, full_name, user_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await addUser(db, { email, password: hashedPassword, full_name, user_name });
    res.redirect('/login');
  }
  catch (err) {
    console.log(err);
    res.redirect('/signup');
  }
})

module.exports = router;
