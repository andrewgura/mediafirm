var express = require('express')
var app = express()
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(fileUpload());


var mediabuys = require('./api/MediaBuys/MediaBuys');
var mediabuytype = require('./api/MediaBuys/MediaBuyType');
var mediabuydetail = require('./api/MediaBuys/MediaBuyDetail');
var mediamarkets = require('./api/MediaBuys/MediaMarkets');
var mediabuydetailbreakdown = require('./api/MediaBuys/MediaBuyDetailBreakdown');
var clients = require('./api/Clients/Clients');
var districts = require('./api/Districts/Districts');
var spenders = require('./api/Spenders/Spenders');
var stations = require('./api/Stations/Stations');
var excel = require('./api/excel/index.js');
var ads = require('./api/Ads/Ads');
var permissions = require('./api/Permissions/index.js');
var spenderSummary = require('./api/SpenderSummary/spenderSummary');

app.use('/api', [mediabuys, districts, mediabuytype, mediabuydetail, clients,
  mediabuydetailbreakdown, mediamarkets, spenders,
  stations, ads, excel, spenderSummary,
  permissions]);

app.listen(5000, function() {
  console.log('Example app listening on port 5000!')
})
