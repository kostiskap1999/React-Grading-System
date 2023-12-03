var  config = require('../database/config')
const dbtoken = require('./token.js')
const util = require('util')

const query = util.promisify(config.query).bind(config)

const error = require('../errors/errorTypes')
const { errorHandling } = require('../errors/errorHandling')

async function getProjects(request) {
  try {
    await dbtoken.checkToken(request.headers.token)
    util.promisify(config.connect)
    
    const sql = `SELECT * FROM projects`
    const projects = await query(sql)

    util.promisify(config.end)
    return projects
  } catch (err) {
    errorHandling(err, "getProjects")
  }
}

async function getProject(request) {
  try {
    await dbtoken.checkToken(request.headers.token)
    util.promisify(config.connect)

    const sql = `SELECT * FROM projects WHERE id = ?`
    const projectID = [request.params.id]
    const project = await query(sql, projectID)
    
    if(project.length > 1)
      throw new error.InternalServerError("Found more than one project with this id")
    else if(project.length == 0)
      throw new error.NotFoundError("Id didn't match any projects")
    
    util.promisify(config.end)
    return project[0]
  } catch (err) {
    errorHandling(err, "getProject")
  }
}

async function getUserProjects(request) {
  try {
    await dbtoken.checkToken(request.headers.token)
    util.promisify(config.connect)
    
    var sql = `SELECT subject_id FROM user_subject WHERE user_id = ?`
    const userID = [request.params.userid]
    const subjectIDs = await query(sql, userID)

    var userProjects = [] // initialise in case it is empty    
    if (subjectIDs.length != 0){
      sql = `SELECT * FROM projects WHERE`
      sql += subjectIDs.map(() => ' id=?').join(' OR')
      userProjects = await query(sql, subjectIDs.map(subject => subject.subject_id))
    }
    
    util.promisify(config.end)
    return userProjects
  } catch (err) {
    errorHandling(err, "getUserProjects")
  }
}

async function getSubjectProjects(request) {
  try {
    await dbtoken.checkToken(request.headers.token)
    util.promisify(config.connect)

    const sql = `SELECT * FROM projects WHERE subject_id = ?`
    const subjectID = request.params.subjectid
    const subjectProjects = await query(sql, subjectID)
    
    util.promisify(config.end)
    return subjectProjects
  } catch (err) {
    errorHandling(err, "getSubjectProjects")
  }
}

async function postProjects(request) {
  try {
    util.promisify(config.connect)
    var sql = 'INSERT INTO projects (name, description, deadline, subject_id) VALUES (?, ?, ?, ?)'
    const projectValues = [request.body.name, request.body.description, request.body.deadline, request.body.subjectID]
    await query(sql, projectValues)
    
    sql = `SELECT id FROM projects WHERE id >= LAST_INSERT_ID()`
    const insertedID = await query(sql)

    for(let i=0; i<request.body.tests.length; i++){
      sql = `INSERT INTO inputs_outputs_group (project_id) VALUES (?)`
      await query(sql, insertedID[0].id)
      
      sql = `SELECT id FROM inputs_outputs_group WHERE id >= LAST_INSERT_ID()`
      const lastTestID = await query(sql)
      const groupID = lastTestID[0].id

      sql = `INSERT INTO inputs (name, code, group_id) VALUES ${request.body.tests[i].inputs.map(() => '(?, ?, ?)').join(', ')}`
      const inputValues = request.body.tests[i].inputs.flatMap(input => [input.name, input.code, groupID])
      await query(sql, inputValues)

      sql = `INSERT INTO outputs (code, group_id) VALUES (?, ?)`
      const outputValues = [request.body.tests[i].output.code, groupID]
      await query(sql, outputValues)
    }

    util.promisify(config.end)
    return true
  } catch (err) {
    errorHandling(err, "postProjects")
  }
}



module.exports = {
  getProjects: getProjects,
  getProject: getProject,
  getUserProjects: getUserProjects,
  getSubjectProjects: getSubjectProjects,
  postProjects: postProjects
}
