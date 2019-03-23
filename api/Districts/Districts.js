var express = require('express');
var router = express.Router();
var pg = require("../../database.js")

router.get('/districts', async function(req, res) {
  const districts = await pg.query('SELECT * FROM districts');
  res.json({districts: districts.rows})
})

//district info page
router.get('/districts:id', async function(req, res) {
  var id = req.params.id;
  const districts = await pg.query('SELECT * FROM districts WHERE districtid = $1', [id]);
  res.json({districts: districts.rows})
})

module.exports = router;
