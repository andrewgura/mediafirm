var express = require('express');
var router = express.Router();
var pg = require("../../database.js")

//Get all groups
router.get('/permissions', async function(req, res) {
  const data = await pg.query('SELECT * from groups');
  res.json({data: data.rows})
})

//Get all users related to a specific group
router.get('/groupUsers:id', async function(req, res) {
  var id = req.params.id;

  const data = await pg.query(`
                SELECT
                      u.firstName,
                      u.lastName,
                      g.groupuserid
                FROM
                    groupusers g,
                    users u
                WHERE groupid = $1
                AND g.userid = u.userid`, [id]);
  res.json({data: data.rows})
})

//Get all districts related to a specific group
router.get('/groupDistricts:id', async function(req, res) {
  var id = req.params.id;

  const data = await pg.query(`
                SELECT
                      d.districtcode,
                      g.groupdistrictid
                FROM
                    groupdistricts g,
                    districts d
                WHERE groupid = $1
                AND g.districtid = d.districtid`, [id]);
  res.json({data: data.rows})
})

//Get all users to add to new group
router.get('/users', async function(req, res) {
  const data = await pg.query(`
                SELECT
                      u.firstname,
                      u.lastname,
                      u.userid
                FROM
                  users u
                    `);
  res.json({data: data.rows})
})

//Get all districts to add to new group
router.get('/groupdis', async function(req, res) {
  const data = await pg.query(`
                SELECT
                      d.districtcode,
                      d.districtid
                FROM
                  districts d
                    `);
  res.json({data: data.rows})
})

//Add user to the group
router.post('/users', async function(req, res) {
  try{
    await pg.query(
        `INSERT INTO groupusers (groupid, userid) VALUES
        ($1, $2)`,
        [req.body.groupid, req.body.userid])
        res.sendStatus(200);
    } catch(e){
      console.log(e);
      res.sendStatus(400)
    }
})

//Add district to the group
router.post('/groupdis', async function(req, res) {
  try{
    await pg.query(
        `INSERT INTO groupdistricts (groupid, districtid) VALUES
        ($1, $2)`,
        [req.body.groupid, req.body.districtid])
        res.sendStatus(200);
    } catch(e){
      console.log(e);
      res.sendStatus(400)
    }
})

//Create a new Group
router.post('/group', async function(req, res) {
  try{
    await pg.query(
        `INSERT INTO groups (groupname) VALUES
        ($1)`,
        [req.body.name])
        res.sendStatus(200);
    } catch(e){
      console.log(e);
      res.sendStatus(400)
    }
})

//delete user from a group
router.delete('/groupuser:id', async function(req, res) {
  var id = req.params.id
  try{
    await pg.query(`DELETE from groupusers WHERE groupuserid = $1`,[id]);
    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(400);
  }
})

//delete district from a group
router.delete('/GroupDistricts:id', async function(req, res) {
  var id = req.params.id
  try{
    await pg.query(`DELETE from groupdistricts WHERE groupdistrictid = $1`,[id]);
    res.sendStatus(200);
  } catch(e) {
    console.log(e);
    res.sendStatus(400);
  }
})

module.exports = router;
