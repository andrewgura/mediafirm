var express = require('express');
var router = express.Router();
var pg = require("../../database.js")

router.get('/clients', async function(req, res) {
  const clients = await pg.query('SELECT * FROM clients');
  res.json({clients: clients.rows})
})

router.post('/clients', async function(req, res) {
  try{
    await pg.query(
        `INSERT INTO clients (client, clienttype, electiondate, firm) VALUES
        ($1, $2, $3, $4)`,
        [req.body.client, req.body.type, req.body.date, req.body.firm])
        res.sendStatus(200);
    } catch(e){
      console.log(e);
      res.sendStatus(400)
    }
})

router.get('/clients:id', async function(req, res) {
  var id = req.params.id;
  const clients = await pg.query('SELECT * FROM clients WHERE clientid = $1', [id]);
  res.json({clients: clients.rows})
})



router.post('/login', async function(req, res){
  console.log(req.body)
})




module.exports = router;
