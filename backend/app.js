var createError = require('http-errors');
var express = require('express');
var  bodyParser = require('body-parser');
var  cors = require('cors');

var app = express();
var  router = express.Router();

app.use(bodyParser.urlencoded({ extended:  true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/', router);

router.use((request, response, next) => {
  // console.log(request.originalUrl);
  next();
});

var dblogin = require('./routes/login');
var dbusers = require('./routes/users');
var dbsubjects = require('./routes/subjects');
var dbprojects = require('./routes/projects');
var dbsubmissions = require('./routes/submissions');


// LOGIN ROUTER
router.route('/login').post(async (request, response) => {
  try {
    const data = await dblogin.login(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});


// USERS ROUTER
router.route('/users').get(async (request, response) => {
  try {
    const data = await dbusers.getUsers(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});

// USER ROUTER
router.route('/user/:userid').get(async (request, response) => {
  try {
    const data = await dbusers.getUser(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});

// SUBJECTS ROUTER
router.route('/subjects').get(async (request, response) => {
  try {
    const data = await dbsubjects.getSubjects(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});


// PROJECTS ROUTER
router.route('/projects').get(async (request, response) => {
  try {
    const data = await dbprojects.getProjects(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});


// PROJECT SUBMISSIONS ROUTER
router.route('/submissions/:projectid').get(async (request, response) => {
  try {
    const data = await dbsubmissions.getProjectSubmissions(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});


// USER-SUBJECTS ROUTER
router.route('/subjects/:userid').get(async (request, response) => {
  try {
    const data = await dbsubjects.getUserSubjects(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});

// SUBJECTS-PROJECTS ROUTER
router.route('/projects/:subjectid').get(async (request, response) => {
  try {
    const data = await dbprojects.getSubjectProjects(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});

// USER-PROJECTS ROUTER
router.route('/userprojects/:userid').get(async (request, response) => {
  try {
    const data = await dbprojects.getUserProjects(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});

// POST PROJECTS ROUTER
router.route('/projects').post(async (request, response) => {
  try {
    const data = await dbprojects.postProjects(request);
    response.json(data);
  } catch (err) {
    console.error(err);
    response.statusMessage=err.message
    response.status(err.statusCode).json({error: err.message});
  }
});

module.exports = app;