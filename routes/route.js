const express = require("express");
const router = express.Router();
const app = express();
const con = require("../db/connection");
const path = require("path");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(express.static('upload'))
const session = require('express-session')
const flash = require('connect-flash')
app.use(flash());
const multer = require('multer')
app.set('view engine', 'ejs')
const bodyparser = require('body-parser')
const bcrypt = require('bcrypt');
const { constants } = require("buffer");
const saltRounds = 10;




router.get('/surgeries', function (req, res) {
  res.render('surgeries')
})


router.get('/groupinsurence', function (req, res) {
  res.render('groupinsurence')
})

router.get('/providers', function (req, res) {
  res.render('providers')
})

router.get('/wellness', function (req, res) {
  res.render('wellness')
})

router.get('/payment', function (req, res) {
  res.render('payment')
})

router.get('/make_payment', function (req, res) {
  res.render('make_payment')
})

router.get('/new_consultation', function (req, res) {
  try {
    res.render('new_consultation');

  } catch (error) {
    console.log(error)
    res.redirect('/error');
  }
})

router.get('/finddoctor', function (req, res) {
  res.render('finddoctor')
})

router.get('/checkout', function (req, res) {
  res.render('checkout')
})


router.get('/header', function (req, res) {
  res.render('header')
})

router.get('/doctorprofile', function (req, res) {
  res.render('doctorprofile')
})

router.get('/security', function (req, res) {
  res.render('security')
})

router.get('/doctor', function (req, res) {
  res.render('doctor')
})

router.get('/sidebar', function (req, res) {
  res.render('sidebar')
})

router.get('/prime', function (req, res) {
  res.render('prime')
})

router.get('/add', function (req, res) {
  res.render('add')
})

router.get('/weight', function (req, res) {
  res.render('weight')
})

router.get('/skincare', function (req, res) {
  res.render('skincare')
})

router.get('/cart', function (req, res) {
  res.render('cart')
})
router.get('/google', function (req, res) {
  res.render('google')
})

router.get('/Description', function (req, res) {
  res.render('Description')
})

router.get('/usersignup', function (req, res) {
  res.render('usersignup')
})
router.get('/doctorsignup', function (req, res) {
  res.render('doctorsignup')
})
router.get('/doctorlogin', function (req, res) {
  res.render('doctorlogin')
})

router.get('/', function (req, res) {
	con.connect(function (err) {
		console.log(err);
		var sql = "select * from appointment"
		con.query(sql, function (err, result) {
			if (err) {
				console.log(err)
			} else {
				console.log(result)
				res.render('index', { result: result })
			}
		})
	})
})

router.get('/speciality/:p_speciality', function (req, res) {
	var product = req.params.p_speciality;
	var sql = `SELECT * FROM dr_profile WHERE speciality='${product}'`;
	con.query(sql, function(err, result) {
		
	  if (err) {
		console.error("Error querying database:", err);
		return;
	  }
	  var sql1 = `SELECT * FROM qna WHERE speciality='${product}'`;
	  con.query(sql1, function(err, result1) {
		if (err) {
		  console.error("Error querying database:", err);
		  return;
		}
	  var sql2 = "SELECT DISTINCT city FROM dr_profile";
	  con.query(sql2, function(err, result2) {
		if (err) {
		  console.error("Error querying database:", err);
		  return;
		}
	  var sql3 = "SELECT DISTINCT speciality FROM dr_profile";
	  con.query(sql3, function(err, result3) {
		if (err) {
		  console.error("Error querying database:", err);
		  return;
		}
		res.render("speciality", {result: result, result1: result1, result2: result2, result3: result3});
	  });
	  });
	  });
	});
  });
  router.get('/speciality/:p_speciality/:name1', function (req, res) {
    var name = req.params.name1;
    var sql = `SELECT * FROM dr_profile WHERE name='${name}'`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      else {
      var sql2 = "SELECT DISTINCT city FROM dr_profile";
      con.query(sql2, function (err, result2) {
        if (err) {
        console.error("Error querying database:", err);
        return;
        }
        var sql3 = "SELECT DISTINCT speciality FROM dr_profile";
        con.query(sql3, function (err, result3) {
        if (err) {
          console.error("Error querying database:", err);
          return;
        }
        res.render('doctor_desc', {
          result: result,
          result2: result2,
          result3: result3
        });
        })
      })
      }
    })
    });

// SESSION  ======================================
const sess_time1 = 1000 * 60 * 60 * 24;
router.use(session({
  secret: "SESS_SECRET:'{}'!@#$$#!SESS_SECRET",
  saveUninitialized: true,
  cookie: {
    maxAge: sess_time1
    // sameSite: true,
  },
  resave: false
}));


// REDIRECT LOGIN ==>
const redirectLogin1 = (req, res, next) => {
  if (!req.session.login_session_status) {
    res.redirect('/');
  }
  else {
    next();
  }
}
// API for Home Page ==>
router.get('/userlogin', async (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.clearCookie();
      }
      res.render('userlogin');
    });
  } catch (error) {
    console.log(error)
    res.redirect('/error');
  }
});

// API for Logout Page ==>
router.get('/logout1', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    }
    res.clearCookie();
    res.redirect('/')
  })
});
// user login
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Check if email exists in database
  con.query(`SELECT * FROM signin WHERE email = '${email}'`, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(401).json({ message: 'Email not found' });
    } else {
      const user = results[0];
      // Compare password hash with input password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        } else if (result) {
          // Password matches, user is authenticated
          req.session.login_session_status = true; // Store user ID in session
          req.session.email = email; // Store user ID in session
          req.session.logintype = 'User'; // Store user ID in session

          console.log(req.session) 
          res.redirect('/');
        } else {
          // Password doesn't match
          res.status(401).json({ message: 'Incorrect password' });
        }
      });
    }
  });
});

router.get('/profile', redirectLogin1, async function (req, res) {
  console.log(req.session);

  var sql1 = `SELECT * FROM signin WHERE email='${req.session.email}'`;
  var sql2 = `SELECT * FROM dr_profile WHERE email='${req.session.email}'`;

  con.query(sql1, function (err, result1) {
    console.log(sql1, result1);

    if (err) {
      console.log(err);
    }
    else {
      con.query(sql2, function (err, result2) {
        console.log(sql2, result2);

        if (err) {
          console.log(err);
        }
        else {
          res.render('profile', {
            result1: result1,
            result2: result2,
            logintype: req.session.logintype,
            logintype1: req.session.logintype1
          });
        }
      });
    }
  });
});


// register api
// handle post request to /register
router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // check if email is already registered
  con.query('SELECT * FROM signin WHERE email = ?', email, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } else if (results.length > 0) {
      res.status(400).json({ message: 'Email is already registered' });
    } else {
      // email is not registered, hash password and insert new user to database
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const user = { name, email, password: hash };
          con.query('INSERT INTO signin SET ?', user, (error, results, fields) => {
            if (error) {
              console.error(error);
              res.status(500).json({ message: 'Internal Server Error' });
            } else {
              res.redirect('/userlogin');
            }
          });
        }
      });
    }
  });
});

// doctor register
router.post('/doctorregister', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  // check if email is already registered
  con.query('SELECT * FROM dr_profile WHERE email = ?', email, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error'});
    } else if (results.length > 0) {
      res.status(400).json({ message: 'Email is already registered' });
    } else {
      // email is not registered, hash password and insert new user to database
      bcrypt.hash(password,saltRounds, (err, hash) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else {
          const user = { name, email, password: hash };
          con.query('INSERT INTO dr_profile SET ?', user, (error, results, fields) => {
            if (error) {
              console.error(error);
              res.status(500).json({ message: 'Internal Server Error' });
            } else {
              res.redirect('/doctorlogin');
            }
          });
        }
      });
    }
  });
});

const doctorSession = session({
  secret: "SESS_SECRET:'{}'!@#$$#!SSSS_SECRET",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 900000
  }
});

// doctor login
router.post('/doctorlogin',doctorSession, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // Check if email exists in database
  con.query(`SELECT * FROM dr_profile WHERE email = '${email}'`, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else if (results.length === 0) {
      res.status(401).json({ message: 'Email not found' });
    } else {
      const user = results[0];
      // Compare password hash with input password
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: 'Internal server error' });
        } else if (result) {
          // Password matches, user is authenticated
          req.session.login_session_status = true; // Store user ID in session
          req.session.email = email; // Store user ID in session
          req.session.logintype1 = 'Doctor'; // Store user ID in session
          console.log(req.session) 
          res.redirect('/');
        } else {
          // Password doesn't match
          res.status(401).json({ message: 'Incorrect password' });
        }
      });
    }
  });
});

// update doctor profile
// profile page api's multer //
var storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/upload');
  },
  filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
var upload3 = multer({ storage: storage3 });

router.post('/doctorprofile', upload3.single('image'), (req, res) => {
  const image = req.file.filename;
  console.log(image);
  const name = req.body.name;
  const gender = req.body.gender;
  const number = req.body.number;
  console.log(Number);
  const email = req.body.email;
  const speciality = req.body.speciality;
  const study = req.body.study;
  const experience = req.body.experience;
  const fees = req.body.fees;
  const address = req.body.address;
  const city = req.body.city;
  const pincode = req.body.pincode;
  const language = req.body.language;
  const description = req.body.description;
  con.query(`UPDATE dr_profile SET image='${image}',name='${name}',gender='${gender}',number='${number}',email='${email}',speciality='${speciality}',study='${study}',experience='${experience}',fees='${fees}',address='${address}',city='${city}',pincode='${pincode}',language='${language}',description='${description}' WHERE email='${email}'`, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.redirect('/profile');
    }
  });
});

// end
// book appointment for surgeries
router.post('/appointment', (req, res) => {
  try {
    const { name, contact, city } = req.body;

    con.query(
      'INSERT INTO appointments (name, contact, city) VALUES (?, ?, ?)',
      [name, contact, city],
      (error, result) => {
        if (error) {
          console.error(error);
          // Return error response
          res.status(500).json({ message: 'Internal server error' });
          return;
        }
        res.redirect('/surgeries');
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.get("/appointment", (req, res) => {
  var sql = `SELECT * FROM appointments`;
  console.log(sql)

  con.query(sql, function (err, result) {

    if (err) {
      console.log(err)
    }
    else {
      console.log(result)
      res.render("admin/appointment", { result: result, req: req });
    }
  });
});

// delete appointments
router.get("/delete12/:id", function (req, res, next) {
  con.connect(function (err) {
    con.query(`DELETE FROM appointments WHERE id= '${req.params.id}'`, function (err, result) {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/appointment")
      }
    })
  })
})
// del

router.post('/search2', function (req, res) {
  var searchTerm = req.body.searchTerm;

  var query = "SELECT * FROM appointments WHERE name LIKE '%" + searchTerm + "%'";
  console.log(query)
  con.query(query, function (error, results, fields) {
    console.log(results)
    if (error) throw error;
    res.json({ result: results });
  });
});

// contact us
router.post('/message', async (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var number = req.body.number;
  var website = req.body.website;
  var mess = req.body.mess;
  console.log(name);
  var sql = "INSERT INTO contact_us (name,email,number,website,mess) VALUES (?,?,?,?,?)";
  console.log(sql)
  con.query(sql, [name, email, number, website, mess], function (err, result) {
    console.log(result)
    if (err) throw err;
    // console.log(result)
    res.redirect("/surgeries");
  });
});


// page
router.get('/medicines', function (req, res) {
  con.connect(function (err) {
    var sql = "SELECT DISTINCT cat FROM medicine";
    con.query(sql, function (err, cat) {
      if (err) {
        console.log(err)
      } else {
        var sql = "select * from medicine"
        con.query(sql, function (err, result1) {
          if (err) {
            console.log(err)
          } else {
            res.render('medicines', { result: result1, cat: cat })
          }
        })
      }
    })
  })
})

router.get("/add_medicine", (req, res) => {
  var sql = `SELECT * FROM medicine`;
  console.log(sql)

  con.query(sql, function (err, result) {

    if (err) {
      console.log(err)
    }
    else {
      // console.log(result)
      res.render("admin/add_medicine", { result: result, req: req });
    }
  });
});



router.get("/consult_table", (req, res) => {
  var sql = `SELECT * FROM consult`;
  console.log(sql)

  con.query(sql, function (err, result) {

    if (err) {
      console.log(err)
    }
    else {
      // console.log(result)
      res.render("admin/consult_table", { result: result, req: req });
    }
  });
});


router.post('/update', async function (req, res) {
  var email = req.body.email
  var oldpassword = req.body.oldpassword;
  var newpassword = req.body.newpassword;
  var c_password = req.body.c_password;
  con.query(`SELECT * FROM users WHERE email = '${email}'`, function (err, result) {
    if (err) throw err
    if (result.length > 0) {
      con.query(`SELECT '${email}' FROM users WHERE password='${oldpassword}'`, function (err, result) {
        if (result.length > 0) {
          if (newpassword == c_password) {
            con.query(` UPDATE users SET password='${newpassword}' WHERE email='${email}'`, function (err, result) {
              if (err) throw err
              console.log(newpassword)
              res.redirect('/signuppage')
              // res.redirect("/")
            })
          } else {
            req.flash('m', "your password not match")
            res.redirect("/resetpassword")
          }
        } else {
          req.flash('m', "your old password is worng")
          res.redirect("/resetpassword")
        }
      })
    } else {
      req.flash('m', "this Email is not exist")
      res.redirect("/resetpassword")
    }
  })
})

router.get('/labtest', (req, res) => {
  const searchTerm = req.query.term;
  let sqlQuery = 'SELECT * FROM tests';
  let values = [];
  if (searchTerm) {
    sqlQuery += ' WHERE name LIKE ?';
    values = [`%${searchTerm}%`];
  }

  con.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error fetching tests from the database!');
      return;
    }

    if (searchTerm) {
      res.json(result);
    } else {
      res.render('labtest', { tests: result });
    }
  });
});


// Create POST API to insert new data into the database
router.post('/testapi', (req, res) => {
  const { name, description, price } = req.body;

  const sql = 'INSERT INTO tests (name, description, price) VALUES (?, ?, ?)';
  const values = [name, description, price];

  con.query(sql, values, (err, result) => {
    if (err) {
    
      console.error(err);
      return res.status(500).send('Failed to add test to database');
    }
    console.log('New test added to the database:', result);

    res.redirect("/add_description")
  });
});

// admin section
// SESSION  ======================================
const adminSession = session({
  secret: "SESS_SECRET:'{}'!@#$$#!SESS_SECRET",
  resave: false,
  saveUninitialized: true, 
  cookie: {
    maxAge: 900000
  }
});
// ===================================// AUTH START //========================================//
// API for Home Page =============================
router.get("/admin", async (req, res) => {
  try {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.clearCookie();
      }
      res.render("admin/login");
    });
  } catch (error) {
    console.log(error);

  }
});

// REDIRECT LOGIN ==>
const redirectLogin = (req, response, next) => {
  if (!req.session.user_id) {
    response.redirect('/');
  }
  else {
    next();
  }
}

router.get('/logout', (req, response) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err)
    }
    response.clearCookie();
    response.redirect('/admin')
  })
});

router.post("/auth", adminSession, function (req, res) {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.send("Please enter Username and Password!");
  }
  con.query(
    "SELECT * FROM login_master WHERE user_id = ? AND password = ?",
    [user_id, password],
    function (err, results) {
      if (err) throw err;
      if (results.length === 0) {
        return res.send("Invalid Username or Password!");
      }
      const status = results[0].status;
      if (status == "1") {
        req.session.login_session_status = true;
        req.session.status = status;
        req.session.user_id = user_id;
        req.session.admin_id = results[0].admin_id;
        return res.redirect("/chatbotpanel");
      } else {
        return res.redirect("/");
      }
    }
  );
});


// get product data
router.get("/product_table", redirectLogin, async (req, res) => {
  var sql = `SELECT * FROM product`;
  console.log(sql)

  con.query(sql, function (err, result) {

    if (err) {
      console.log(err)
    }
    else {
      // console.log(result)
      res.render("admin/product_table", { result: result, req: req });
    }
  });
});



// get labtest data
router.get("/labtest_table", redirectLogin, async (req, res) => {
  var sql = `SELECT * FROM tests`;
  console.log(sql)

  con.query(sql, function (err, result) {

    if (err) {
      console.log(err)
    }
    else {
      // console.log(result)
      res.render("admin/labtest_table", { result: result, req: req });
    }
  });
});

// delete labtests
router.get("/delete13/:id", function (req, res, next) {
  con.connect(function (err) {
    con.query(`DELETE FROM tests WHERE id= '${req.params.id}'`, function (err, result) {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/labtest_table")
      }
    })
  })
})

// update labtest

router.post("/labtest_update", (req, res) => {
  var id = req.body.id;
  var name = req.body.name;
  var price = req.body.price;
  var description = req.body.description;
  console.log(name)

  var sql = `UPDATE tests SET name='${name}',price='${price}',description='${description}'WHERE id='${id}'`
  console.log(sql)
  con.query(sql, function (err, result) {
    // console.log(result)
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/labtest_table')
    }
  })
})

// edit product labtest
router.post('/labtest_edit', function (req, res) {
  var id = req.body.id;
  var name = req.body;
  console.log(id, '11')
  console.log(name);
  var sql = `SELECT * FROM tests WHERE id='${id}'`;
  con.query(sql, function (error, result) {
    if (error) throw error;

    res.json({ result: result });
    // });
  });
});

router.post('/search3', function (req, res) {
  var searchTerm = req.body.searchTerm;

  var query = "SELECT * FROM tests WHERE name LIKE '%" + searchTerm + "%'";
  console.log(query)
  con.query(query, function (error, results, fields) {
    console.log(results)
    if (error) throw error;
    res.json({ result: results });
  });
});

// graph api
router.get('/signin', redirectLogin, async (req, res) => {
  // fetch data from the database
  con.query('SELECT id, email FROM signin', (error, results, fields) => {
    if (error) throw error;

    // send the data to the client
    res.json(results);
  });
});


// contact us
router.get('/message', redirectLogin, async (req, res) => {
  // fetch data from the database
  con.query('SELECT id, email FROM contact_us', (error, results, fields) => {
    if (error) throw error;

    // send the data to the client
    res.json(results);
  });
});

router.get('/product', redirectLogin, async (req, res) => {
  // fetch data from the database
  con.query('SELECT id, tags FROM product', (error, results, fields) => {
    if (error) throw error;
    // send the data to the client
    res.json(results);
  });
});

// ****Add _medicine****
router.get('/add_medicine', redirectLogin, async function (req, res) {
  var sql = "select * from medicine"
  con.query(sql, function (err, result) {
    if (err) throw err;
    res.render('add_medicine', { result: result })
  })
})

// 

router.get("/signin_table", redirectLogin, async (req, res) => {
  var sql = `SELECT * FROM signin`;
  console.log(sql)

  con.query(sql, function (err, result) {

    if (err) {
      console.log(err)
    }
    else {
      console.log(result)
      res.render("admin/signin_table", { result: result, req: req });
    }
  });
});

router.get("/group_hours", redirectLogin, async (req, res) => {

  var sql = `SELECT * FROM group_insurance`;
  con.query(sql, function (err, result) {

    if (err) {
      console.log(err)
    }
    else {
      // console.log(result)
      res.render("group_insure", { result1: result, req1: req });
    }
  });
});

router.get("/wellness_plan", redirectLogin, async (req, res) => {

  var sql = `SELECT * FROM wellness_demo`;


  con.query(sql, function (err, result) {

    if (err) {
      console.log(err)
    }
    else {
      // console.log(result)
      res.render("wellness_plan", { result1: result, req1: req });
    }
  });
});

router.post('/join_hospitals', redirectLogin, async (req, res) => {
  var category = req.body.category;
  var number = req.body.number;
  var name = req.body.name;
  var city = req.body.city;
  var sql = "INSERT INTO join_hospital (category, number, name, city) VALUES (?,?,?,?)";
  con.query(sql, [category, number, name, city], function (err, result) {
    if (err) throw err;
    res.redirect("/prime");
  });
});




// Dashboard for chatbot pannel
router.get("/chatbotpanel", redirectLogin, async (req, res) => {
  try {
    // console.log(req.session)
    res.render("admin/chatbotpanel");
  } catch (error) {
    console.log(error);
  }
});

// get data table
router.get("/canned_responses", redirectLogin, async (req, res) => {

  res.render("admin/canned_responses");
})

//setting page
router.get("/Setting", async (req, res) => {
  try {
    res.render("admin/Setting");
  } catch (error) {
    console.log(error);

  }
});

//Operators analytics page get api
router.get("/Operators_analytics", async (req, res) => {
  try {
    res.render("admin/Operators_analytics");
  } catch (error) {
    console.log(error);

  }
});

// edit dynamic product

router.post('/update_product', function (req, res) {
  var id = req.body.id;
  var name = req.body;
  console.log(id, '11')
  console.log(name);
  var sql = `SELECT * FROM product WHERE id='${id}'`;
  con.query(sql, function (error, result) {
    if (error) throw error;

    res.json({ result: result });
    // });
  });
});



// update product_table
router.post("/product1", (req, res) => {
  var id = req.body.id;
  var name = req.body.name;
  var quantity = req.body.quantity;
  var price = req.body.price;
  var manufacture = req.body.manufacture;
  var highlight = req.body.highlight;
  var description = req.body.description;
  var page = req.body.page;
  var keyingredient = req.body.keyingredient;
  var keyfeature = req.body.keyfeature;
  var howtouse = req.body.howtouse;
  var storage = req.body.storage;
  var precaution = req.body.precaution;
  console.log(name)

  var sql = `UPDATE product SET name='${name}',quantity='${quantity}',price='${price}',manufacture='${manufacture}',highlight='${highlight}',page='${page}',keyingredient='${keyingredient}',keyfeature='${keyfeature}',howtouse ='${howtouse}',storage='${storage}',precaution='${precaution}',description='${description}'WHERE id='${id}'`
  console.log(sql)
  con.query(sql, function (err, result) {
    // console.log(result)
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/product_table')
    }
  })
})

// edit_consult_data
router.post('/update_consult', function (req, res) {
  var id = req.body.id;
  var name = req.body;
  console.log(id, '11')
  console.log(name);
  var sql = `SELECT * FROM consult WHERE id='${id}'`;
  con.query(sql, function (error, result) {
    if (error) throw error;

    res.json({ result: result });
    // });
  });
});

// update product_table
router.post("/consult", (req, res) => {
  var id = req.body.id;
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var type = req.body.type;

  var sql = `UPDATE consult SET name='${name}',image='${image}',price='${price}',type='${type}'WHERE id='${id}'`
  console.log(sql)
  con.query(sql, function (err, result) {
    console.log(result)
    if (err) {
      console.log(err)
    }
    else {
      res.redirect('/consult_table')
    }
  })
})
// data search
router.post('/search', function (req, res) {
  var searchTerm = req.body.searchTerm;

  var query = "SELECT * FROM product WHERE name LIKE '%" + searchTerm + "%'";
  console.log(query)
  con.query(query, function (error, results, fields) {
    console.log(results)
    if (error) throw error;
    res.json({ result: results });
  });
});

// data search of medicine table

router.post('/medicine', function (req, res) {
  var searchTerm = req.body.searchTerm;

  var query = "SELECT * FROM medicine WHERE name LIKE '%" + searchTerm + "%'";
  console.log(query)
  con.query(query, function (error, results, fields) {
    console.log(results)
    if (error) throw error;
    res.json({ result: results });
  });
});

router.post('/search1', function (req, res) {
  var searchTerm = req.body.searchTerm;
  var query = "SELECT * FROM consult WHERE name LIKE '%" + searchTerm + "%'";
  console.log(query)
  con.query(query, function (error, results, fields) {
    console.log(results)
    if (error) throw error;
    res.json({ result: results });
  });
});


// password
router.post('/wellness_demo', (req, res) => {
  var name = req.body.name;
  var org_name = req.body.org_name;
  var number = req.body.number;
  var email = req.body.email;
  var org_size = req.body.org_size;
  var interested = req.body.interested;
  var sql = "INSERT INTO wellness_demo (name,org_name,number,email,org_size,interested) VALUES (?,?,?,?,?,?)";
  con.query(sql, [name, org_name, number, email, org_size, interested], function (err, result) {
    if (err) throw err;
    res.redirect("/wellness");
  });
});

router.post('/groupinsure', (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var number = req.body.number;
  var org_name = req.body.org_name;
  var age = req.body.age;

  var sql = "INSERT INTO group_insurance (name, email, number, org_name, age) VALUES (?,?,?,?,?)";
  con.query(sql, [name, email, number, org_name, age], function (err, result) {
    if (err) throw err;
    res.redirect("/groupinsurence");
  });
});



router.get("/join_hospital", async (req, res) => {

  var sql = `SELECT * FROM join_hospital`;
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err)
    }
    else {
      console.log(result, "lllllllllll")
      res.render("join_hospital", { result: result, req: req });
    }
  });
});


// end

// add_description

const storage = multer.diskStorage({
  destination: './public/upload',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/add_description', upload.array('images'), (req, res) => {
  var filenames = req.files.map(file => file.filename);
  var name = req.body.name;
  var quantity = req.body.quantity;
  var price = req.body.price;
  var manufacture = req.body.manufacture;
  var highlight = req.body.highlight;
  var description = req.body.description;
  var page = req.body.page;
  var keyingredient = req.body.keyingredient;
  var keyfeature = req.body.keyfeature;
  var howtouse = req.body.howtouse;
  var storage = req.body.storage;
  var precaution = req.body.precaution;

  const query = `INSERT INTO product (filename,caption,tags,image3,name,quantity,price,manufacture,highlight,description,page,keyingredient,keyfeature,howtouse,storage,precaution) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
  const values = filenames.map(filename => [filename]);
  con.query(query, [values[0], values[1], values[2], values[3], name, quantity, price, manufacture, highlight, description, page, keyingredient, keyfeature, howtouse, storage, precaution], (err, result) => {
    if (err) throw err;
    res.send('Images uploaded successfully!');
  });
});

// profile page api's multer //
var storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/upload');
  },
  filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
var upload1 = multer({ storage: storage1 });

router.post('/updateprofile',upload1.single('image'), (req, res) => {
  const image = req.file.filename;
  console.log(image)
  const name = req.body.name;
  const number = req.body.number;
  const address = req.body.address;
  const state = req.body.state;
  const email = req.body.email;
  const country = req.body.country;
  const pincode = req.body.pincode;
  const number1 = req.body.number1;
  const language = req.body.language;
  con.query(`UPDATE signin SET image='${image}',name='${name}', number='${number}', address='${address}', state='${state}', email='${email}', country='${country}', pincode='${pincode}', number1='${number1}', language='${language}' WHERE email='${email}'`, (error, results, fields) => {
    if (error) {
      console.log(results)
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.redirect('/profile');
    }
  });
});

// ****Add _description End *****

router.get('/description/:p_name/:p_page', function (req, res) {
  var p_name = req.params.p_name;
  var p_page = req.params.p_page;

  con.query(`SELECT * FROM product WHERE name='${req.params.p_name}' and page='${req.params.p_page}'`, function (err, result) {
    if (err) {
      console.log(err)
    } else {
      res.render('description', { result: result })
    }
    // })
  })
})
router.get('/add_description', function (req, res) {
  con.connect(function (err) {
    console.log(err);
    var sql = "select * from product"
    // console.log(sql)
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.render('admin/add_description', { result: result })
      }
    })
  })
})


// end
// medicine

router.get('/products_page/:p_name', function (req, res) {
  var product = req.params.p_name
  var sql = `select * from product where page='${product}'`
  con.query(sql, function (err, result) {
    if (err) throw err;
    else {
      var sql1 = `select page from abc`
      con.query(sql1, function (err, result1) {
        if (err) throw err;
        res.render('products_page', { result: result, page: result1 })
      })
    }
  })
})


// router.get('/products_page/:p_name', function (req, res) {
//   var product = req.params.p_name
//   var sql = `select * from product where page='${product}'`
//   con.query(sql, function (err, result) {
//     console.log(result)
//     if (err) throw err;
//     var sql1 = `select DISTINCT page from product`
//   con.query(sql1, function (err, result1) {
//     console.log(result)
//     if (err) throw err;
//     console.log(result);
//     res.render('products_page', { result: result ,page:result1})
//   })
// })
// })


router.post("/add_medicine", upload.single('image'), (req, res) => {
  var name = req.body.name;
  var image = req.file.filename;
  var cat = req.body.cat;
  var sql = "INSERT INTO medicine (name,image,cat) VALUES (?,?,?)";
  con.query(sql, [name, image, cat], (err, result) => {
    res.redirect('/add_description')
  })
  // }
});


// delete api of signin page
router.get("/delete6/:id", function (req, res, next) {

  console.log(req.params.id)
  con.connect(function (err) {
    con.query(`DELETE FROM signin WHERE id= '${req.params.id}'`, function (err, result) {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/signin_table")
      }
    })
  })
})


router.get("/delete9/:id", function (req, res, next) {

  console.log(req.params.id)
  con.connect(function (err) {
    con.query(`DELETE FROM product WHERE id= '${req.params.id}'`, function (err, result) {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/product_table")
      }
    })
  })
})

// delete medicine

router.get("/delete10/:id", function (req, res, next) {
  con.connect(function (err) {
    con.query(`DELETE FROM medicine WHERE id= '${req.params.id}'`, function (err, result) {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/add_medicine")
      }
    })
  })
})


// delete video consult
router.get("/delete11/:id", function (req, res, next) {
  con.connect(function (err) {
    con.query(`DELETE FROM consult WHERE id= '${req.params.id}'`, function (err, result) {
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/consult_table")
      }
    })
  })
})
// delete join_hospital

router.get("/delete3/:id", function (req, res, next) {
  console.log(req.params.id)
  con.connect(function (err) {
    con.query(`DELETE FROM join_hospital WHERE id= '${req.params.id}'`, function (err, result) {
      // console.log(req.params.id)
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/join_hospital")
      }
    })
  })
})

// delete wellness_demo

router.get("/delete4/:id", function (req, res, next) {

  console.log(req.params.id)
  con.connect(function (err) {
    con.query(`DELETE FROM wellness_demo WHERE id= '${req.params.id}'`, function (err, result) {
      // console.log(req.params.id)
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/wellness_plan")
      }
    })
  })
})


// delete group_insurance

router.get("/delete5/:id", function (req, res, next) {

  console.log(req.params.id)
  con.connect(function (err) {
    con.query(`DELETE FROM group_insurance WHERE id= '${req.params.id}'`, function (err, result) {
      // console.log(req.params.id)
      if (err) {
        console.log(err)
      }
      else {
        res.redirect("/group_hours")
      }
    })
  })
})


// get consult and dr_profile
router.get('/videoconsult',function(req,res){
	con.connect(function(err){
	
		var sql= "SELECT * FROM consult WHERE type='special'"
		con.query(sql,function(err,result1){
			if(err){
				console.log(err)
			}else{
				var sql= "SELECT * FROM consult WHERE type='common'"
		con.query(sql,function(err,result2){
			if(err){
				console.log(err)
			}else{
				var sql= "SELECT * FROM dr_profile"
		con.query(sql,function(err,result3){
			if(err){
				console.log(err)
			}else{
				res.render('videoconsult',{result1:result1,result2:result2,result3:result3})
			}})
			}
		})
	}
})
})
})


router.post('/add_consult', upload.array('images'), (req, res) => {
  var images = req.files.map(file => file.filename);
  var name = req.body.name;
  var price = req.body.price;
  var type = req.body.type;

  const query = `INSERT INTO consult (image, name, price,type) VALUES (?, ?, ?,?)`;
  con.query(query, [images, name, price, type], (err, result) => {
    if (err) throw err;
    res.redirect("/add_description")
  });
});

// post api for Profile page

var storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/upload');
  },
  filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
var upload2 = multer({ storage: storage2 });

router.post('/drprofile', upload2.single('images'), (req, res) => {
const image = req.file.filename;
const name = req.body.name;
const speciality = req.body.speciality;
const experience = req.body.experience;

const query = `INSERT INTO dr_profile (image, name, speciality, experience) VALUES (?,?,?,?)`;
con.query(query, [image, name,speciality, experience], (err, result) => {
  if (err) throw err;
//   console.log('Data inserted successfully');
  res.redirect('/add_description');
});
});
// end


router.get('/add_consult', function (req, res) {
  con.connect(function (err) {
    console.log(err);
    var sql = "select * from consult "
    // console.log(sql)
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err)
      } else {
        console.log(result)
        res.render('add_consult', { result: result })
      }
    })
  })
})
// end

// end

// otp



router.get("/error", async (req, res) => {
  res.render('error_pg');
});


router.get('/visitor_verification', (req, res) => {
  res.render('visitor_otp');
});



var today = new Date();
var today2 = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = dd + mm + yyyy;
today2 = dd + '-' + mm + '-' + yyyy;

function gfg() {
  var minm = 1000000000;
  var maxm = 9999999999;
  var randomNumber = Math.floor(Math.random() * (maxm - minm + 1)) + minm;
  return (mm + randomNumber);
}


router.post('/otpsend1', (req, res) => {
  let otpno = req.body.er02
  let mobile_number = req.body.smobile

  let messagemis = `Dear Visitor,${'\n'}Your Mobile Verification Code is ${otpno}.${'\n'}Use this code for visitor registration and this code is valid for 10 mins. only.${'\n'}Regards,${'\n'}Eicher-COCO`;

  var axios = require('axios');
  var FormData = require('form-data');
  var data = new FormData();
  data.append('api_key', 'rpBXSD593cEqORey');
  data.append('pass', '0UkwVghNJa');
  data.append('senderid', 'VECVCO');
  data.append('template_id', '1507167005021517557');
  data.append('message', `${messagemis}`);
  data.append('dest_mobileno', `${mobile_number}`);
  data.append('mtype', 'TXT');

  var config = {
    method: 'post',
    url: 'https://smscounter.com/api/otp_api.php',
    headers: {
      ...data.getHeaders()
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
})

router.post('/otpsend2', (req, res) => {
  let otpno = req.body.er04
  let mobile_number = req.body.smobile
  let messagemis = `Dear Visitor,${'\n'}Your Mobile Verification Code is ${otpno}.${'\n'}Use this code for visitor registration and this code is valid for 10 mins. only.${'\n'}Regards,${'\n'}Eicher-COCO`;

  var axios = require('axios');
  var FormData = require('form-data');
  var data = new FormData();
  data.append('api_key', 'rpBXSD593cEqORey');
  data.append('pass', '0UkwVghNJa');
  data.append('senderid', 'VECVCO');
  data.append('template_id', '1507167005021517557');
  data.append('message', `${messagemis}`);
  data.append('dest_mobileno', `${mobile_number}`);
  data.append('mtype', 'TXT');

  var config = {
    method: 'post',
    url: 'https://smscounter.com/api/otp_api.php',
    headers: {
      ...data.getHeaders()
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });


})

router.get('/kamal', function (req, res) {
  res.render('kamal')
})

router.get('/visitor_otp_verification', (req, res) => {
  try {
    res.render('visitor_otp_verification');

  } catch (error) {
    console.log(error)
    res.redirect('/error');
  }

});
// end

// Define routes for creating an appointment
router.post('/appoint', (req, res) => {
  const { doctorId, patientId, date, time } = req.body;

  // Check if the appointment time is available
  const checkQuery = `SELECT * FROM appoint WHERE doctor_id = ? AND date = ? AND time = ?`;
  con.query(checkQuery, [doctorId, date, time], (error, results) => {
    if (error) {
      console.log('Error checking appointment availability:', error);
      res.status(500).json({ message: 'Error checking appointment availability' });
      return;
    }
  
    if (results.length > 0) {
      res.status(400).json({ message: 'Appointment time is already booked' });
      return;
    }
  
    // Create a new appointment
    const insertQuery = `INSERT INTO appoint (doctor_id, patient_id, date, time) VALUES (?, ?, ?, ?)`;
    con.query(insertQuery, [doctorId, patientId, date, time], (error, results) => {
      if (error) {
        console.log('Error creating appointment:', error);
        res.status(500).json({ message: 'Error creating appointment' });
        return;
      }
  
      res.status(201).json({ message: 'Appointment created successfully' });
    });
  });
  
});

router.get('/date', function (req, res) {
  const sql = 'SELECT * FROM tests';
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Error fetching tests from the database!');
    } else {
      res.render('date', { tests: result });
    }
  });
});

module.exports = router;
